import { createSlice, Slice } from "@reduxjs/toolkit"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { RootState } from "../root"
import { useConnection } from "../connect"
import { useMemo } from "react"

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

export const jogSlice: Slice<JogStoreState[]> = createSlice({
    name: "jog",
    initialState: [] as JogStoreState[],
    reducers: {
        status: (state, action) => {
            // called with status.jog from the json every time GBC sends status message
            if (action?.payload.length) {
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

/**
 * @ignore - Deprecated (jogging now uses solo activity)
 */
export function useJogging(jogIndex: number) {
    const jogStatus = useSelector(({ jog }: RootState) => jog[jogIndex], shallowEqual)
    const dispatch = useDispatch()
    const connection = useConnection()

    const state = jogStatus?.state

    return useMemo(() => {
        function updateJog(joint, direction, command) {
            const current = state || 0
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
            setJog(mode: JogMode, index: number, direction: JogDirection, speedPercentage: number) {
                updateJog(index, direction, {
                    mode,
                    speedPercentage
                })
            },
            stepJog(
                mode: JogMode,
                index: number,
                direction: JogDirection,
                speedPercentage: number,
                stepSize: number
            ) {
                updateJog(index, direction, {
                    mode,
                    speedPercentage,
                    stepSize
                })
            }
        }
    }, [connection, dispatch, jogIndex, state])
}

export function processJogStateChanges(prev: JogStoreState[], current: JogStoreState[], send) {
    for (let n = 0; n < prev.length; n++) {
        const p = prev[n]
        const c = current[n]
        if (
            p.state !== JogState.JOGSTATE_STEP_COMPLETE &&
            c.state === JogState.JOGSTATE_STEP_COMPLETE
        ) {
            // jog step completed, so send command to reset to none, ready for next jog step
            // (we don't hold a queue of jog steps)
            send(
                JSON.stringify({
                    command: {
                        jog: {
                            [n]: {
                                command: {
                                    jogFlags: 0,
                                    mode: JogMode.JOGMODE_NONE
                                }
                            }
                        }
                    }
                })
            )
        }
    }
}
