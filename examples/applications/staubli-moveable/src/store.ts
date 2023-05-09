/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { combineReducers, createSlice } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"

export const appSlice = createSlice({
    name: "movable-staubli",
    initialState: {
        tracking: false
    },
    reducers: {
        track(state) {
            state.tracking = true
        },
        untrack(state) {
            state.tracking = false
        }
    }
})

export const appReducers = { app: appSlice.reducer }
const combinedAppReducer = combineReducers(appReducers)
export type AppState = ReturnType<typeof combinedAppReducer>

export function useAppState() {
    const tracking = useSelector((state: AppState) => state.app.tracking)
    const dispatch = useDispatch()
    return {
        tracking,
        setTracking: (tracking: boolean) => {
            if (tracking) {
                dispatch(appSlice.actions.track())
            } else {
                dispatch(appSlice.actions.untrack())
            }
        }
    }
}
