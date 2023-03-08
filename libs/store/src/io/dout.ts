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

export const digitalOutputsSlice: StatusUpdateSlice<DigitalOutputStatus[]> = createSlice({
    name: "dout",
    initialState: [] as DigitalOutputStatus[],
    reducers: {
        status: (state, action) => {
            // called with status.dout from the json every time board sends status message
            return [...action.payload]
        }
    }
})

/**
 * Returns the list of configured digital outputs. The indexes of items in the list can be used with {@link useDigitalOutputState} to get and manipulate the output.
 */
export function useDigitalOutputList() {
    const config = useConfig()
    return config.dout
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
    const connection = useConnection()
    const ref = useRef<DigitalOutputStatus>(null)
    const dout = useSelector(({ dout }: RootState) => dout[index], shallowEqual) || {
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
                            dout: {
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
        [index, value, connection]
    )
}
