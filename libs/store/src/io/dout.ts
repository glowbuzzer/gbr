/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createSlice } from "@reduxjs/toolkit"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../root"
import { useMemo, useRef } from "react"
import deepEqual from "fast-deep-equal"
import { useConfig } from "../config"
import { useConnection } from "../connect"
import { StatusUpdateSlice } from "../util/redux"
import { DigitalOutputStatus } from "../gbc_extra"
import { SafetyDigitalOutputStatus } from "../gbc_extra"

function useGenericDigitalOutputState(
    index: number,
    type: "dout" | "safetyDout" | "externalDout"
): [
    {
        /** The current effective value */
        effectiveValue?: boolean
        /** The desired value */
        setValue?: boolean
        /** Whether the desired value should override the value last set by an activity */
        override?: boolean
    },
    (setValue: boolean, override?: boolean) => void
] {
    const connection = useConnection()
    const ref = useRef<DigitalOutputStatus>(null)
    const dout = useSelector((root: RootState) => root[type][index], shallowEqual) || {
        effectiveValue: false,
        setValue: false,
        override: false
    }

    // compare ref value of dout with latest from store
    if (!deepEqual(ref.current, dout)) {
        ref.current = dout
    }

    const value = ref.current
    return useMemo(
        () => [
            value,
            (value: boolean, override = true) => {
                connection.send(
                    JSON.stringify({
                        command: {
                            [type]: {
                                [index]: {
                                    command: {
                                        setValue: value ? 1 : 0,
                                        override
                                    }
                                }
                            }
                        }
                    })
                )
            }
        ],
        [index, value, connection, type]
    )
}

export const digitalOutputsSlice: StatusUpdateSlice<DigitalOutputStatus[]> = createSlice({
    name: "dout",
    initialState: [] as DigitalOutputStatus[],
    reducers: {
        status: (state, action) => {
            // called with status.dout from the json every time board sends status message
            return [...action.payload.status]
        }
    }
})

export const safetyDigitalOutputsSlice: StatusUpdateSlice<SafetyDigitalOutputStatus[]> =
    createSlice({
        name: "safetyDout",
        initialState: [] as SafetyDigitalOutputStatus[],
        reducers: {
            status: (state, action) => {
                // called with status.dout from the json every time board sends status message
                return [...action.payload.status]
            }
        }
    })

/**
 * Returns the list of configured digital outputs. The indexes of items in the list can be used with {@link useDigitalOutputState} to get and manipulate the output.
 */
export function useDigitalOutputList() {
    const config = useConfig()
    return config.dout || []
}

export function useSafetyDigitalOutputList() {
    const config = useConfig()
    return config.safetyDout || []
}

/**
 * Returns the state of a digital output, and a function to set the desired state.
 *
 * The effective value is determined by GBC and is the setValue (if override is true) or the value last set by an activity
 * (see `setDout` in {@link ActivityCommand} or {@link ActivityStreamItem})
 *
 * @param index The index in the configuration of the digital output
 */
export function useDigitalOutputState(index: number): [
    {
        /** The current effective value */
        effectiveValue?: boolean
        /** The desired value */
        setValue?: boolean
        /** Whether the desired value should override the value last set by an activity */
        override?: boolean
    },
    (setValue: boolean, override?: boolean) => void
] {
    return useGenericDigitalOutputState(index, "dout")
}

export function useSafetyDigitalOutputState(index: number): [
    {
        /** The current effective value */
        effectiveValue?: boolean
        /** The desired value */
        setValue?: boolean
        /** Whether the desired value should override the value last set by an activity */
        override?: boolean
    },
    (setValue: boolean, override?: boolean) => void
] {
    return useGenericDigitalOutputState(index, "safetyDout")
}

export function useDigitalOutputStates(): DigitalOutputStatus[] {
    return useSelector(({ dout }: RootState) => dout, deepEqual)
}

export function useSafetyDigitalOutputStates(): SafetyDigitalOutputStatus[] {
    return useSelector(({ safetyDout }: RootState) => safetyDout, deepEqual)
}

export const externalDigitalOutputsSlice: StatusUpdateSlice<DigitalOutputStatus[]> = createSlice({
    name: "externalDout",
    initialState: [] as DigitalOutputStatus[],
    reducers: {
        status: (state, action) => {
            // called with status.dout from the json every time board sends status message
            return [...action.payload.status]
        }
    }
})

/**
 * Returns the list of configured digital outputs. The indexes of items in the list can be used with {@link useDigitalOutputState} to get and manipulate the output.
 */
export function useExternalDigitalOutputList() {
    const config = useConfig()
    return config.externalDout || []
}

/**
 * Returns the state of a digital output, and a function to set the desired state.
 *
 * The effective value is determined by GBC and is the setValue (if override is true) or the value last set by an activity
 * (see `setDout` in {@link ActivityCommand} or {@link ActivityStreamItem})
 *
 * @param index The index in the configuration of the digital output
 */
export function useExternalDigitalOutputState(index: number): [
    {
        /** The current effective value */
        effectiveValue?: boolean
        /** The desired value */
        setValue?: boolean
        /** Whether the desired value should override the value last set by an activity */
        override?: boolean
    },
    (setValue: boolean, override?: boolean) => void
] {
    return useGenericDigitalOutputState(index, "externalDout")
}

export function useExternalDigitalOutputStates(): DigitalOutputStatus[] {
    return useSelector((root: RootState) => root.externalDout, deepEqual)
}

/**
 * Returns the list of configured modbus digital outputs.
 *
 * @returns The list of configured digital input names.
 */
export function useModbusDigitalOutputList() {
    const config = useConfig()
    return config.modbusDout || []
}

/** Returns the number of digital outputs configured for each modbus digital output index (you can have a start address and end address for each modbus digital output).
 *
 * @returns The number of bools for each modbus digital output index
 */

export function useModbusDigitalOutputNumberofList() {
    const config = useConfig()
    // Check if modbusDout is defined and is an array
    if (Array.isArray(config.modbusDout)) {
        // Map over the array to get the start_address values
        return config.modbusDout.map(dout => dout.endAddress - dout.startAddress + 1)
    }
    // Return an empty array if modbusDout is not defined or not an array
    return []
}
