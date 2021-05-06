import { createSlice } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { ACTIVITYTYPE, CartesianPosition, CartesianPositionsConfig, RootState, useConnect } from "@glowbuzzer/store"
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

function make_motion_activity(index: number, type: ACTIVITYTYPE, tag: number, params) {
    const typeName = [
        "",
        "moveAtVelocity",
        "moveLine",
        "moveArc",
        "moveSpline",
        "moveJoints",
        "moveToPosition",
        "moveLineWithForce",
        "moveToPositionWithForce",
        "gearInPos",
        "gearInVelo",
        "gearInDyn",
        "setDout",
        "setAout",
        "dwell",
        "waitOn",
        "switchPose",
        "latch",
        "stressTest",
        "endProgram",
        "setIout"
    ][type]

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
                        activityType: type,
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
        function exec(type: ACTIVITYTYPE, params) {
            const tag = currentTag.current++
            console.log("EXEC", type, "ON TAG", tag)
            return new Promise<void>((resolve, reject) => {
                // store the tag and promise functions for later resolution/rejection
                promiseRef.current = { tag, resolve, reject }
                connection.send(make_motion_activity(index, type, tag, params))
            })
        }

        return {
            cancel: () => exec(ACTIVITYTYPE.ACTIVITYTYPE_NONE, {}),
            moveAtVelocity: (jointVelocityArray: number[]) =>
                exec(ACTIVITYTYPE.ACTIVITYTYPE_MOVEATVELOCITY, {
                    jointVelocityArray
                }),
            moveToPosition: (x: number, y: number, z: number) => {
                const cartesianPosition: CartesianPositionsConfig = {
                    // TODO: can we come up with another name for position to avoid duplication in hierarchy
                    position: {
                        position: { x, y, z }
                    }
                }

                return exec(ACTIVITYTYPE.ACTIVITYTYPE_MOVETOPOSITION, {
                    cartesianPosition
                })
            },
            moveLine: (pos: Vector3, relative = false) =>
                exec(ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE, {
                    line: {
                        positionReference: relative ? 1 : 0, // TODO: put in enum
                        position: pos
                    }
                })
        }
    }, [connection, index])
}
