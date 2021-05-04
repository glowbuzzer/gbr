import { createSlice } from "@reduxjs/toolkit"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../root"
import { useConnect } from "@glowbuzzer/store"
import { useMemo } from "react"
import deepEqual from "fast-deep-equal"

type DigitalOutputCommand = {
    state: number
    override: boolean
}

export type DigitalOutputStatus = {
    actState: number
} & DigitalOutputCommand

export const digitalOutputsSlice = createSlice({
    name: "dout",
    initialState: [] as DigitalOutputStatus[],
    reducers: {
        status: (state, action) => {
            // called with status.dout from the json every time board sends status message
            return [...action.payload]
        }
    }
})

export function useDigitalOutputs() {
    const connection = useConnect()
    const values = useSelector(({ dout }: RootState) => dout, deepEqual)
    return useMemo(() => {
        return {
            values,
            update(index: number, command: DigitalOutputCommand) {
                connection.send(
                    JSON.stringify({
                        command: {
                            dout: {
                                [index]: {
                                    command
                                }
                            }
                        }
                    })
                )
            }
        }
    }, [values, connection])
}
