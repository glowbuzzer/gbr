/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createSlice } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { RootState } from "../root"
import deepEqual from "fast-deep-equal"
import { StatusUpdateSlice } from "../util/redux"

export const digitalInputsSlice: StatusUpdateSlice<boolean[]> = createSlice({
    name: "din",
    initialState: [] as boolean[],
    reducers: {
        status: (state, action) => {
            return [...action.payload]
        }
    }
})

/**
 * Returns the current state of all digital inputs as an array.
 *
 * For example:
 * ```jsx
 * const dins=useDigitalInputs()
 * console.log(dins[2])
 * ```
 *
 * The names given to digital inputs can be discovered using {@link useConfig}.
 */
export function useDigitalInputs(): boolean[] {
    return useSelector(({ din }: RootState) => din, deepEqual)
}
