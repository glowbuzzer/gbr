/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { CaseReducer, createSlice, PayloadAction, Slice } from "@reduxjs/toolkit"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { RootState } from "../root"
import { settings } from "../util/settings"
import { GlowbuzzerStatus } from "../gbc_extra"
import deepEqual from "fast-deep-equal"

const { load, save } = settings("telemetry")

export enum TelemetryPVAT {
    POS = "p",
    VEL = "v",
    ACC = "a",
    TORQUE = "t"
}

export type TelemetrySettingsType = {
    captureDuration: number
    plot: TelemetryPVAT
}

export enum CaptureState {
    RUNNING,
    PAUSED,
    WAITING,
    CAPTURING,
    COMPLETE
}

type TelemetryEntry = GlowbuzzerStatus["telemetry"][0]
// type TelemetrySet = TelemetryEntry["set"][0]

const MAX_SAMPLES = 3000
const data: TelemetryEntry[] = Array(MAX_SAMPLES)

// this doesn't work when we want to diff set and act values
// // maintain a list of domains for each telemetry type
// const EMPTY_DOMAINS = {
//     p: [0, 0],
//     v: [0, 0],
//     a: [0, 0],
//     t: [0, 0],
//     to: [0, 0]
// }
// const domains: { [key in keyof TelemetrySet]: number[] } = EMPTY_DOMAINS

type TelemetrySliceType = {
    settings: TelemetrySettingsType
    lastCapture: TelemetryEntry
    captureState: CaptureState
    start: number
    count: number
    t: number
}

function reset(state: TelemetrySliceType) {
    state.start = 0
    state.count = 0
    state.lastCapture = null
    // Object.assign(domains, EMPTY_DOMAINS)
}

// function update_domains(entry: TelemetryEntry) {
//     for (const e of entry.set) {
//         for (const key in e) {
//             const set = e[key]
//             const act = entry.act[key] || 0 // torque offset `to` is not in act
//             const domain = domains[key]
//             domain[0] = Math.min(domain[0], Math.min(set, act))
//             domain[1] = Math.max(domain[1], Math.max(set, act))
//         }
//     }
// }

function append(state: TelemetrySliceType, payload: TelemetryEntry[]) {
    const count = payload.length
    payload.forEach((d, index) => {
        const pos = (state.start + state.count + index) % MAX_SAMPLES
        // const cos = Math.cos(d.t / 50)
        // const sin = Math.sin(d.t / 50)
        data[pos] = {
            ...d
            // set: [
            //     {
            //         p: cos,
            //         v: -sin,
            //         a: -cos,
            //         t: sin,
            //         to: 0
            //     }
            // ],
            // act: [
            //     {
            //         p: sin,
            //         v: cos,
            //         a: -sin,
            //         t: -cos
            //     }
            // ]
        }
    })
    const new_count = state.count + count
    if (new_count >= MAX_SAMPLES) {
        const overflow = new_count - MAX_SAMPLES
        state.start = (state.start + overflow) % MAX_SAMPLES
        state.count = MAX_SAMPLES
    } else {
        state.count = new_count
    }
}

export const telemetrySlice: Slice<
    TelemetrySliceType,
    {
        loadSettings: CaseReducer<TelemetrySliceType>
        init: CaseReducer<TelemetrySliceType>
        pause: CaseReducer<TelemetrySliceType>
        resume: CaseReducer<TelemetrySliceType>
        startCapture: CaseReducer<TelemetrySliceType>
        cancelCapture: CaseReducer<TelemetrySliceType>
        data: CaseReducer<TelemetrySliceType, PayloadAction<TelemetryEntry[]>>
        settings: CaseReducer<TelemetrySliceType, PayloadAction<Partial<TelemetrySettingsType>>>
    }
> = createSlice({
    name: "telemetry",
    initialState: {
        lastCapture: null,
        captureState: CaptureState.PAUSED,
        t: 0,
        start: 0,
        count: 0,
        settings: {
            captureDuration: 1000,
            plot: TelemetryPVAT.POS
        }
    } as TelemetrySliceType,
    reducers: {
        loadSettings(state) {
            return { ...state, settings: { ...state.settings, ...load() } }
        },
        settings(state, action) {
            state.settings = {
                ...state.settings,
                ...action.payload
            }
            save(state.settings)
        },
        init(state) {
            reset(state)
        },
        data(state, action) {
            const count = action.payload.length
            if (
                state.captureState === CaptureState.RUNNING ||
                state.captureState === CaptureState.CAPTURING
            ) {
                append(state, action.payload)
            } else if (state.captureState === CaptureState.WAITING && state.lastCapture) {
                // if waiting for trigger, find the first bit of data that deviates from last capture
                for (let n = 0; n < count; n++) {
                    if (!deepEqual(state.lastCapture.set, action.payload[n].set)) {
                        state.captureState = CaptureState.CAPTURING
                        // clear data and append from this point in the incoming data
                        reset(state)
                        append(state, action.payload.slice(n))
                        break
                    }
                }
            }

            if (
                state.captureState === CaptureState.CAPTURING &&
                state.count >= state.settings.captureDuration
            ) {
                state.captureState = CaptureState.COMPLETE
            }

            state.lastCapture = action.payload[count - 1]
        },
        pause(state) {
            state.captureState = CaptureState.PAUSED
        },
        resume(state) {
            state.captureState = CaptureState.RUNNING
            reset(state)
        },
        startCapture(state) {
            state.captureState = CaptureState.WAITING
            reset(state)
        },
        cancelCapture(state) {
            state.captureState = CaptureState.PAUSED
            reset(state)
        }
    }
})

/**
 * @ignore - Internal to TelemetryTile
 */
export const useTelemetryControls = () => {
    const captureState = useSelector<RootState, TelemetrySliceType["captureState"]>(
        (state: RootState) => state.telemetry.captureState,
        shallowEqual
    )
    const lastCapture = useSelector((state: RootState) => state.telemetry.lastCapture, shallowEqual)
    const { captureDuration, plot } = useSelector(
        (state: RootState) => state.telemetry.settings,
        shallowEqual
    )
    const dispatch = useDispatch()
    return {
        captureState,
        lastCapture,
        captureDuration,
        plot,
        pause() {
            dispatch(telemetrySlice.actions.pause())
        },
        resume() {
            dispatch(telemetrySlice.actions.resume())
        },
        startCapture() {
            dispatch(telemetrySlice.actions.startCapture())
        },
        cancelCapture() {
            dispatch(telemetrySlice.actions.cancelCapture())
        },
        setDuration(value: number) {
            dispatch(
                telemetrySlice.actions.settings({
                    captureDuration: value
                })
            )
        },
        setPlot(value: TelemetryPVAT) {
            dispatch(
                telemetrySlice.actions.settings({
                    plot: value
                })
            )
        }
    }
}

export type TelemetryGenerator = <T>(
    domain: [number, number?],
    mapFn: (e: TelemetryEntry) => T
) => IterableIterator<T>

/**
 * @ignore - Internal to TelemetryTile
 */
export function useTelemetryData(): {
    firstTimecode: number
    lastTimecode: number
    count: number
    data: TelemetryGenerator
} {
    const { start, count } = useSelector<RootState, Pick<TelemetrySliceType, "start" | "count">>(
        ({ telemetry: { start, count } }) => ({ start, count }),
        shallowEqual
    )

    const last = (start + count - 1) % MAX_SAMPLES

    return {
        firstTimecode: data[start]?.t,
        lastTimecode: data[last]?.t,
        count,
        *data<T>(domain: [number, number?], mapFn: (e: TelemetryEntry) => T): IterableIterator<T> {
            if (domain[0] < 0) {
                domain[0] = Math.max(0, count + domain[0])
            }
            if (domain[1] === undefined) {
                domain[1] = count
            }

            const [start_index, end_index] = domain
            for (let i = start_index; i < end_index; i++) {
                const e = data[(start + i) % MAX_SAMPLES]
                if (!e) {
                    console.log("no data", start, i, count)
                    continue
                }
                yield mapFn(e)
            }
        }
    }
}

/**
 * @ignore - Internal to TelemetryTile
 */
export function useTelemetrySettings(): TelemetrySettingsType {
    return useSelector(({ telemetry: { settings } }: RootState) => ({ settings }), shallowEqual)
        .settings
}
