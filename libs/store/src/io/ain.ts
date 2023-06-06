/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createSlice } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { RootState } from "../root"
import { StatusUpdateSlice } from "../util/redux"
import { useConfig } from "../config"

export const analogInputsSlice: StatusUpdateSlice<number[]> = createSlice({
    name: "ain",
    initialState: [] as number[],
    reducers: {
        status: (state, action) => {
            return [...action.payload.status]
        }
    }
})

/**
 * Returns the list of configured analog input names. The index of names in the list can be used with {@link useAnalogInputState}.
 *
 * @returns The list of configured analog input names.
 */
export function useAnalogInputList() {
    const config = useConfig()
    return config.ain
}

/**
 * Returns the state of an analog input
 *
 * @param index The index in the configuration of the analog input
 */
export function useAnalogInputState(index: number): number {
    return useSelector((state: RootState) => state.ain[index])
}
