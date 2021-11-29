import { createSlice, Slice } from "@reduxjs/toolkit"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../root"
import { useConnect } from "../connect"
import { useConfig } from "../config"

type JointsState = {
    statusWord: number
    controlWord: number
    actPos: number
    actVel: number
    actAcc: number
}[]

export const jointsSlice: Slice<JointsState> = createSlice({
    name: "joints",
    initialState: [] as JointsState,
    reducers: {
        status: (state, action) => {
            // called with status.joints from the json every time board sends status message
            return [...action.payload]
        }
    }
})

export function useJointConfig() {
    const config = useConfig()
    // convert keyed object to array
    return Object.entries(config.joint).map(([name, value]) => ({
        name,
        ...value
    }))
}

export function useJointCount() {
    return useSelector(({ joints }: RootState) => joints.length)
}

export function useJoints() {
    const connection = useConnect()
    const joints = useSelector(({ joints }: RootState) => joints, shallowEqual)
    return joints.map((j, index) => ({
        ...j,
        setControlWord(value) {
            console.log("Setting joint control word: ", value)
            connection.send(
                JSON.stringify({
                    command: {
                        joint: {
                            [index]: {
                                command: {
                                    controlWord: value
                                }
                            }
                        }
                    }
                })
            )
        }
    }))
}
