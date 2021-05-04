import { createSlice } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { RootState, useConnect } from "@glowbuzzer/store"
import deepEqual from "fast-deep-equal"
import { useEffect, useMemo, useRef } from "react"
import { Vector3 } from "three"

export enum ActivityState {
    "ACTIVITY_INACTIVE",
    "ACTIVITY_ACTIVE",
    "ACTIVITY_COMPLETED",
    "ACTIVITY_BLEND_ACTIVE"
}

type ActivityStatus = {
    tag: number
    state: ActivityState
}

export const activitySlice = createSlice({
    name: "activity",
    initialState: [] as ActivityState[],
    reducers: {
        status: (state, action) => {
            return [...action.payload]
        }
    }
})

enum MotionCommand {
    CANCEL = ":0",
    MOVE_AT_VELOCITY = "moveAtVelocity:1",
    MOVE_LINE = "moveLine:2"
}

function make_motion_activity(index: number, type: MotionCommand, tag: number, params) {
    const [typeName, typeIndex] = type.split(":")

    const command_detail = typeName.length
        ? {
              [typeName]: {
                  kinematicsConfigurationIndex: index,
                  ...params
              }
          }
        : {}

    return JSON.stringify({
        command: {
            soloActivity: {
                [index]: {
                    command: {
                        activityType: typeIndex,
                        tag,
                        ...command_detail
                    }
                }
            }
        }
    })
}

export function useSoloActivity(index = 0) {
    const connection = useConnect()
    const status = useSelector(({ activity }: RootState) => activity[index], deepEqual) as ActivityStatus
    const currentTag = useRef(1) // initial value will be zero on m7
    const promiseRef = useRef<{ tag: number; resolve; reject }>()

    useEffect(() => {
        if (!status) {
            return
        }
        // take care of resolving or rejecting previous promises when tag or solo activity status changes
        const { tag, state } = status
        if (promiseRef.current) {
            const { tag: lastTag, resolve, reject } = promiseRef.current
            if (lastTag === tag) {
                if (state === ActivityState.ACTIVITY_COMPLETED) {
                    resolve()
                    promiseRef.current = null
                }
            } else {
                // tag mismatch, so activity must have been replaced with newer activity
                reject()
                promiseRef.current = null
            }
        }
    }, [status])

    return useMemo(() => {
        function exec(type: MotionCommand, params) {
            const tag = currentTag.current++
            console.log("EXEC", type, "ON TAG", tag)
            return new Promise<void>((resolve, reject) => {
                // store the tag and promise functions for later resolution/rejection
                promiseRef.current = { tag, resolve, reject }
                connection.send(make_motion_activity(index, type, tag, params))
            })
        }

        return {
            cancel: () => exec(MotionCommand.CANCEL, {}),
            moveAtVelocity: (jointVelocityArray: number[]) =>
                exec(MotionCommand.MOVE_AT_VELOCITY, {
                    jointVelocityArray
                }),
            moveLine: (pos: Vector3, relative = false) =>
                exec(MotionCommand.MOVE_LINE, {
                    line: {
                        positionReference: relative ? 1 : 0, // TODO: put in enum
                        position: pos
                    }
                })
        }
    }, [connection, index])
}
