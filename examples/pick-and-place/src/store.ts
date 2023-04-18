/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { combineReducers, createSlice } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"

export const appSlice = createSlice({
    name: "picknplace",
    initialState: {
        leftBlocks: 3,
        rightBlocks: 0,
        pick: false
    },
    reducers: {
        pick(state) {
            state.pick = true
            state.leftBlocks--
        },
        place(state) {
            state.pick = false
            state.rightBlocks++
        },
        reset() {
            return {
                leftBlocks: 3,
                rightBlocks: 0,
                pick: false
            }
        }
    }
})

export const appReducers = { picknplace: appSlice.reducer }
const combinedAppReducer = combineReducers(appReducers)
export type AppState = ReturnType<typeof combinedAppReducer>

export function useAppState() {
    return useSelector(
        (state: AppState) =>
            state.picknplace || {
                leftBlocks: 3,
                rightBlocks: 0,
                pick: false
            }
    )
}
