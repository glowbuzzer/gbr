/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createSlice } from "@reduxjs/toolkit"
import { shallowEqual, useSelector } from "react-redux"
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
 * Returns the list of configured integer inputs. The index of items in the list can be used with {@link useIntegerInputState}.
 *
 * @returns The configuration of all integer inputs.
 */
export function useIntegerInputList() {
    const config = useConfig()
    return config.iin
}

/**
 * Returns the state of all integer inputs.
 */
export function useIntegerInputs() {
    return useSelector((state: RootState) => state.iin, shallowEqual)
}

/**
 * Returns the state of an integer input
 *
 * @param index The index in the configuration of the integer input
 */
export function useIntegerInputState(index: number): number {
    return useSelector((state: RootState) => state.iin[index])
}

export const unsignedIntegerInputsSlice: StatusUpdateSlice<number[]> = createSlice({
    name: "uiin",
    initialState: [] as number[],
    reducers: {
        status: (state, action) => {
            return [...action.payload.status]
        }
    }
})

/**
 * Returns the list of configured unsigned integer input names. The index of names in the list can be used with {@link useUnsignedIntegerInputState}.
 *
 * @returns The list of configured integer input names.
 */
export function useUnsignedIntegerInputList() {
    const config = useConfig()
    return config.uiin
}

/** Returns the list of unsigned integer input values */
export function useUnsignedIntegerInputs() {
    return useSelector((state: RootState) => state.uiin, shallowEqual)
}

/**
 * Returns the state of an integer input
 *
 * @param index The index in the configuration of the unsigned integer input
 */
export function useUnsignedIntegerInputState(index: number): number {
    return useSelector((state: RootState) => state.uiin[index])
}

// External --------------------------------------

export const externalIntegerInputsSlice: StatusUpdateSlice<number[]> = createSlice({
    name: "externalIin",
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
export function useExternalIntegerInputList() {
    const config = useConfig()
    return config.externalIin
}

/** Returns the list of external integer input values */
export function useExternalIntegerInputs() {
    return useSelector((state: RootState) => state.externalIin, shallowEqual)
}

/**
 * Returns the state of an integer input
 *
 * @param index The index in the configuration of the integer input
 */
export function useExternalIntegerInputState(index: number): number {
    return useSelector((state: RootState) => state.externalIin[index])
}

export const externalUnsignedIntegerInputsSlice: StatusUpdateSlice<number[]> = createSlice({
    name: "externalUiin",
    initialState: [] as number[],
    reducers: {
        status: (state, action) => {
            return [...action.payload.status]
        }
    }
})

/**
 * Returns the list of configured unsigned integer input names. The index of names in the list can be used with {@link useUnsignedIntegerInputState}.
 *
 * @returns The list of configured integer input names.
 */
export function useExternalUnsignedIntegerInputList() {
    const config = useConfig()
    return config.externalUiin
}

/** Returns the list of external unsigned integer input values */
export function useExternalUnsignedIntegerInputs() {
    return useSelector((state: RootState) => state.externalUiin, shallowEqual)
}

/**
 * Returns the state of an integer input
 *
 * @param index The index in the configuration of the unsigned integer input
 */
export function useExternalUnsignedIntegerInputState(index: number): number {
    return useSelector((state: RootState) => state.externalUiin[index])
}
