/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { createSlice, Slice } from "@reduxjs/toolkit"
import { GlowbuzzerStatus, RootState } from ".."
import { useSelector } from "react-redux"

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

export function useStepMasterBootSuccessful(): boolean {
    return useSelector<RootState, boolean>(state => state.smstat?.bs?.boot_successful)
}

export function useStepMasterStatus(): SmStatType {
    return (
        useSelector<RootState, SmStatType>(state => {
            return state.smstat
        }) || {}
    )
}
