import { createSlice } from "@reduxjs/toolkit"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../root"
import { useConnect } from "@glowbuzzer/store"

type AnalogOutputCommand = {
    value: number
    override: boolean
}

export type AnalogOutputStatus = {
    actValue: number
} & AnalogOutputCommand

export const analogOutputsSlice = createSlice({
    name: "aout",
    initialState: [] as AnalogOutputStatus[],
    reducers: {
        status: (state, action) => {
            return [...action.payload]
        }
    }
})

export function useAnalogOutputs() {
    const connection = useConnect()
    const values = useSelector(({ aout }: RootState) => aout, shallowEqual)
    return {
        values,
        update(index: number, command: AnalogOutputCommand) {
            connection.send(
                JSON.stringify({
                    command: {
                        aout: {
                            [index]: {
                                command
                            }
                        }
                    }
                })
            )
        }
    }
}
