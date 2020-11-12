import { createSlice } from "@reduxjs/toolkit"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../root"

export type TelemetrySettingsType = {
    cartesianEnabled: boolean
    cartesianAxes: boolean[]
    jointsEnabled: boolean
    joints: boolean[]
    posEnabled: boolean
    velEnabled: boolean
    accEnabled: boolean
}

type TelemetrySlice = {
    settings: TelemetrySettingsType
    data: any[]
    t: number
}
export const telemetrySlice = createSlice({
    name: "telemetry",
    initialState: {
        data: [],
        t: 0,
        settings: {
            cartesianEnabled: true,
            jointsEnabled: false,
            cartesianAxes: [true, true, false],
            joints: [true, true, true, true, true, true],
            posEnabled: true,
            velEnabled: false,
            accEnabled: false
        }
    } as TelemetrySlice,
    reducers: {
        settings(state, action) {
            state.settings = action.payload
        },
        data(state, action) {
            state.data.push(
                ...action.payload.map((d, index) => ({
                    t: state.t + index,
                    ...d
                }))
            )
            state.t += action.payload.length
            if (state.data.length > 500) {
                state.data.splice(0, state.data.length - 500)
            }
        }
    }
})

export const useTelemetryData = () => {
    return useSelector(({ telemetry: { data } }: RootState) => ({ data }), shallowEqual).data
}

export const useTelemetrySettings = (): TelemetrySettingsType => {
    return useSelector(({ telemetry: { settings } }: RootState) => ({ settings }), shallowEqual).settings
}
