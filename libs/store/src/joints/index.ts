/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createSlice, Slice } from "@reduxjs/toolkit"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../root"
import { useConnection } from "../connect"
import { useConfig } from "../config"
import { JointConfig } from "../gbc"
import deepEqual from "fast-deep-equal"
import { useMemo } from "react"

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
            // called with status.joints from the json every time GBC sends status message
            return [...action.payload]
        }
    }
})

/** Returns an array of all configured joints with joint names, retrieved using {@link useConfig} */
export function useJointConfigurationList(): ({
    name: string
} & JointConfig)[] {
    const config = useConfig()
    // convert keyed object to array
    return useMemo(
        () =>
            Object.entries(config.joint).map(([name, value]) => ({
                name,
                ...value
            })),
        [config]
    )
}

/** Returns the number of joints configured */
export function useJointCount() {
    return useSelector(({ joints }: RootState) => joints.length)
}

/**
 * Returns the state of a joints and a method to set the low level CIA 402 control word.
 *
 * @param index The joint index in the configuration
 */
export function useJoint(index: number): {
    /** CIA 402 status word */
    statusWord: number
    /** CIA 402 control word requested */
    controlWord: number
    /** Actual position of the joint */
    actPos: number
    /** Actual acceleration of the joint */
    actVel: number
    /** Actual acceleration of the joint */
    actAcc: number
    /**
     * Sets the CIA 402 control word.
     *
     * @param value Value to set
     */
    setControlWord(value: number): void
} {
    const connection = useConnection()
    const joint = useSelector(({ joints }: RootState) => joints[index], shallowEqual)
    return {
        ...joint,
        setControlWord(value: number) {
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
    }
}

/**
 * Returns the actual position of all configured joints.
 */
export function useRawJointPositions(): number[] {
    const joints = useSelector(({ joints }: RootState) => joints, deepEqual)
    return joints.map(j => j.actPos)
}
