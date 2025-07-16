/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Button, Card, Flex, Space } from "antd"
import { PlusOutlined, UnorderedListOutlined } from "@ant-design/icons"
import { FlowTeachControls } from "../FlowTeachControls"
import { FlowAddActivityDropdown } from "../FlowAddActivityDropdown"
import { FlowActivityDisplay } from "./FlowActivityDisplay"
import { ActivityStreamItem, flowSlice, FlowType, useFlow, useStream } from "@glowbuzzer/store"
import { useDispatch } from "react-redux"

export const FlowActivitiesDisplay = ({ selectedFlowIndex, onEditActivity }) => {
    const dispatch = useDispatch()
    const api = useStream(0)

    const flow = useFlow(selectedFlowIndex, FlowType.REGULAR)
    const activities = flow.activities

    function delete_activity(index: number) {
        dispatch(flowSlice.actions.deleteActivity({ flow: selectedFlowIndex, index }))
    }

    async function execute_activity(index: number) {
        await api.execute(api => api.from(activities[index]))
    }

    function move_activity(index: number, direction: number) {
        dispatch(
            flowSlice.actions.moveActivity({
                flow: selectedFlowIndex,
                index,
                direction
            })
        )
    }

    function add_activity(activity: ActivityStreamItem) {
        dispatch(
            flowSlice.actions.addActivity({
                flow: selectedFlowIndex,
                activity
            })
        )
    }

    function start_activity_edit(item: ActivityStreamItem, index: number) {
        onEditActivity({
            flow: selectedFlowIndex,
            sequence: 0,
            index,
            activity: item
        })
    }

    return (
        <Card
            size="small"
            title={
                <Space>
                    <UnorderedListOutlined />
                    Activity Sequence
                </Space>
            }
            extra={<FlowTeachControls onAddActivity={add_activity} />}
            actions={[
                <FlowAddActivityDropdown onAddActivity={add_activity}>
                    <Button size="small" icon={<PlusOutlined />}>
                        Add Activity
                    </Button>
                </FlowAddActivityDropdown>
            ]}
        >
            {!!activities.length ? (
                <Flex vertical gap="small">
                    <div className="grid">
                        <div>Activity</div>
                        <div>Parameters</div>
                        <div>Triggers</div>
                        <div></div>
                        {activities.map((item, index) => {
                            return (
                                <FlowActivityDisplay
                                    key={index}
                                    item={item}
                                    onEdit={() => start_activity_edit(item, index)}
                                    onDelete={() => delete_activity(index)}
                                    onExecute={() => execute_activity(index)}
                                    onMoveUp={() => move_activity(index, -1)}
                                    onMoveDown={() => move_activity(index, 1)}
                                />
                            )
                        })}
                    </div>
                </Flex>
            ) : (
                <div>No activities yet in sequence</div>
            )}
        </Card>
    )
}
