/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createSlice, Slice } from "@reduxjs/toolkit"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../root"
import { StatusUpdateSlice } from "../util/redux"
import { useConfig } from "../config"
import { ModbusDinStatus, ModbusUiinStatus } from "../gbc"

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
        return config.modbusDout.map(dout => dout.end_address - dout.start_address + 1)
    }
    // Return an empty array if modbusDout is not defined or not an array
    return []
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
