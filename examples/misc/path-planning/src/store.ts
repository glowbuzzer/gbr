/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { combineReducers, createSlice } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { Box3, Vector3 } from "three"
import { avoid } from "./planning"

const initialState = {
    box: new Box3(new Vector3(200, -50, 0), new Vector3(400, 50, 300)),
    path: [new Vector3(300, -200, 200), new Vector3(300, 200, 200)],
    plannedPath: [],
    clearance: 60,
    showControls: false,
    route: 0b000011
}

function plan_path(box: Box3, path: Vector3[], clearance, route) {
    const moves = path.slice(1).map((p, i) => {
        return [path[i], p]
    })
    return moves
        .map(([p1, p2]) => {
            return avoid(box, p1, p2, clearance, route)
        })
        .flat()
}

export const appSlice = createSlice({
    name: "pathPlanning",
    initialState,
    reducers: {
        setBox(state, action) {
            state.box = action.payload
            state.plannedPath = plan_path(state.box, state.path, state.clearance, state.route)
        },
        setPath(state, action) {
            state.path = action.payload
            state.plannedPath = plan_path(state.box, state.path, state.clearance, state.route)
        },
        setClearance(state, action) {
            state.clearance = action.payload
            state.plannedPath = plan_path(state.box, state.path, state.clearance, state.route)
        },
        setShowControls(state, action) {
            state.showControls = action.payload
        },
        setRoute(state, action) {
            state.route = action.payload
            state.plannedPath = plan_path(state.box, state.path, state.clearance, state.route)
        }
    }
})

export const pathPlanningAppReducers = { [appSlice.name]: appSlice.reducer }
const combinedAppReducer = combineReducers(pathPlanningAppReducers)
export type AppState = ReturnType<typeof combinedAppReducer>

export function useAppState() {
    return useSelector((state: AppState) => state.pathPlanning || initialState)
}
