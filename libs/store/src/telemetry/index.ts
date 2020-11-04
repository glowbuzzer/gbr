import { createSlice } from "@reduxjs/toolkit"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../root"

export const telemetrySlice = createSlice({
    name: "telemetry",
    initialState: { data: [], t: 0 },
    reducers: {
        data: (state, action) => {
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

export const useTelemetry = () => {
    const { data } = useSelector(({ telemetry: { data } }: RootState) => ({ data }), shallowEqual)
    return data
}
