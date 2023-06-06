/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createSlice } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { RootState } from "../root"
import { StatusUpdateSlice } from "../util/redux"
import { useConfig } from "../config"

export const integerInputsSlice: StatusUpdateSlice<number[]> = createSlice({
    name: "iin",
    initialState: [] as number[],
    reducers: {
        status: (state, action) => {
            return [...action.payload.status]
        }
    }
})

/**
 * Returns the list of configured integer input names. The index of names in the list can be used with {@link useIntegerInputState}.
 *
 * @returns The list of configured integer input names.
 */
export function useIntegerInputList() {
    const config = useConfig()
    return config.iin
}

/**
 * Returns the state of an integer input
 *
 * @param index The index in the configuration of the integer input
 */
export function useIntegerInputState(index: number): number {
    return useSelector((state: RootState) => state.iin[index])
}
