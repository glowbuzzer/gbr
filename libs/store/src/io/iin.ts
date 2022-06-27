/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createSlice } from "@reduxjs/toolkit"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../root"
import { StatusUpdateSlice } from "../util/redux"

export const integerInputsSlice: StatusUpdateSlice<number[]> = createSlice({
    name: "iin",
    initialState: [] as number[],
    reducers: {
        status: (state, action) => {
            return [...action.payload]
        }
    }
})

/**
 * Returns the current state of all integer inputs as an array.
 *
 * For example:
 * ```jsx
 * const iins=useIntegerInputs()
 * console.log(iins[2])
 * ```
 *
 * The names given to integer inputs can be discovered using {@link useConfig}.
 */
export function useIntegerInputs() {
    return useSelector(({ iin }: RootState) => iin, shallowEqual)
}
