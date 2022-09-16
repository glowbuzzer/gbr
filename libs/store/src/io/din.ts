/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createSlice } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { RootState } from "../root"
import { StatusUpdateSlice } from "../util/redux"
import { useConfig } from "../config"

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
 * Returns the list of configured digital inputs. The indexes of items in the list can be used with {@link useDigitalInputState} to get the current state.
 *
 * @returns The list of configured digital input names.
 */
export function useDigitalInputList() {
    const config = useConfig()
    return config.din
}

/**
 * Returns the state of a digital input
 *
 * @param index The index in the configuration of the digital input
 */
export function useDigitalInputState(index: number): boolean {
    return useSelector((state: RootState) => state.din[index])
}

/**
 * Returns the bitmask of the digital input states, where the bit is set if the input is high, with the lowest bit
 * corresponding to the first input in the configuration.
 */
export function useDigitalInputBits() {
    const bits = useSelector((state: RootState) => state.din)
    return bits.reduce((acc, bit, index) => {
        if (bit) {
            acc |= 1 << index
        }
        return acc
    }, 0)
}

/**
 * Returns a list with the current state of each digital input as `true` or `false`
 */
export function useDigitalInputs(): boolean[] {
    return useSelector((state: RootState) => state.din)
}
