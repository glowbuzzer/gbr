import { createSlice, Slice } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { RootState } from "../root"
import { useMemo, useRef } from "react"
import deepEqual from "fast-deep-equal"
import { useConfig } from "../config"
import { useConnect } from "../connect"

export type DigitalOutputCommand = {
    /** the state, 0 or 1*/
    state: number
    /** whether this state should override state set by an activity */
    override: boolean
}

export type DigitalOutputStatus = {
    actState: number
} & DigitalOutputCommand

export const digitalOutputsSlice: Slice<DigitalOutputStatus[]> = createSlice({
    name: "dout",
    initialState: [] as DigitalOutputStatus[],
    reducers: {
        status: (state, action) => {
            // called with status.dout from the json every time board sends status message
            return [...action.payload]
        }
    }
})

export function useDigitalOutputList() {
    const config = useConfig()
    return Object.keys(config.dout)
}

/**
 * Read and update a digital output
 *
 * @param index The index in the configuration of the digital output
 */
export function useDigitalOutput(index: number) {
    const connection = useConnect()
    const ref = useRef<DigitalOutputStatus>(null)
    const dout = useSelector(({ dout }: RootState) => dout[index]) || {
        state: 0,
        actState: 0,
        override: false
    }

    // compare ref value of dout with latest from store
    if (!deepEqual(ref.current, dout)) {
        ref.current = dout
    }

    const value = ref.current
    return useMemo(() => {
        return {
            ...value,
            /** set the new state
             * @param state new state
             * @param override override state set by activity
             **/
            set(state: number, override = true) {
                connection.send(
                    JSON.stringify({
                        command: {
                            dout: {
                                [index]: {
                                    command: {
                                        state,
                                        override
                                    }
                                }
                            }
                        }
                    })
                )
            }
        }
    }, [index, value, connection])
}
