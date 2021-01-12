import { createSlice } from "@reduxjs/toolkit"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../root"

export const integerInputsSlice = createSlice({
    name: "iin",
    initialState: [] as number[],
    reducers: {
        status: (state, action) => {
            return [...action.payload]
        }
    }
})

export function useIntegerInputs() {
    return useSelector(({ iin }: RootState) => iin, shallowEqual)
}
