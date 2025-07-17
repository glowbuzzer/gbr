/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { createSlice, Slice } from "@reduxjs/toolkit"
import { ECM_CYCLIC_STATE, GlowbuzzerStatus, RootState } from ".."
import { useSelector } from "react-redux"
import { useState } from "react"

type SmStatType = GlowbuzzerStatus["smstat"]

type SmStatCaseReducers = {
    status: (state: SmStatType | null, action: { payload: SmStatType }) => SmStatType | null
}

export const smstatSlice: Slice<SmStatType, SmStatCaseReducers> = createSlice({
    name: "smstat",
    initialState: null,
    reducers: {
        status(_state, action) {
            return action.payload
        }
    }
})

export function useStepMasterCyclicStatus(): ECM_CYCLIC_STATE {
    return useSelector<RootState, ECM_CYCLIC_STATE>(state => state.smstat?.cs)
}

export function useStepMasterStatus(): SmStatType {
    return (
        useSelector<RootState, SmStatType>(state => {
            return state.smstat
        }) || {}
    )
}
