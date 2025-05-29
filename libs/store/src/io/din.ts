/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */
import { useMemo, useRef } from "react"
import { createSlice, Slice } from "@reduxjs/toolkit"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../root"
import { StatusUpdateSlice } from "../util/redux"
import { useConfig } from "../config"
import { DigitalInputStatus, ModbusDinStatus, SafetyDigitalInputStatus } from "../gbc"
import { useConnection } from "../connect"
import deepEqual from "fast-deep-equal"

export const digitalInputsSlice: StatusUpdateSlice<DigitalInputStatus[]> = createSlice({
    name: "din",
    initialState: [] as DigitalInputStatus[],
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
 * @param type The type of digital input
 */
// export function useDigitalInputState(index: number): boolean {
//     return useSelector((state: RootState) => state.din[index])
// }

function useGenericDigitalInputState(
    index: number,
    type: "din" | "safetyDin" | "externalDin"
): [
    {
        /** The current effective value */
        actValue?: boolean
        /** The desired value */
        setValue?: boolean
        /** Whether the desired value should override the value last set by an activity ?????*/
        override?: boolean
    },
    (setValue: boolean, override?: boolean) => void
] {
    const connection = useConnection()
    const ref = useRef<DigitalInputStatus>(null)
    const din = useSelector((root: RootState) => root[type][index], shallowEqual) || {
        actValue: false,
        setValue: false,
        override: false
    }

    // compare ref value of din with latest from store
    if (!deepEqual(ref.current, din)) {
        ref.current = din
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

/**
 * Returns the state of a digital input, and a function to set the desired state.
 *
 * The effective value is determined by GBC and is the setValue (if override is true) or the value last set by an activity
 * (see `setDout` in {@link ActivityCommand} or {@link ActivityStreamItem}).
 *
 * @param index The index in the configuration of the digital output
 */
export function useDigitalInputState(index: number): [
    {
        /** The current effective value */
        actValue?: boolean
        /** The desired value */
        setValue?: boolean
        /** Whether the desired value should override the value???y */
        override?: boolean
    },
    (setValue: boolean, override?: boolean) => void
] {
    return useGenericDigitalInputState(index, "din")
}

/**
 * Returns a list with the current state of each digital input as `true` or `false`
 */
// export function useDigitalInputs(): boolean[] {
//     return useSelector((state: RootState) => state.din, shallowEqual)
// }

export function useDigitalInputs(): boolean[] {
    // return useSelector((state: RootState) => state.safetyDin, shallowEqual)
    return useSelector(
        (state: RootState) => state.din.map(item => item.actValue ?? false),
        shallowEqual
    )
}

// export const safetyDigitalInputsSlice: StatusUpdateSlice<boolean[]> = createSlice({
//     name: "safetyDin",
//     initialState: [] as boolean[],
//     reducers: {
//         status: (state, action) => {
//             return [...action.payload.status]
//         }
//     }
// })
export const safetyDigitalInputsSlice: StatusUpdateSlice<SafetyDigitalInputStatus[]> = createSlice({
    name: "safetyDin",
    initialState: [] as SafetyDigitalInputStatus[],
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
// export function useSafetyDigitalInputState(index: number): boolean {
//     return useSelector((state: RootState) => state.safetyDin[index])
// }
export function useSafetyDigitalInputState(index: number): [
    {
        /** The current effective value */
        actValue?: boolean
        /** The desired value */
        setValue?: boolean
        /** Whether the desired value should override the value???y */
        override?: boolean
    },
    (setValue: boolean, override?: boolean) => void
] {
    return useGenericDigitalInputState(index, "safetyDin")
}

/**
 * Returns a list with the current state of each digital input as `true` or `false`
 */
export function useSafetyDigitalInputs(): boolean[] {
    // return useSelector((state: RootState) => state.safetyDin, shallowEqual)
    return useSelector(
        (state: RootState) => state.safetyDin.map(item => item.actValue ?? false),
        shallowEqual
    )
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
    return config.externalDin || []
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

// export const modbusDigitalInputsSlice: StatusUpdateSlice<boolean[]> = createSlice({
//     name: "modbusDin",
//     initialState: [] as boolean[],
//     reducers: {
//         status: (state, action) => {
//             return [...action.payload.status]
//         }
//     }
// })

export const modbusDigitalInputsSlice: Slice<ModbusDinStatus[]> = createSlice({
    name: "modbusDin",
    initialState: [] as ModbusDinStatus[],
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
export function useModbusDigitalInputList() {
    const config = useConfig()
    return config.modbusDin || []
}

/**
 * Returns the state of a digital input
 *
 * @param index The index in the configuration of the digital input
 */
export function useModbusDigitalInputState(index: number): ModbusDinStatus {
    return useSelector((state: RootState) => state.modbusDin[index])
}
