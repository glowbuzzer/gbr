/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { FlowIntegration, flowSlice, FlowType, useFlow } from "@glowbuzzer/store"
import { Button, Card, Space } from "antd"
import { ApiOutlined } from "@ant-design/icons"
import { FlowIntegrationSettingsEditModal } from "../editor/FlowIntegrationSettingsEditModal"
import { useDispatch } from "react-redux"

export const FlowIntegrationDisplay = ({ selectedFlowIndex }) => {
    const flow = useFlow(selectedFlowIndex, FlowType.INTEGRATION)
    const [showEdit, setShowEdit] = React.useState(false)
    const dispatch = useDispatch()

    function save(flow: FlowIntegration) {
        dispatch(flowSlice.actions.updateFlow({ index: selectedFlowIndex, flow }))
        setShowEdit(false)
    }

    function cancel() {
        setShowEdit(false)
    }

    return (
        <Card
            size="small"
            title={
                <Space>
                    <ApiOutlined />
                    Integration Details
                </Space>
            }
            extra={
                <Button size="small" onClick={() => setShowEdit(true)}>
                    Edit Endpoint
                </Button>
            }
        >
            {showEdit && (
                <FlowIntegrationSettingsEditModal flow={flow} onSave={save} onCancel={cancel} />
            )}
            <div>Endpoint {flow.endpoint || "not set"}</div>
        </Card>
    )
}
