/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createSlice } from "@reduxjs/toolkit"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../root"
import { useConnection } from "../connect"
import { useMemo, useRef } from "react"
import deepEqual from "fast-deep-equal"
import { StatusUpdateSlice } from "../util/redux"
import { useConfig } from "../config"
import { AnalogOutputStatus } from "../gbc_extra"

export const analogOutputsSlice: StatusUpdateSlice<AnalogOutputStatus[]> = createSlice({
    name: "aout",
    initialState: [] as AnalogOutputStatus[],
    reducers: {
        status: (state, action) => {
            return [...action.payload.status]
        }
    }
})

/**
 * Returns a list of configured analog output names. The index of names in the list can be used with {@link useAnalogOutputState}.
 */
export function useAnalogOutputList() {
    const config = useConfig()
    return config.aout || []
}

/**
 * Returns the state of an analog output, and a function to set the desired state.
 *
 * The effective value is determined by GBC and is the setValue (if override is true) or the value last set by an activity
 * (see `setAout` in {@link ActivityCommand} or {@link ActivityStreamItem})
 *
 * @param index The index in the configuration of the analog output
 */
export function useAnalogOutputState(index: number): [
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
    const ref = useRef<AnalogOutputStatus>(null)

    const aout = useSelector(({ aout }: RootState) => aout[index], shallowEqual) || {
        effectiveValue: 0,
        setValue: 0,
        override: false
    }

    // compare ref value of dout with latest from store
    if (!deepEqual(ref.current, aout)) {
        ref.current = aout
    }

    const value = ref.current
    return useMemo(
        () => [
            value,
            (value: number, override = true) => {
                connection.send(
                    JSON.stringify({
                        command: {
                            aout: {
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
        ],
        [index, value, connection]
    )
}
