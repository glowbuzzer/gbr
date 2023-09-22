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

export enum TelemetryPVA {
    POS = "p",
    VEL = "v",
    ACC = "a"
}
export type TelemetrySettingsType = {
    captureDuration: number
    plot: TelemetryPVA
}

export enum CaptureState {
    RUNNING,
    PAUSED,
    WAITING,
    CAPTURING,
    COMPLETE
}

type TelemetryEntry = GlowbuzzerStatus["telemetry"][0]

type TelemetrySliceType = {
    settings: TelemetrySettingsType
    data: TelemetryEntry[]
    lastCapture: TelemetryEntry
    captureState: CaptureState
    t: number
}

const MAX_SAMPLES = 3000

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
        data: [],
        lastCapture: null,
        captureState: CaptureState.PAUSED,
        t: 0,
        settings: {
            captureDuration: 1000,
            plot: TelemetryPVA.POS
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
            state.data.splice(0)
            state.lastCapture = null
        },
        data(state, action) {
            if (
                state.captureState === CaptureState.RUNNING ||
                state.captureState === CaptureState.CAPTURING
            ) {
                state.data.push(
                    ...action.payload.map((d, index) => ({
                        t: state.t + index,
                        ...d
                    }))
                )
                if (state.data.length > MAX_SAMPLES) {
                    state.data.splice(0, state.data.length - MAX_SAMPLES)
                }
                state.t += action.payload.length
            } else if (state.captureState === CaptureState.WAITING && state.lastCapture) {
                // if waiting for trigger, find the first bit of data that deviates from last capture
                for (let n = 0; n < action.payload.length; n++) {
                    if (!deepEqual(state.lastCapture.set, action.payload[n].set)) {
                        state.captureState = CaptureState.CAPTURING
                        // clear data and append from this point in the incoming data
                        state.data.splice(0)
                        state.data.push(...action.payload.slice(n))
                        break
                    }
                }
            }

            if (
                state.captureState === CaptureState.CAPTURING &&
                state.data.length >= state.settings.captureDuration
            ) {
                state.captureState = CaptureState.COMPLETE
            }

            state.lastCapture = action.payload[action.payload.length - 1]
        },
        pause(state) {
            state.captureState = CaptureState.PAUSED
        },
        resume(state) {
            state.captureState = CaptureState.RUNNING
            state.lastCapture = null
            state.data.splice(0)
        },
        startCapture(state) {
            state.captureState = CaptureState.WAITING
            state.lastCapture = null
            state.data.splice(0)
        },
        cancelCapture(state) {
            state.captureState = CaptureState.PAUSED
            state.lastCapture = null
            state.data.splice(0)
        }
    }
})

/**
 * @ignore - Internal to TelemetryTile
 */
export const useTelemetryControls = () => {
    const captureState = useSelector(
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
        setPlot(value: TelemetryPVA) {
            dispatch(
                telemetrySlice.actions.settings({
                    plot: value
                })
            )
        }
    }
}

/**
 * @ignore - Internal to TelemetryTile
 */
export function useTelemetryData(): TelemetryEntry[] {
    return useSelector(({ telemetry: { data } }: RootState) => ({ data }), shallowEqual).data
}

/**
 * @ignore - Internal to TelemetryTile
 */
export function useTelemetrySettings(): TelemetrySettingsType {
    return useSelector(({ telemetry: { settings } }: RootState) => ({ settings }), shallowEqual)
        .settings
}
