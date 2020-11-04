import { createSlice } from "@reduxjs/toolkit"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../root"
import { useConnect } from "../connect"

type JointsState = {
    statusWord: number
    controlWord: number
    actPos: number
    actVel: number
    actAcc: number
}[]

export const jointsSlice = createSlice({
    name: "joints",
    initialState: [] as JointsState,
    reducers: {
        status: (state, action) => {
            // called with status.joints from the json every time board sends status message
            return [...action.payload]
        }
    }
})

export function useJoints() {
    const connection = useConnect()
    const joints = useSelector(({ joints }: RootState) => joints, shallowEqual)
    return joints.map((j, index) => ({
        ...j,
        setControlWord(value) {
            console.log("Setting joint control word: ", value)
            connection.send({
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
        }
    }))
}
