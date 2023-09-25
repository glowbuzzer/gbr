/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { createSlice, Slice } from "@reduxjs/toolkit"
import { GlowbuzzerStatus, RootState } from ".."
import { useSelector } from "react-redux"

type EmStatType = GlowbuzzerStatus["emstat"]
export const emstatSlice: Slice<EmStatType> = createSlice({
    name: "emstat",
    initialState: null,
    reducers: {
        status(state, action) {
            return action.payload
        }
    }
})

export const useEtherCATMasterStatus = () => {
    return useSelector<RootState, EmStatType>(state => state.emstat)
}
