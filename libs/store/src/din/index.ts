import { createSlice } from "@reduxjs/toolkit"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../root"

export const digitalInputsSlice = createSlice({
    name: "din",
    initialState: [] as boolean[],
    reducers: {
        status: (state, action) => {
            // called with status.joints from the json every time board sends status message
            return [...action.payload]
        }
    }
})

export function useDigitalInputs() {
    return useSelector(({ din }: RootState) => din, shallowEqual)
}
