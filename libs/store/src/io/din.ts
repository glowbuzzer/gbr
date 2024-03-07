/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createSlice } from "@reduxjs/toolkit"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../root"
import { StatusUpdateSlice } from "../util/redux"
import { useConfig } from "../config"

export const digitalInputsSlice: StatusUpdateSlice<boolean[]> = createSlice({
    name: "din",
    initialState: [] as boolean[],
    reducers: {
        status: (state, action) => {
            return [...action.payload.status]
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
    return config.din || []
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
 * Returns a list with the current state of each digital input as `true` or `false`
 */
export function useDigitalInputs(): boolean[] {
    return useSelector((state: RootState) => state.din, shallowEqual)
}

export const safetyDigitalInputsSlice: StatusUpdateSlice<boolean[]> = createSlice({
    name: "safetyDin",
    initialState: [] as boolean[],
    reducers: {
        status: (state, action) => {
            return [...action.payload.status]
        }
    }
})

/**
 * Returns the list of configured digital inputs. The indexes of items in the list can be used with {@link useDigitalInputState} to get the current state.
 *
 * @returns The list of configured digital input names.
 */
export function useSafetyDigitalInputList() {
    const config = useConfig()
    return config.safetyDin || []
}

/**
 * Returns the state of a digital input
 *
 * @param index The index in the configuration of the digital input
 */
export function useSafetyDigitalInputState(index: number): boolean {
    return useSelector((state: RootState) => state.safetyDin[index])
}

/**
 * Returns a list with the current state of each digital input as `true` or `false`
 */
export function useSafetyDigitalInputs(): boolean[] {
    return useSelector((state: RootState) => state.safetyDin)
}

export const externalDigitalInputsSlice: StatusUpdateSlice<boolean[]> = createSlice({
    name: "externalDin",
    initialState: [] as boolean[],
    reducers: {
        status: (state, action) => {
            return [...action.payload.status]
        }
    }
})

/**
 * Returns the list of configured digital inputs. The indexes of items in the list can be used with {@link useDigitalInputState} to get the current state.
 *
 * @returns The list of configured digital input names.
 */
export function useExternalDigitalInputList() {
    const config = useConfig()
    return config.externalDin
}

/**
 * Returns the state of a digital input
 *
 * @param index The index in the configuration of the digital input
 */
export function useExternalDigitalInputState(index: number): boolean {
    return useSelector((state: RootState) => state.externalDin[index])
}

/**
 * Returns a list with the current state of each digital input as `true` or `false`
 */
export function useExternalSafetyDigitalInputs(): boolean[] {
    return useSelector((state: RootState) => state.externalDin)
}
