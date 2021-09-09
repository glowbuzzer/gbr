import { createSlice } from "@reduxjs/toolkit"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { RootState } from "../root"
import { settings } from "../util/settings"

const { load, save } = settings("telemetry")

export type TelemetrySettingsType = {
    cartesianEnabled: boolean
    cartesianAxes: boolean[]
    jointsEnabled: boolean
    queueEnabled: boolean
    joints: boolean[]
    posEnabled: boolean
    velEnabled: boolean
    accEnabled: boolean
    captureDuration: number
}

export enum CaptureState {
    CONTINUOUS,
    PAUSED,
    WAITING,
    TRIGGERED,
    COMPLETE
}

type TelemetryEntry = {
    t: number
    m4cap: number
    m7cap: number
    m7wait: number
    joints: number[]
    x: number
    y: number
    z: number
}

type TelemetrySlice = {
    settings: TelemetrySettingsType
    data: TelemetryEntry[]
    lastCapture
    captureState: CaptureState
    t: number
}

function compare_captures(a, b) {
    // do a shallow compare of the keys we're interested in
    // changes to these properties will trigger start of capture
    for (const k of ["x", "y", "z", "joints"]) {
        if (!shallowEqual(a[k], b[k])) {
            return false
        }
    }
    return true
}

export const telemetrySlice = createSlice({
    name: "telemetry",
    initialState: {
        data: [],
        lastCapture: null,
        captureState: CaptureState.PAUSED,
        t: 0,
        settings: {
            cartesianEnabled: true,
            jointsEnabled: false,
            cartesianAxes: [true, true, false],
            joints: [true, true, true, true, true, true],
            posEnabled: true,
            velEnabled: false,
            accEnabled: false,
            captureDuration: 1000,
            ...load()
        }
    } as TelemetrySlice,
    reducers: {
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
                state.captureState === CaptureState.CONTINUOUS ||
                state.captureState === CaptureState.TRIGGERED
            ) {
                state.data.push(
                    ...action.payload.map((d, index) => ({
                        t: state.t + index,
                        ...d
                    }))
                )
                if (state.data.length > 5000) {
                    state.data.splice(0, state.data.length - 5000)
                }
                state.t += action.payload.length
            } else if (state.captureState === CaptureState.WAITING && state.lastCapture) {
                // if waiting for trigger, find the first bit of data that deviates from last capture
                for (let n = 0; n < action.payload.length; n++) {
                    if (!compare_captures(state.lastCapture, action.payload[n])) {
                        state.captureState = CaptureState.TRIGGERED
                        // clear data and append from this point in the incoming data
                        state.data.splice(0)
                        state.data.push(...action.payload.slice(n))
                        break
                    }
                }
            }

            if (
                state.captureState === CaptureState.TRIGGERED &&
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
            state.captureState = CaptureState.CONTINUOUS
            state.lastCapture = null
            state.data.splice(0)
        },
        startCapture(state) {
            state.captureState = CaptureState.WAITING
            state.lastCapture = null
            state.data.splice(0)
        },
        cancelCapture(state) {
            state.captureState = CaptureState.CONTINUOUS
            state.lastCapture = null
            state.data.splice(0)
        }
    }
})

export const useTelemetryControls = () => {
    const captureState = useSelector(
        (state: RootState) => state.telemetry.captureState,
        shallowEqual
    )
    const captureDuration = useSelector(
        (state: RootState) => state.telemetry.settings.captureDuration,
        shallowEqual
    )
    const dispatch = useDispatch()
    return {
        captureState,
        captureDuration,
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
        }
    }
}

export const useTelemetryData = () => {
    return useSelector(({ telemetry: { data } }: RootState) => ({ data }), shallowEqual).data
}

export const useTelemetrySettings = (): TelemetrySettingsType => {
    return useSelector(({ telemetry: { settings } }: RootState) => ({ settings }), shallowEqual)
        .settings
}
