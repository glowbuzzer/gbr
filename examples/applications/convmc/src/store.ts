/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { combineReducers, createSlice } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { StateMachineDefinition } from "@glowbuzzer/store"

export enum CylinderAction {
    NONE,
    EXTEND,
    RETRACT
}

export enum ObjectType {
    NONE,
    DUCK,
    CAR
}

export enum Conveyor {
    CONVEYOR1,
    CONVEYOR2
}

const initialState = {
    currentWorkflowState: {
        definition: {} as StateMachineDefinition,
        currentState: null as string
    },
    cylinderAction: CylinderAction.NONE,
    cylinderPosition: 0,
    objectType: ObjectType.NONE,
    detectedObjectType: ObjectType.NONE,
    objectConveyor: Conveyor.CONVEYOR1,
    objectInitialPosition: 0,
    objectZ: 60,
    objectY: 0,
    jobEnabled: false
}
export const appSlice = createSlice({
    name: "convmc",
    initialState,
    reducers: {
        setObjectType(state, action) {
            state.objectType = action.payload
        },
        setCurrentWorkflowState(state, action) {
            state.currentWorkflowState = action.payload
        },
        setObjectY(state, action) {
            state.objectY = action.payload
        },
        setObjectZ(state, action) {
            state.objectZ = action.payload
        },
        drop(state, action) {
            state.objectType = action.payload
            state.objectConveyor = Conveyor.CONVEYOR1
            state.objectY = 0
            state.objectZ = initialState.objectZ
        },
        setObjectConveyor(state, action) {
            const { conveyor, position } = action.payload
            state.objectConveyor = conveyor
            state.objectInitialPosition = position
        },
        setObjectInitialPosition(state, action) {
            state.objectInitialPosition = action.payload
        },
        setCylinderPosition(state, action) {
            state.cylinderPosition = action.payload
        },
        setDetectedObjectType(state, action) {
            state.detectedObjectType = action.payload
        },
        reset() {
            return initialState
        },
        setJobEnabled(state, action) {
            state.jobEnabled = action.payload
        }
    }
})

export const sortingAppReducers = { [appSlice.name]: appSlice.reducer }
const combinedAppReducer = combineReducers(sortingAppReducers)
export type AppState = ReturnType<typeof combinedAppReducer>

export function useAppState() {
    return useSelector((state: AppState) => state.convmc || initialState)
}
