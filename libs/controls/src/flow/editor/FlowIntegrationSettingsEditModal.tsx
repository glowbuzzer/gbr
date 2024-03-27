/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Flow, FlowIntegration } from "@glowbuzzer/store"
import { useEffect, useState } from "react"
import { Form, Input, Modal } from "antd"

type FlowIntegrationSettingsEditModalProps = {
    flow: FlowIntegration
    onSave(flow: Flow): void
    onCancel(): void
}

type EditableFlowProps = Pick<FlowIntegration, "endpoint">

export const FlowIntegrationSettingsEditModal = ({
    flow,
    onSave,
    onCancel
}: FlowIntegrationSettingsEditModalProps) => {
    const [edited, setEdited] = useState<EditableFlowProps>({
        endpoint: flow.endpoint
    })

    useEffect(() => {
        setEdited({
            endpoint: flow.endpoint
        })
    }, [flow])

    function update_values(_, props: EditableFlowProps) {
        setEdited(current => ({ ...current, ...props }))
    }

    return (
        <Modal
            open={true}
            onCancel={onCancel}
            onOk={() => onSave({ ...flow, ...edited })}
            title="Edit Integration Settings"
        >
            <Form layout="vertical" onValuesChange={update_values} initialValues={edited}>
                <Form.Item
                    label="Integration Endpoint"
                    name="endpoint"
                    help="The endpoint receives the current state and should return a list of activities to add to the flow."
                >
                    <Input value={edited.endpoint} placeholder={"https://example.com"} />
                </Form.Item>
            </Form>
        </Modal>
    )
}
