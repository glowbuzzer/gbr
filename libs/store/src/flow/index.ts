/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../root"
import { ActivityStreamItem, TriggerParams } from "../gbc"
import { useMemo } from "react"
import { ActionCreators } from "redux-undo"
import { settings } from "../util/settings"

const { load } = settings("flows")

export type FlowBranch = {
    flowIndex: number
    trigger: Omit<TriggerParams, "action">
}

export type Flow = {
    name: string
    description?: string
    repeat?: number
    activities: ActivityStreamItem[]
    branches: FlowBranch[]
}

type FlowSliceState = {
    flows: Flow[]
}

type FlowSliceReducers = {
    addFlow: (state: FlowSliceState) => void
    updateFlow: (
        state: FlowSliceState,
        action: PayloadAction<{ index: number; flow: Flow }>
    ) => void
    deleteFlow: (state: FlowSliceState, action: PayloadAction<number>) => void
    addActivity: (
        state: FlowSliceState,
        action: PayloadAction<{
            flow: number
            activity: ActivityStreamItem
        }>
    ) => void
    updateActivity: (
        state: FlowSliceState,
        action: PayloadAction<{
            flow: number
            index: number
            activity: ActivityStreamItem
        }>
    ) => void
    deleteActivity: (
        state: FlowSliceState,
        action: PayloadAction<{
            flow: number
            index: number
        }>
    ) => void
    updateBranches(
        state: FlowSliceState,
        action: PayloadAction<{ flow: number; branches: FlowBranch[] }>
    ): void
}

export const flowSlice = createSlice<FlowSliceState, FlowSliceReducers>({
    name: "flow",
    initialState: () =>
        load({
            flows: []
        }),
    reducers: {
        addFlow: state => {
            state.flows.push({
                name: `Flow ${state.flows.length + 1}`,
                activities: [],
                branches: []
            })
        },
        updateFlow: (state, action) => {
            state.flows[action.payload.index] = action.payload.flow
        },
        deleteFlow: (state, action) => {
            const index = action.payload
            // adapt branch flowIndex and remove flow
            state.flows = state.flows
                .map(flow => {
                    return {
                        ...flow,
                        branches: flow.branches?.map(branch => ({
                            ...branch,
                            flowIndex:
                                branch.flowIndex > index ? branch.flowIndex - 1 : branch.flowIndex
                        }))
                    }
                })
                .filter((_, i) => i !== index)
        },
        addActivity: (state, action) => {
            state.flows[action.payload.flow].activities.push(action.payload.activity)
        },
        updateActivity(state, action) {
            state.flows[action.payload.flow].activities[action.payload.index] =
                action.payload.activity
        },
        deleteActivity(state, action) {
            state.flows[action.payload.flow].activities.splice(action.payload.index, 1)
        },
        updateBranches(state, action) {
            state.flows[action.payload.flow].branches = action.payload.branches
        }
    }
})

export const useFlows = () => {
    return useSelector((state: RootState) => state.flow.present.flows)
}

export const useFlowUndo = () => {
    const past = useSelector((state: RootState) => state.flow.past)
    const future = useSelector((state: RootState) => state.flow.future)
    const dispatch = useDispatch()

    return useMemo(() => {
        return {
            undo: past.length ? () => dispatch(ActionCreators.undo()) : undefined,
            redo: future.length ? () => dispatch(ActionCreators.redo()) : undefined
        }
    }, [past, future])
}
