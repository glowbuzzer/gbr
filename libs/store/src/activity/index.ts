import { createSlice } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { ACTIVITYSTATE, ACTIVITYTYPE, RootState, useConnect } from "@glowbuzzer/store"
import deepEqual from "fast-deep-equal"
import { useEffect, useMemo } from "react"
import { ActivityApi } from "./activity_api"

type ActivityStatus = {
    tag: number
    state: ACTIVITYSTATE
}

export const activitySlice = createSlice({
    name: "activity",
    initialState: [] as ActivityStatus[],
    reducers: {
        status: (state, action) => {
            return [...action.payload]
        }
    }
})

// function make_motion_activity(index: number, type: ACTIVITYTYPE, tag: number, params, moveParams) {
//     const typeName = [
//         "",
//         "moveJoints",
//         "moveJointsAtVelocity",
//         "moveLine",
//         "moveLineAtVelocity",
//         "moveArc",
//         "moveSpline",
//         "moveToPosition",
//         "moveLineWithForce",
//         "moveToPositionWithForce",
//         "gearInPos",
//         "gearInVelo",
//         "gearInDyn",
//         "setDout",
//         "setAout",
//         "dwell",
//         "waitOn",
//         "switchPose",
//         "latch",
//         "stressTest",
//         "endProgram",
//         "setIout"
//     ][type]
//
//     const command_detail = typeName.length
//         ? {
//               [typeName]: {
//                   kinematicsConfigurationIndex: index,
//                   ...params,
//                   moveParams
//               }
//           }
//         : {}
//
//     return JSON.stringify({
//         command: {
//             soloActivity: {
//                 [index]: {
//                     command: {
//                         activityType: type,
//                         tag,
//                         ...command_detail
//                     }
//                 }
//             }
//         }
//     })
// }

export function useSoloActivityStatus(index = 0): ActivityStatus {
    const status = useSelector(
        ({ activity }: RootState) => activity[index],
        deepEqual
    ) as ActivityStatus

    return (
        status || {
            tag: 0,
            state: ACTIVITYSTATE.ACTIVITY_INACTIVE
        }
    )
}

export function useSoloActivity(index = 0) {
    const connection = useConnect()
    const status = useSelector(
        ({ activity }: RootState) => activity[index],
        deepEqual
    ) as ActivityStatus
    // const currentTag = useRef(1) // initial value will be zero on m7
    // const promiseRef = useRef<{ tag: number; resolve; reject }>()

    const api = useMemo(() => {
        return new ActivityApi(index, connection.send)
    }, [index, connection.send])

    useEffect(() => {
        if (!status) {
            return
        }
        // take care of resolving or rejecting previous promises when tag or solo activity status changes
        const { tag, state } = status
        api.update(tag, state)

        // if (promiseRef.current) {
        //     const { tag: lastTag, resolve, reject } = promiseRef.current
        //     if (lastTag === tag) {
        //         if (state === ACTIVITYSTATE.ACTIVITY_COMPLETED) {
        //             resolve()
        //             console.log("EXEC COMPLETE FOR TAG", tag)
        //             promiseRef.current = null
        //         } else {
        //             console.log("TAG RUNNING BUT NOT COMPLETED", tag)
        //         }
        //     } else {
        //         // tag mismatch, so activity must have been replaced with newer activity
        //         console.log("TAG MISMATCH", lastTag, tag)
        //         reject()
        //         promiseRef.current = null
        //     }
        // }
    }, [api, status])

    return api
    // return useMemo(() => {
    //     function exec(type: ACTIVITYTYPE, params, moveParams) {
    //         const tag = currentTag.current++
    //         return new Promise<void>((resolve, reject) => {
    //             console.log("EXEC PROMISE FOR TYPE", ACTIVITYTYPE[type], "TAG", tag)
    //             // store the tag and promise functions for later resolution/rejection
    //             promiseRef.current = { tag, resolve, reject }
    //             connection.send(make_motion_activity(index, type, tag, params, moveParams))
    //         })
    //     }
    //
    //     return {
    //         cancel() {
    //             return exec(ACTIVITYTYPE.ACTIVITYTYPE_NONE, {}, {})
    //         },
    //         moveJointsAtVelocity(
    //             jointVelocityArray: number[],
    //             moveParams: MoveParametersConfig = {}
    //         ) {
    //             return exec(
    //                 ACTIVITYTYPE.ACTIVITYTYPE_MOVEJOINTSATVELOCITY,
    //                 {
    //                     jointVelocityArray
    //                 },
    //                 moveParams
    //             )
    //         },
    //         moveJoints(
    //             jointPositionArray: number[],
    //             positionReference: POSITIONREFERENCE = POSITIONREFERENCE.ABSOLUTE,
    //             moveParams: MoveParametersConfig = {}
    //         ) {
    //             return exec(
    //                 ACTIVITYTYPE.ACTIVITYTYPE_MOVEJOINTS,
    //                 {
    //                     jointPositionArray,
    //                     positionReference
    //                 },
    //                 moveParams
    //             )
    //         },
    //         moveLineAtVelocity(line: CartesianVector, moveParams: MoveParametersConfig = {}) {
    //             return exec(
    //                 ACTIVITYTYPE.ACTIVITYTYPE_MOVELINEATVELOCITY,
    //                 {
    //                     line
    //                 },
    //                 moveParams
    //             )
    //         },
    //         moveToPosition(x: number, y: number, z: number, moveParams: MoveParametersConfig = {}) {
    //             const cartesianPosition: CartesianPositionsConfig = {
    //                 // TODO: can we come up with another name for position to avoid duplication in hierarchy
    //                 position: {
    //                     position: { x, y, z }
    //                 }
    //             }
    //
    //             return exec(
    //                 ACTIVITYTYPE.ACTIVITYTYPE_MOVETOPOSITION,
    //                 {
    //                     cartesianPosition
    //                 },
    //                 moveParams
    //             )
    //         },
    //         moveLine(pos: Vector3, relative = false, moveParams: MoveParametersConfig = {}) {
    //             return exec(
    //                 ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE,
    //                 {
    //                     line: {
    //                         positionReference: relative
    //                             ? POSITIONREFERENCE.RELATIVE
    //                             : POSITIONREFERENCE.ABSOLUTE,
    //                         position: pos
    //                     }
    //                 },
    //                 moveParams
    //             )
    //         }
    //     }
    // }, [connection, index])
}
