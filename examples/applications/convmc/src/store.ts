/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { combineReducers, createSlice } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { digitalOutputsSlice, machineSlice, StateMachineDefinition } from "@glowbuzzer/store"
import { DigitalOutput } from "./constants"

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
        setDetectedObjectType(state, action) {
            state.detectedObjectType = action.payload
        },
        reset() {
            return initialState
        },
        setJobEnabled(state, action) {
            state.jobEnabled = action.payload
        }
    },
    extraReducers: builder => {
        // we want to produce a virtual cylinder positoin based on whether the cylinder is triggered or not
        let cylinderPosition = 0
        let cylinderStepDirection = 0
        let lastHeartbeat = 0
        builder.addCase(digitalOutputsSlice.actions.status, (state, action) => {
            const heartbeat = action.payload.heartbeat
            // don't do anything if we haven't received a heartbeat yet
            if (lastHeartbeat > 0) {
                // the delta is used to control the speed of the pusher
                const delta = heartbeat - lastHeartbeat

                // are we triggered?
                const cylinderTriggered =
                    action.payload.status[DigitalOutput.CYLINDER].effectiveValue

                // update the direction based on triggered / not triggered
                if (cylinderTriggered && cylinderPosition < 0.1) {
                    cylinderStepDirection = 1
                } else if (!cylinderTriggered && cylinderPosition > 0) {
                    cylinderStepDirection = -1
                } else {
                    cylinderStepDirection = 0
                }

                // if we're currently stepping in/out the cylinder, update the state
                if (cylinderStepDirection !== 0) {
                    let new_position = cylinderPosition + cylinderStepDirection * delta * 0.001
                    if (new_position < 0) {
                        new_position = 0
                        cylinderStepDirection = 0
                    } else if (new_position > 0.1) {
                        new_position = 0.1
                        cylinderStepDirection = 0
                    }
                    cylinderPosition = new_position
                }
                // finally make the position available in the app state
                state.cylinderPosition = cylinderPosition
            }
            lastHeartbeat = heartbeat
        })
    }
})

export const sortingAppReducers = { [appSlice.name]: appSlice.reducer }
const combinedAppReducer = combineReducers(sortingAppReducers)
export type AppState = ReturnType<typeof combinedAppReducer>

export function useAppState() {
    return useSelector((state: AppState) => state.convmc || initialState)
}
