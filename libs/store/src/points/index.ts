/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { useConfig } from "../config"
import { GlowbuzzerConfig } from "../gbc"
import { createSlice, Slice } from "@reduxjs/toolkit"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { RootState } from "../root"

type PointsSliceType = {
    selectedPoint: number
}

export const pointsSlice: Slice<PointsSliceType> = createSlice({
    name: "points",
    initialState: {
        selectedPoint: null
    },
    reducers: {
        setSelectedPoint(state, action) {
            state.selectedPoint = action.payload
        }
    }
})

/**
 * Provides access to the points that have been configured. The overrides parameter is used by GBR for dynamic editing of points
 * and should not generally be used by applications.
 */
export function usePointsList(overrides?: GlowbuzzerConfig["points"]): GlowbuzzerConfig["points"] {
    const config = useConfig()
    // normalise points
    return (
        (overrides || config.points)?.map(p => ({
            ...p,
            translation: {
                x: 0,
                y: 0,
                z: 0,
                ...p.translation
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0,
                w: 1,
                ...p.rotation
            }
        })) || []
    )
}

/** @ignore - used internally by the points tile */
export function useSelectedPoint(): [number, (index: number) => void] {
    const dispatch = useDispatch()
    const selectedPoint = useSelector(
        (state: RootState) => state.points.selectedPoint,
        shallowEqual
    )

    return [selectedPoint, (index: number) => dispatch(pointsSlice.actions.setSelectedPoint(index))]
}
