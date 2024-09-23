/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { createSlice, Slice } from "@reduxjs/toolkit"
import { ECM_CYCLIC_STATE, GlowbuzzerStatus, RootState } from ".."
import { useSelector } from "react-redux"
import { useState } from "react"

type EmStatType = GlowbuzzerStatus["emstat"]

export const emstatSlice: Slice<EmStatType> = createSlice({
    name: "emstat",
    initialState: null,
    reducers: {
        status(_state, action) {
            return action.payload
        }
    }
})

export function useEthercatMasterCyclicStatus(): ECM_CYCLIC_STATE {
    return useSelector<RootState, ECM_CYCLIC_STATE>(state => state.emstat?.cs)
}

export function useEtherCATMasterStatus(): EmStatType {
    return useSelector<RootState, EmStatType>(state => state.emstat) || {}
}
