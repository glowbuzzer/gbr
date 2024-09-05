/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Flow } from "@glowbuzzer/store"
import { Checkbox, Form, Input, Modal } from "antd"
import { useEffect, useState } from "react"
import { PrecisionInput } from "../../util"

type FlowBasicSettingsEditModalProps = {
    flow: Flow
    onSave(flow: Flow): void
    onCancel(): void
}

type EditableFlowProps = Pick<Flow, "name" | "description" | "repeat" | "restricted">

export const FlowBasicSettingsEditModal = ({
    flow,
    onSave,
    onCancel
}: FlowBasicSettingsEditModalProps) => {
    const [edited, setEdited] = useState<EditableFlowProps>({
        name: flow.name,
        description: flow.description,
        restricted: !!flow.restricted,
        repeat: flow.repeat || 1
    })

    useEffect(() => {
        setEdited({
            name: flow.name,
            description: flow.description,
            restricted: !!flow.restricted,
            repeat: flow.repeat || 1
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
            title="Edit Flow Settings"
        >
            <Form layout="vertical" onValuesChange={update_values} initialValues={edited}>
                <Form.Item label="Flow Name" name="name">
                    <Input value={edited.name} />
                </Form.Item>
                <Form.Item label="Description" name="description">
                    <Input value={edited.description || ""} />
                </Form.Item>
                <Form.Item label="Repeat Count" name="repeat">
                    <PrecisionInput value={edited.repeat} precision={0} min={1} />
                </Form.Item>
                <Form.Item
                    label="Restricted (not Runnable)"
                    name="restricted"
                    valuePropName="checked"
                >
                    <Checkbox />
                </Form.Item>
            </Form>
        </Modal>
    )
}
