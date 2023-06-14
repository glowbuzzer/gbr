/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createSlice, Slice } from "@reduxjs/toolkit"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import deepEqual from "fast-deep-equal"
import { RootState } from "../root"
import { useFrames } from "../frames"
import { Quaternion, Vector3 } from "three"

export type TraceElement = {
    x: number
    y: number
    z: number
    qx?: number
    qy?: number
    qz?: number
    qw?: number
}

type TraceForKinematicsConfiguration = {
    path: TraceElement[]
    enabled?: boolean
    last: unknown // record last status
}

type TraceSliceType = {
    kcs: TraceForKinematicsConfiguration[]
}
export const traceSlice: Slice<TraceSliceType> = createSlice({
    name: "trace",
    initialState: {
        kcs: [] as TraceForKinematicsConfiguration[]
    },
    reducers: {
        status(state, action) {
            action.payload.forEach((kc, index) => {
                const { x, y, z } = kc.position.translation

                state.kcs[index] ??= { path: [], last: undefined }
                const current = state.kcs[index]

                if (!current.enabled) {
                    return
                }
                if (current.last && deepEqual(current.last, kc)) {
                    // nothing's changed, so don't add to toolpath
                    return
                }
                current.path.push({ x, y, z })
                if (current.path.length > 500) {
                    // TODO: make max path length configurable
                    current.path.splice(0, 1)
                }
                current.last = kc
            })
        },
        enable(state, action) {
            const kc = action.payload
            const info = state.kcs[kc]
            if (info) {
                info.enabled = true
                info.path = []
            }
        },
        disable(state, action) {
            const kc = action.payload
            const info = state.kcs[kc]
            if (info) {
                info.enabled = false
            }
        },
        reset(state, action) {
            const kc = action.payload
            const info = state.kcs[kc]
            if (info) {
                // remove all but the last location
                info.path.splice(0, info.path.length - 1)
            }
        }
    }
})

/**
 * @ignore - Internal to the ThreeDimensionalScene tile
 */
export const useTrace = (kinematicsConfigurationIndex: number) => {
    const { path, enabled } = useSelector(({ trace }: RootState) => {
        const kc = trace.kcs[kinematicsConfigurationIndex]
        return {
            path: (kc?.path || []) as TraceElement[],
            enabled: kc?.enabled
        }
    }, shallowEqual)

    const dispatch = useDispatch()

    return {
        path: path as TraceElement[],
        enabled,
        reset() {
            dispatch(traceSlice.actions.reset(kinematicsConfigurationIndex))
        },
        enable() {
            dispatch(traceSlice.actions.enable(kinematicsConfigurationIndex))
        },
        disable() {
            dispatch(traceSlice.actions.disable(kinematicsConfigurationIndex))
        }
    }
}
