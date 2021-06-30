import { createSlice } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { RootState } from "../root"
import deepEqual from "fast-deep-equal"

export const digitalInputsSlice = createSlice({
    name: "din",
    initialState: [] as boolean[],
    reducers: {
        status: (state, action) => {
            return [...action.payload]
        }
    }
})

export function useDigitalInputs() {
    return useSelector(({ din }: RootState) => din, deepEqual)
}
