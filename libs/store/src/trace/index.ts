/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createSlice, Slice } from "@reduxjs/toolkit"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import deepEqual from "fast-deep-equal"
import { RootState } from "../root"
import { useFrames } from "../frames"
import { Quaternion, Vector3 } from "three"
import {
    CartesianPosition,
    CartesianPositionsConfig,
    GlowbuzzerKinematicsConfigurationStatus
} from "../gbc"

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
    last: GlowbuzzerKinematicsConfigurationStatus // record last status
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
            action.payload.forEach((kc: GlowbuzzerKinematicsConfigurationStatus, index) => {
                const { x, y, z } = kc.position.translation

                state.kcs[index] ??= { path: [], last: undefined, enabled: true }
                const current = state.kcs[index]

                if (!current.enabled) {
                    console.log("not enabled")
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
    const { path, enabled, last } = useSelector(
        ({ trace }: RootState): TraceForKinematicsConfiguration => {
            const kc = trace.kcs[kinematicsConfigurationIndex]
            return {
                path: kc?.path || [],
                enabled: kc?.enabled,
                last: kc?.last
            } as TraceForKinematicsConfiguration
        }
    )

    const dispatch = useDispatch()

    return {
        path,
        enabled,
        last,
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
