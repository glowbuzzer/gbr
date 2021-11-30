import { createSlice, Slice } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { RootState } from "../root"
import { useMemo, useRef } from "react"
import deepEqual from "fast-deep-equal"
import { useConfig } from "../config"
import { useConnect } from "../connect"

type DigitalOutputCommand = {
    state: number
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
