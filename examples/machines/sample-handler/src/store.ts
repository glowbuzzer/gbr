/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { combineReducers, createSlice } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"

export enum SampleLocation {
    PICK = "PICK",
    CENTRIFUGE = "CENTRIFUGE",
    ROBOT = "ROBOT",
    PLACE = "PLACE",
    CAMERA = "CAMERA"
}

export const appSlice = createSlice({
    name: "sample",
    initialState: {
        location: SampleLocation.PICK,
        trackingCamera: false,
        centrifugeRunning: false
    },
    reducers: {
        setLocation(state, value) {
            state.location = value.payload
        },
        setTrackingCamera(state, value) {
            state.trackingCamera = value.payload
        },
        setCentrifugeRunning(state, value) {
            state.centrifugeRunning = value.payload
        }
    }
})

export const appReducers = { sample: appSlice.reducer }
const combinedAppReducer = combineReducers(appReducers)
export type AppState = ReturnType<typeof combinedAppReducer>

export function useSampleState() {
    return useSelector((state: AppState) => state.sample)
}
