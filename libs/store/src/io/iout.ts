import { createSlice } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { RootState } from "../root"
import { useConnection } from "../connect"
import { StatusUpdateSlice } from "../util/redux"
import { useConfig } from "../config"
import { useMemo, useRef } from "react"
import deepEqual from "fast-deep-equal"

export type IntegerOutputCommand = {
    setValue: number
    override: boolean
}

/** The current status of a single integer output. This also incorporates the current commanded state for the integer output (override) */
export type IntegerOutputStatus = {
    effectiveValue: number
} & IntegerOutputCommand

export const integerOutputsSlice: StatusUpdateSlice<IntegerOutputStatus[]> = createSlice({
    name: "iout",
    initialState: [] as IntegerOutputStatus[],
    reducers: {
        status: (state, action) => {
            return [...action.payload]
        }
    }
})

/**
 * Returns a list of configured integer output names. The index of names in the list can be used with {@link useIntegerOutputState}.
 */
export function useIntegerOutputList() {
    const config = useConfig()
    return Object.keys(config.iout)
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
    const connection = useConnection()
    const ref = useRef<IntegerOutputStatus>(null)

    const iout = useSelector(({ iout }: RootState) => iout[index]) || {
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
            (value: number, override = true) => {
                connection.send(
                    JSON.stringify({
                        command: {
                            iout: {
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
