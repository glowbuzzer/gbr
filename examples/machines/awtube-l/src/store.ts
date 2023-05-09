/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

/**
 * This file contains the custom app state for the AWTUBE L machine. It is only used to store
 * the link lengths as they are being modified in the LinkLengthTile component.
 */
import { combineReducers, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"

type AppState = {
    linkLengths: number[]
}

export const appSlice = createSlice({
    name: "aware",
    initialState: {
        linkLengths: [725, 675] // default link lengths but will be overridden by the config
    },
    reducers: {
        setLinkLengths(state, action: PayloadAction<AppState["linkLengths"]>) {
            state.linkLengths = action.payload
        }
    }
})

// Boilerplate to make the store work
export const appReducers = { app: appSlice.reducer }
const combinedAppReducer = combineReducers(appReducers)
type RootState = ReturnType<typeof combinedAppReducer>

export function useCustomLinkLengths(): [number[], typeof setLinkLengths] {
    const linkLengths = useSelector<RootState, AppState["linkLengths"]>(
        state => state.app.linkLengths
    )
    const dispatch = useDispatch()

    function setLinkLengths(lengths: number[]) {
        dispatch(appSlice.actions.setLinkLengths(lengths))
    }

    return [linkLengths, setLinkLengths]
}
