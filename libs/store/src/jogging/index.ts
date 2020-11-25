import { createSlice } from "@reduxjs/toolkit"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { RootState } from "../root"
import { useConnect } from "../connect"
import { isArray } from "util"

export enum JogDirection {
    NONE,
    POSITIVE,
    NEGATIVE
}

export enum JogMode {
    JOGMODE_NONE,
    JOGMODE_JOINT,
    JOGMODE_CARTESIAN,
    JOGMODE_JOINT_STEP,
    JOGMODE_CARTESIAN_STEP,
    JOGMODE_REF_POSITION
}

export enum JogState {
    JOGSTATE_NONE,
    JOGSTATE_STEP_ACTIVE,
    JOGSTATE_STEP_COMPLETE
}

type JogStoreState = {
    state: JogState
    jogFlags: number
}

export const jogSlice = createSlice({
    name: "jog",
    initialState: [] as JogStoreState[],
    reducers: {
        status: (state, action) => {
            // called with status.jog from the json every time GBC sends status message
            if (isArray(action.payload)) {
                for (let n = 0; n < action.payload.length; n++) {
                    state[n] = {
                        state: action.payload[n].state,
                        jogFlags: action.payload[n].jogFlags
                    }
                }
            }
        }
    }
})

// the jogIndex is the index in config, as each kc can have own jog controller
export function useJog(jogIndex: number) {
    const jogStatus = useSelector(({ jog }: RootState) => jog[jogIndex], shallowEqual)
    const dispatch = useDispatch()
    const connection = useConnect()

    function updateJog(joint, direction, command) {
        const current = jogStatus.state || 0
        const value = direction << (joint * 2)
        const mask = 0b11 << (joint * 2)
        const jogFlags = (current & ~mask) | value
        dispatch(() => {
            connection.send(
                JSON.stringify({
                    command: {
                        jog: {
                            [jogIndex]: {
                                command: { ...command, jogFlags }
                            }
                        }
                    }
                })
            )
        })
    }

    return {
        setJog(joint: number, direction: JogDirection, speedPercentage: number) {
            updateJog(joint, direction, {
                mode: JogMode.JOGMODE_JOINT,
                speedPercentage
            })
        },
        stepJog(joint: number, direction: JogDirection, stepSize: number) {
            updateJog(joint, direction, {
                mode: JogMode.JOGMODE_JOINT_STEP,
                stepSize
            })
        }
    }
}
