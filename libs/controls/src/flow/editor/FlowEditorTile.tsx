/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import styled from "styled-components"
import {
    ActivityStreamItem,
    Flow,
    FlowBranch,
    flowSlice,
    FlowType,
    useFlows
} from "@glowbuzzer/store"
import { DockTileWithToolbar } from "../../dock/DockTileWithToolbar"
import { Button, Dropdown, Flex } from "antd"
import { FlowUndoRedoButtons } from "../FlowUndoRedoButtons"
import { ReactComponent as AddIcon } from "@material-symbols/svg-400/outlined/add.svg"
import { GlowbuzzerIcon } from "../../util/GlowbuzzerIcon"
import { FlowEditModal } from "./FlowEditModal"
import { useDispatch } from "react-redux"
import { FlowBranchesDisplay } from "../display/FlowBranchesDisplay"
import { FlowBasicSettingsDisplay } from "../display/FlowBasicSettingsDisplay"
import { FlowActivitiesDisplay } from "../display/FlowActivitiesDisplay"
import { useFlowContext } from "../FlowContextProvider"
import { FlowIntegrationDisplay } from "../display/FlowIntegrationDisplay"
import { FlowSelectDropdown } from "../FlowSelectDropdown"
import { StyledEmpty } from "../styles"
import { useEffect } from "react"

const StyledDiv = styled.div`
    padding: 10px;

    .grid {
        display: grid;
        grid-template-columns: 1fr 3fr 1fr 1fr;
        grid-gap: 10px;
    }

    .col3 {
        grid-template-columns: 1fr 3fr 1fr;
    }

    .actions {
        text-align: right;
    }
`

/**
 * Provides editing capability for Flow Maker tasks, which are complex sequences of activities on a machine.
 */
export const FlowEditorTile = () => {
    const flows = useFlows()
    const { selectedFlowIndex, setSelectedFlowIndex } = useFlowContext()

    const [editingActivity, setEditingActivity] = React.useState<{
        flow: number
        sequence: number
        index: number
        activity: ActivityStreamItem
    }>()
    const dispatch = useDispatch()

    function save_activity_edit(activity: ActivityStreamItem) {
        dispatch(flowSlice.actions.updateActivity({ ...editingActivity, activity }))
        setEditingActivity(null)
    }

    function save_flow_edit(flow: Flow) {
        dispatch(flowSlice.actions.updateFlow({ index: selectedFlowIndex, flow }))
    }

    function delete_flow() {
        setSelectedFlowIndex(Math.min(flows.length - 2, selectedFlowIndex))
        dispatch(flowSlice.actions.deleteFlow(selectedFlowIndex))
    }

    function cancel_activity_edit() {
        setEditingActivity(null)
    }

    function update_branches(branches: FlowBranch[]) {
        dispatch(flowSlice.actions.updateBranches({ flow: selectedFlowIndex, branches }))
    }

    function add_flow(type: FlowType) {
        dispatch(flowSlice.actions.addFlow({ type }))
        setSelectedFlowIndex(flows.length)
    }

    const add_flow_items = [
        {
            key: "regular",
            value: "regular",
            label: "Activity Sequence",
            onClick: () => add_flow(FlowType.REGULAR)
        },
        {
            key: "integration",
            value: "integration",
            label: "Integration",
            onClick: () => add_flow(FlowType.INTEGRATION)
        }
    ]

    if (!flows.length) {
        return (
            <StyledEmpty>
                <div className="description">
                    Flows allow you to create complex sequences of activities, including dynamic
                    triggers, external integrations and branching
                </div>
                <Dropdown menu={{ items: add_flow_items }} trigger={["click"]}>
                    <Button type="primary">Create Flow</Button>
                </Dropdown>
            </StyledEmpty>
        )
    }

    const selected_index = Math.min(selectedFlowIndex, flows.length - 1)
    const flow = flows[selected_index]

    return (
        <DockTileWithToolbar
            toolbar={
                <>
                    <FlowSelectDropdown />
                    <Dropdown menu={{ items: add_flow_items }} trigger={["click"]}>
                        <GlowbuzzerIcon Icon={AddIcon} button />
                    </Dropdown>
                    <FlowUndoRedoButtons />
                </>
            }
        >
            <FlowEditModal
                item={editingActivity?.activity}
                onSave={save_activity_edit}
                onClose={cancel_activity_edit}
            />
            <StyledDiv>
                <Flex vertical gap="middle">
                    <FlowBasicSettingsDisplay
                        flow={flow}
                        onChange={save_flow_edit}
                        onDelete={delete_flow}
                    />
                    {flow.type === FlowType.REGULAR ? (
                        <FlowActivitiesDisplay
                            selectedFlowIndex={selected_index}
                            onEditActivity={setEditingActivity}
                        />
                    ) : (
                        <FlowIntegrationDisplay selectedFlowIndex={selected_index} />
                    )}
                    <FlowBranchesDisplay
                        selectedFlowIndex={selected_index}
                        branches={flow.branches}
                        onChange={update_branches}
                    />
                </Flex>
            </StyledDiv>
        </DockTileWithToolbar>
    )
}
