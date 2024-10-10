/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { CaseReducer, createSlice, PayloadAction, Slice } from "@reduxjs/toolkit"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { RootState } from "../root"
import { settings } from "../util/settings"
import deepEqual from "fast-deep-equal"
import { useEffect, useMemo } from "react"
import {
    CaptureState,
    TelemetryDomainProvider,
    TelemetryEntry,
    TelemetryEntryWithEdges,
    TelemetryGenerator,
    TelemetryPVAT,
    TelemetrySelector,
    TelemetrySettingsType,
    TelemetryVisibilityOptions
} from "./types"
import {
    append_telemetry_items,
    get_telemetry_values,
    MAX_SAMPLES,
    reset_telemetry_state,
    telemetry_cached_domains,
    telemetry_circular_buffer
} from "./storage"

const { load, save } = settings<TelemetrySettingsType>("telemetry")

type TelemetrySliceType = {
    settings: TelemetrySettingsType
    lastCapture: TelemetryEntry
    captureState: CaptureState
    start: number
    count: number
    t: number
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
        restore: CaseReducer<TelemetrySliceType, PayloadAction<TelemetryEntry[]>>
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
            reset_telemetry_state(state)
        },
        data(state, action) {
            const count = action.payload.length

            if (
                state.captureState === CaptureState.RUNNING ||
                state.captureState === CaptureState.CAPTURING
            ) {
                append_telemetry_items(state, action.payload)
            } else if (state.captureState === CaptureState.WAITING && state.lastCapture) {
                // if waiting for trigger, find the first item of data that deviates from last capture
                // TODO: ?: we use `set` property but could be `act` also that triggers capture
                for (let n = 0; n < count; n++) {
                    const { t: _t1, ...last } = state.lastCapture
                    const { t: _t2, ...next } = action.payload[n]
                    if (!deepEqual(last, next)) {
                        state.captureState = CaptureState.CAPTURING
                        // clear data and append from this point in the incoming data
                        reset_telemetry_state(state)
                        append_telemetry_items(state, action.payload.slice(n))
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
        restore(state, action) {
            reset_telemetry_state(state)
            append_telemetry_items(state, action.payload.slice(0))
            state.captureState = CaptureState.PAUSED
        },
        pause(state) {
            state.captureState = CaptureState.PAUSED
        },
        resume(state) {
            state.captureState = CaptureState.RUNNING
            reset_telemetry_state(state)
        },
        startCapture(state) {
            state.captureState = CaptureState.WAITING
            reset_telemetry_state(state)
        },
        cancelCapture(state) {
            state.captureState = CaptureState.PAUSED
            reset_telemetry_state(state)
        }
    }
})

/**
 * @ignore - Internal to TelemetryTile
 */
export const useTelemetryControls = () => {
    const captureState = useSelector<RootState, TelemetrySliceType["captureState"]>(
        (state: RootState) => state.telemetry.captureState
    )
    const enabled = useSelector<RootState, boolean>(
        (state: RootState) => !!state.telemetry.lastCapture
    )

    const { captureDuration, plot }: TelemetrySettingsType = useSelector(
        (state: RootState) => state.telemetry.settings,
        shallowEqual
    )

    const dispatch = useDispatch()
    return useMemo(
        () => ({
            captureState,
            enabled,
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
        }),
        [captureState, enabled, captureDuration, plot]
    )
}

/**
 * @ignore - Internal to TelemetryTile
 *
 * Returns a view/accessors onto the circular buffer of telemetry data
 */
export function useTelemetryData(): {
    firstTimecode: number
    lastTimecode: number
    count: number
    data: TelemetryGenerator
    selector: TelemetrySelector
    domains: TelemetryDomainProvider
} {
    const { start, count } = useSelector<RootState, Pick<TelemetrySliceType, "start" | "count">>(
        ({ telemetry: { start, count } }) => ({ start, count }),
        shallowEqual
    )

    const last = (start + count - 1) % MAX_SAMPLES

    return useMemo(() => {
        return {
            firstTimecode: telemetry_circular_buffer[start]?.t,
            lastTimecode: telemetry_circular_buffer[last]?.t,
            count,
            *data(selection: [number, number?]): IterableIterator<TelemetryEntryWithEdges> {
                if (selection[0] < 0) {
                    selection[0] = Math.max(0, count + selection[0])
                }
                if (selection[1] === undefined) {
                    selection[1] = count
                }

                const [start_index, end_index] = selection
                for (let i = start_index; i < end_index; i++) {
                    const e = telemetry_circular_buffer[(start + i) % MAX_SAMPLES]
                    yield e
                }
            },
            selector: get_telemetry_values,
            domains(jointIndex: number, plot: TelemetryPVAT, view: TelemetryVisibilityOptions) {
                return telemetry_cached_domains[jointIndex]?.[plot]?.[view] || [0, 0]
            }
        }
    }, [start, count])
}

/**
 * @ignore - Internal to TelemetryTile
 */
export function useTelemetrySettings(): TelemetrySettingsType {
    return useSelector(({ telemetry: { settings } }: RootState) => ({ settings }), shallowEqual)
        .settings
}

export * from "./types"

// export {
//     TelemetryEntry,
//     TelemetryGenerator,
//     TelemetryPVAT,
//     TelemetrySelector,
//     TelemetryVisibilityOptions
// } from "./types"
