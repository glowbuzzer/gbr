/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createSlice } from "@reduxjs/toolkit"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../root"
import { GlowbuzzerConnectionContextType, useConnection } from "../connect"
import { StatusUpdateSlice } from "../util/redux"
import { useConfig } from "../config"
import { useMemo, useRef } from "react"
import deepEqual from "fast-deep-equal"
import { IntegerOutputStatus } from "../gbc_extra" // helper to reduce boilerplate

// helper to reduce boilerplate
function send(
    connection: GlowbuzzerConnectionContextType,
    index: number,
    value: number,
    override: boolean,
    type: "iout" | "uiout" | "externalIout" | "externalUiout"
) {
    connection.send(
        JSON.stringify({
            command: {
                [type]: {
                    [index]: {
                        command: {
                            setValue: value,
                            override
                        }
                    }
                }
            }
        })
    )
}

/**
 * @ignore Internal convenience hook to avoid code duplication
 */
function useGenericIntegerOutput(
    index: number,
    type: "iout" | "uiout" | "externalIout" | "externalUiout"
): [
    {
        /** The current effective value */
        effectiveValue: number
        /** The desired value */
        setValue: number
        /** Whether the desired value should override the value last set by an activity */
        override: boolean
    },
    (setValue: number, override: boolean) => void
] {
    const connection = useConnection()
    const ref = useRef<IntegerOutputStatus>(null)

    const iout = useSelector((root: RootState) => root[type][index], shallowEqual) || {
        effectiveValue: 0,
        setValue: 0,
        override: false
    }

    // compare ref value of dout with latest from store
    if (!deepEqual(ref.current, iout)) {
        ref.current = iout
    }

    const value = ref.current
    return useMemo(
        () => [
            value,
            (value: number, override = true) => send(connection, index, value, override, type)
        ],
        [index, value, connection, type]
    )
}

export const integerOutputsSlice: StatusUpdateSlice<IntegerOutputStatus[]> = createSlice({
    name: "iout",
    initialState: [] as IntegerOutputStatus[],
    reducers: {
        status: (state, action) => {
            return [...action.payload.status]
        }
    }
})

/**
 * Returns a list of configured integer output names. The index of names in the list can be used with {@link useIntegerOutputState}.
 */
export function useIntegerOutputList() {
    const config = useConfig()
    return config.iout || []
}

/**
 * Returns the state of an integer output, and a function to set the desired state.
 *
 * The effective value is determined by GBC and is the setValue (if override is true) or the value last set by an activity
 * (see `setIout` in {@link ActivityCommand} or {@link ActivityStreamItem})
 *
 * @param index The index in the configuration of the analog output
 */
export function useIntegerOutputState(index: number): [
    {
        /** The current effective value */
        effectiveValue: number
        /** The desired value */
        setValue: number
        /** Whether the desired value should override the value last set by an activity */
        override: boolean
    },
    (setValue: number, override: boolean) => void
] {
    return useGenericIntegerOutput(index, "iout")
}

export const unsignedIntegerOutputsSlice: StatusUpdateSlice<IntegerOutputStatus[]> = createSlice({
    name: "uiout",
    initialState: [] as IntegerOutputStatus[],
    reducers: {
        status: (state, action) => {
            return [...action.payload.status]
        }
    }
})

/**
 * Returns a list of configured unsigned integer output names. The index of names in the list can be used with {@link useIntegerOutputState}.
 */
export function useUnsignedIntegerOutputList() {
    const config = useConfig()
    return config.uiout || []
}

/**
 * Returns the state of an unsigned integer output, and a function to set the desired state.
 *
 * The effective value is determined by GBC and is the setValue (if override is true) or the value last set by an activity
 * (see `setUIout` in {@link ActivityCommand} or {@link ActivityStreamItem})
 *
 * @param index The index in the configuration of the analog output
 */
export function useUnsignedIntegerOutputState(index: number): [
    {
        /** The current effective value */
        effectiveValue: number
        /** The desired value */
        setValue: number
        /** Whether the desired value should override the value last set by an activity */
        override: boolean
    },
    (setValue: number, override: boolean) => void
] {
    return useGenericIntegerOutput(index, "uiout")
}

// External --------------------------------------

export const externalIntegerOutputsSlice: StatusUpdateSlice<IntegerOutputStatus[]> = createSlice({
    name: "externalIout",
    initialState: [] as IntegerOutputStatus[],
    reducers: {
        status: (state, action) => {
            return [...action.payload.status]
        }
    }
})

/**
 * Returns a list of configured integer output names. The index of names in the list can be used with {@link useIntegerOutputState}.
 */
export function useExternalIntegerOutputList() {
    const config = useConfig()
    return config.externalIout || []
}

/**
 * Returns the state of an integer output, and a function to set the desired state.
 *
 * The effective value is determined by GBC and is the setValue (if override is true) or the value last set by an activity
 * (see `setIout` in {@link ActivityCommand} or {@link ActivityStreamItem})
 *
 * @param index The index in the configuration of the analog output
 */
export function useExternalIntegerOutputState(index: number): [
    {
        /** The current effective value */
        effectiveValue: number
        /** The desired value */
        setValue: number
        /** Whether the desired value should override the value last set by an activity */
        override: boolean
    },
    (setValue: number, override: boolean) => void
] {
    return useGenericIntegerOutput(index, "externalIout")
}

export const externalUnsignedIntegerOutputsSlice: StatusUpdateSlice<IntegerOutputStatus[]> =
    createSlice({
        name: "externalUiout",
        initialState: [] as IntegerOutputStatus[],
        reducers: {
            status: (state, action) => {
                return [...action.payload.status]
            }
        }
    })

/**
 * Returns a list of configured unsigned integer output names. The index of names in the list can be used with {@link useIntegerOutputState}.
 */
export function useExternalUnsignedIntegerOutputList() {
    const config = useConfig()
    return config.externalUiout || []
}

/**
 * Returns the state of an unsigned integer output, and a function to set the desired state.
 *
 * The effective value is determined by GBC and is the setValue (if override is true) or the value last set by an activity
 * (see `setUIout` in {@link ActivityCommand} or {@link ActivityStreamItem})
 *
 * @param index The index in the configuration of the analog output
 */
export function useExternalUnsignedIntegerOutputState(index: number): [
    {
        /** The current effective value */
        effectiveValue: number
        /** The desired value */
        setValue: number
        /** Whether the desired value should override the value last set by an activity */
        override: boolean
    },
    (setValue: number, override: boolean) => void
] {
    return useGenericIntegerOutput(index, "externalUiout")
}

/**
 * Returns the list of configured modbus integer outputs.
 *
 * @returns The list of configured modbus integer output names.
 */
export function useModbusIntegerOutputList() {
    const config = useConfig()
    return config.modbusUiout || []
}

/** Returns the number of integer outputs configured for each modbus intetger output index (you can have a start address and end address for each modbus integer output).
 *
 * @returns The number of ints for each modbus integer output index
 */

export function useModbusIntegerOutputNumberofList() {
    const config = useConfig()
    // Check if modbusUiout is defined and is an array
    if (Array.isArray(config.modbusUiout)) {
        // Map over the array to get the start_address values
        return config.modbusUiout.map(uiout => uiout.end_address - uiout.start_address + 1)
    }
    // Return an empty array if modbusDout is not defined or not an array
    return []
}
