/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../root"
import { ActivityStreamItem } from "../gbc"
import { useMemo } from "react"
import { ActionCreators } from "redux-undo"
import { settings } from "../util/settings"
import { Flow, FlowBranch, FlowIntegration, FlowRegular, FlowType } from "./types"

const { load } = settings<FlowSliceState>("flows")

export type FlowSliceState = {
    flows: Flow[]
}

type FlowSliceReducers = {
    addFlow: (state: FlowSliceState, action: PayloadAction<{ type: Flow["type"] }>) => void
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
    moveActivity: (
        state: FlowSliceState,
        action: PayloadAction<{
            flow: number
            index: number
            direction: number
        }>
    ) => void
    updateBranches(
        state: FlowSliceState,
        action: PayloadAction<{ flow: number; branches: FlowBranch[] }>
    ): void
}

function regular_flow(flow: Flow) {
    if (flow.type !== "regular") {
        throw new Error("Invalid flow type. Expected regular flow")
    }
    return flow
}

export const flowSlice: Slice<FlowSliceState, FlowSliceReducers> = createSlice({
    name: "flow",
    initialState: () =>
        load({
            flows: []
        }),
    reducers: {
        addFlow: (state, action) => {
            switch (action.payload.type) {
                case FlowType.INTEGRATION:
                    state.flows.push({
                        type: FlowType.INTEGRATION,
                        name: `Integration ${state.flows.length + 1}`,
                        endpoint: "",
                        branches: []
                    })
                    break
                case FlowType.REGULAR:
                default:
                    state.flows.push({
                        type: FlowType.REGULAR,
                        name: `Sequence ${state.flows.length + 1}`,
                        activities: [],
                        branches: []
                    })
            }
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
            const flow = regular_flow(state.flows[action.payload.flow])
            flow.activities.push(action.payload.activity)
        },
        updateActivity(state, action) {
            const flow = regular_flow(state.flows[action.payload.flow])
            flow.activities[action.payload.index] = action.payload.activity
        },
        deleteActivity(state, action) {
            const flow = regular_flow(state.flows[action.payload.flow])
            flow.activities.splice(action.payload.index, 1)
        },
        moveActivity(state, action) {
            const flow = regular_flow(state.flows[action.payload.flow])
            const { index, direction } = action.payload
            const newIndex = index + direction
            if (newIndex < 0 || newIndex >= flow.activities.length) {
                return
            }
            const [activity] = flow.activities.splice(index, 1)
            flow.activities.splice(newIndex, 0, activity)
        },
        updateBranches(state, action) {
            state.flows[action.payload.flow].branches = action.payload.branches
        }
    }
})

export const useFlows = () => {
    return useSelector((state: RootState) => state.flow.present.flows)
}

export function useFlow<T extends FlowType>(
    index: number,
    type: T
): T extends FlowType.REGULAR ? FlowRegular : FlowIntegration {
    const flows = useFlows()
    const flow = flows[index]
    if (flow?.type !== type) {
        throw new Error(`Invalid flow type. Expected ${type} flow`)
    }
    return flow as T extends FlowType.REGULAR ? FlowRegular : FlowIntegration // we have verified the type
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

export * from "./types"
