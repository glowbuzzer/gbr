import { createSlice } from "@reduxjs/toolkit"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../root"
import { useConnect } from "@glowbuzzer/store"

type IntegerOutputCommand = {
    value: number
    override: boolean
}

type IntegerOutputStatus = {
    actValue: number
} & IntegerOutputCommand

export const integerOutputsSlice = createSlice({
    name: "iout",
    initialState: [] as IntegerOutputStatus[],
    reducers: {
        status: (state, action) => {
            return [...action.payload]
        }
    }
})

export function useIntegerOutputs() {
    const connection = useConnect()
    const values = useSelector(({ iout }: RootState) => iout, shallowEqual)
    return {
        values,
        update(index: number, command: IntegerOutputCommand) {
            connection.send(
                JSON.stringify({
                    command: {
                        iout: {
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
