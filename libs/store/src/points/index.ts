/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { PointsConfig, WithNameAndDescription } from "../gbc"
import { CaseReducer, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { RootState } from "../root"

export type PointsSliceState = {
    selectedPoint: number
}

type PointsSliceReducers = {
    setSelectedPoint: CaseReducer<PointsSliceState, PayloadAction<number>>
}

export const pointsSlice = createSlice<PointsSliceState, PointsSliceReducers>({
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
export function usePointsList(
    overrides?: WithNameAndDescription<PointsConfig>[]
): WithNameAndDescription<PointsConfig>[] {
    const points = useSelector((state: RootState) => state.config.current.points)
    // const config = useConfig()
    // normalise points
    return (
        (overrides || points)?.map(p => ({
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
