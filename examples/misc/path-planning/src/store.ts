/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { combineReducers, createSlice } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { Box3, Vector3 } from "three"

const initialState = {
    box: new Box3(new Vector3(200, 0, 0), new Vector3(600, 50, 300)),
    path: [new Vector3(400, -200, 200), new Vector3(400, 200, 200)],
    clearance: 30,
    showControls: true
}

export const appSlice = createSlice({
    name: "pathPlanning",
    initialState,
    reducers: {
        setBox(state, action) {
            state.box = action.payload
        },
        setPath(state, action) {
            state.path = action.payload
        },
        setClearance(state, action) {
            state.clearance = action.payload
        },
        setShowControls(state, action) {
            state.showControls = action.payload
        }
    }
})

export const pathPlanningAppReducers = { [appSlice.name]: appSlice.reducer }
const combinedAppReducer = combineReducers(pathPlanningAppReducers)
export type AppState = ReturnType<typeof combinedAppReducer>

export function useAppState() {
    return useSelector((state: AppState) => state.pathPlanning || initialState)
}
