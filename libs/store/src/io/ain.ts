import { createSlice } from "@reduxjs/toolkit"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../root"

export const analogInputsSlice = createSlice({
    name: "ain",
    initialState: [] as number[],
    reducers: {
        status: (state, action) => {
            return [...action.payload]
        }
    }
})

export function useAnalogInputs() {
    return useSelector(({ ain }: RootState) => ain, shallowEqual)
}
