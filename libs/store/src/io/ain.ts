/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createSlice } from "@reduxjs/toolkit"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../root"
import { StatusUpdateSlice } from "../util/redux"

export const analogInputsSlice: StatusUpdateSlice<number[]> = createSlice({
    name: "ain",
    initialState: [] as number[],
    reducers: {
        status: (state, action) => {
            return [...action.payload]
        }
    }
})

/**
 * Returns the current state of all analog inputs as an array.
 *
 * For example:
 * ```jsx
 * const ains=useAnalogInputs()
 * console.log(ains[2])
 * ```
 *
 * The names given to analog inputs can be discovered using {@link useConfig}.
 */
export function useAnalogInputs() {
    return useSelector(({ ain }: RootState) => ain, shallowEqual)
}
