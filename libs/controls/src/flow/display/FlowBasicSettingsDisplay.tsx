/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useState } from "react"
import { Card, Flex, Popconfirm, Space, Tag } from "antd"
import { Flow, useFlows } from "@glowbuzzer/store"

import { ReactComponent as EditIcon } from "@material-symbols/svg-400/outlined/edit.svg"
import { ReactComponent as DeleteIcon } from "@material-symbols/svg-400/outlined/delete.svg"
import { GlowbuzzerIcon } from "../../util/GlowbuzzerIcon"
import { FlowBasicSettingsEditModal } from "../editor/FlowBasicSettingsEditModal"
import useModal from "antd/es/modal/useModal"
import { FileOutlined, InfoCircleOutlined, InfoOutlined, PlusOutlined } from "@ant-design/icons"

type FlowBasicSettingsDisplayProps = {
    flow: Flow
    onChange(flow: Flow): void
    onDelete?(): void
}

export const FlowBasicSettingsDisplay = ({
    flow,
    onChange,
    onDelete
}: FlowBasicSettingsDisplayProps) => {
    const [editing, setEditing] = useState(false)
    const [modal, contextHolder] = useModal()
    const flows = useFlows()

    const flow_index = flows.indexOf(flow)
    const used_in_flows = flows.filter(
        f => f !== flow && f.branches.some(b => b.flowIndex === flow_index)
    )
    const in_use = used_in_flows.length > 0

    function save(flow: Flow) {
        onChange(flow)
        setEditing(false)
    }

    function show_in_use_message() {
        modal.error({
            title: "Flow in use",
            content: (
                <Flex vertical gap="small">
                    <div>This flow is used by the following flows and cannot be deleted.</div>
                    <ul>
                        {used_in_flows.map((f, index) => (
                            <li key={index}>{f.name}</li>
                        ))}
                    </ul>
                </Flex>
            )
        })
    }

    return (
        <Card
            size="small"
            title={
                <Space>
                    <InfoCircleOutlined /> Flow Basic Settings
                </Space>
            }
            extra={
                <>
                    <GlowbuzzerIcon Icon={EditIcon} button onClick={() => setEditing(true)} />
                    {in_use ? (
                        <GlowbuzzerIcon Icon={DeleteIcon} button onClick={show_in_use_message} />
                    ) : (
                        <Popconfirm
                            title={<>Are you sure you want to delete this flow?</>}
                            onConfirm={onDelete}
                            okText="Delete"
                            cancelText="Cancel"
                        >
                            <GlowbuzzerIcon Icon={DeleteIcon} button disabled={!onDelete} />
                        </Popconfirm>
                    )}
                </>
            }
        >
            {contextHolder}
            {editing && (
                <FlowBasicSettingsEditModal
                    flow={flow}
                    onSave={save}
                    onCancel={() => setEditing(false)}
                />
            )}
            <Card.Meta
                description={flow.description}
                title={
                    <Space>
                        <div>Flow "{flow.name}"</div>
                        {flow.repeat > 1 && <Tag>Repeat {flow.repeat} times</Tag>}
                    </Space>
                }
            />
        </Card>
    )
}
