/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { combineReducers, createSlice } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"

export const appSlice = createSlice({
    name: "liquid-handler",
    initialState: {
        tipPickUp: false,
        firstSuck: false
    },
    reducers: {
        setTipPickUp(state) {
            state.tipPickUp = true
        },
        unsetTipPickUp(state) {
            state.tipPickUp = false
        },
        setFirstSuck(state) {
            state.firstSuck = true
        },
        unsetFirstSuck(state) {
            state.firstSuck = false
        }
    }
})

export const appReducers = { app: appSlice.reducer }
const combinedAppReducer = combineReducers(appReducers)
export type AppState = ReturnType<typeof combinedAppReducer>

export function useAppState() {
    const tipPickUp = useSelector((state: AppState) => state.app.tipPickUp)
    const firstSuck = useSelector((state: AppState) => state.app.firstSuck)

    const dispatch = useDispatch()
    return {
        tipPickUp: tipPickUp,
        setTipPickUp: (tipPickUp: boolean) => {
            if (tipPickUp) {
                dispatch(appSlice.actions.setTipPickUp())
            } else {
                dispatch(appSlice.actions.unsetTipPickUp())
            }
        },
        firstSuck: firstSuck,
        setFirstSuck: (firstSuck: boolean) => {
            if (firstSuck) {
                dispatch(appSlice.actions.setFirstSuck())
            } else {
                dispatch(appSlice.actions.unsetFirstSuck())
            }
        }
    }
}
