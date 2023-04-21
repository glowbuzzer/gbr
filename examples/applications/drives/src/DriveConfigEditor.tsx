/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */
import { JOINT_FINITECONTINUOUS, JOINT_TYPE, useConfig, useConfigLoader } from "@glowbuzzer/store"
import * as React from "react"

import { Button, Form, Input, message, Select, Space } from "antd"
import styled from "styled-components"

const StyledDiv = styled.div`
    .buttons {
        padding-top: 10px;
        text-align: center;
    }

    .ant-form-item {
        margin-bottom: 0;
    }
`

export const DriveConfigEditor = ({ index }) => {
    const config = useConfig()
    const loader = useConfigLoader()
    const original_joint_config = config.joint[index]

    const [editedJointConfig, setEditedJointConfig] = React.useState(original_joint_config)
    const [selectedLimits, setSelectedLimits] = React.useState(0)
    const [modified, setModified] = React.useState(false)

    function reset() {
        setEditedJointConfig(original_joint_config)
        setModified(false)
    }

    function update_config(new_config) {
        setEditedJointConfig(current => ({ ...current, ...new_config }))
        setModified(true)
    }

    const joint_type_options = [
        { label: "Prismatic", value: JOINT_TYPE.JOINT_PRISMATIC },
        { label: "Revolute", value: JOINT_TYPE.JOINT_REVOLUTE }
    ]
    const joint_fincon_options = [
        { label: "Finite", value: JOINT_FINITECONTINUOUS.JOINT_FINITE },
        { label: "Continuous", value: JOINT_FINITECONTINUOUS.JOINT_CONTINUOUS }
    ]
    const joint_limit_options = [
        { label: "Default", value: 0 },
        { label: "Jogging", value: 1 },
        { label: "Rapids", value: 2 }
    ]

    function update_limit(e, limit: string) {
        const value = Number(e.target.value)
        const limits = [...editedJointConfig.limits]
        limits[selectedLimits] = { ...limits[selectedLimits], [limit]: value }
        update_config({ limits })
    }

    function save() {
        const new_config = {
            ...config,
            joint: config.joint.map((j, i) => (i === index ? editedJointConfig : j))
        }
        loader(new_config).then(() => {
            setModified(false)
            message.success("Configuration updated")
        })
    }

    return (
        <StyledDiv>
            <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} size="small">
                <Form.Item label="Name">
                    <Input
                        type={"text"}
                        value={editedJointConfig.name}
                        onChange={e => update_config({ name: e.target.value })}
                    />
                </Form.Item>
                <Form.Item label="Type">
                    <Select
                        options={joint_type_options}
                        value={editedJointConfig.jointType || JOINT_TYPE.JOINT_PRISMATIC}
                        onChange={e => update_config({ jointType: e })}
                    />
                </Form.Item>
                <Form.Item label="Movement">
                    <Select
                        options={joint_fincon_options}
                        value={
                            editedJointConfig.finiteContinuous ||
                            JOINT_FINITECONTINUOUS.JOINT_FINITE
                        }
                        onChange={e => update_config({ finiteContinuous: e })}
                    />
                </Form.Item>
                <Form.Item label="Neg Limit">
                    <Input
                        type={"number"}
                        value={editedJointConfig.negLimit}
                        onChange={e => update_config({ negLimit: Number(e.target.value) })}
                    />
                </Form.Item>
                <Form.Item label="Pos Limit">
                    <Input
                        type={"number"}
                        value={editedJointConfig.posLimit}
                        onChange={e => update_config({ posLimit: Number(e.target.value) })}
                    />
                </Form.Item>
                <Form.Item label="Scale">
                    <Input
                        type={"number"}
                        value={editedJointConfig.scale}
                        onChange={e => update_config({ scale: Number(e.target.value) })}
                    />
                </Form.Item>
                <Form.Item label="Limits">
                    <Select
                        options={joint_limit_options}
                        value={selectedLimits}
                        onChange={e => setSelectedLimits(e)}
                    />
                </Form.Item>
                <Form.Item label="Vmax">
                    <Input
                        type={"number"}
                        value={editedJointConfig.limits?.[selectedLimits]?.vmax || 0}
                        onChange={e => update_limit(e, "vmax")}
                    />
                </Form.Item>
                <Form.Item label="Amax">
                    <Input
                        type={"number"}
                        value={editedJointConfig.limits?.[selectedLimits]?.amax || 0}
                        onChange={e => update_limit(e, "amax")}
                    />
                </Form.Item>
                <Form.Item label="Jmax">
                    <Input
                        type={"number"}
                        value={editedJointConfig.limits?.[selectedLimits]?.jmax || 0}
                        onChange={e => update_limit(e, "jmax")}
                    />
                </Form.Item>
                <div className="buttons">
                    <Space>
                        <Button size="small" onClick={save} disabled={!modified}>
                            Save
                        </Button>
                        <Button size="small" onClick={reset} disabled={!modified}>
                            Reset
                        </Button>
                    </Space>
                </div>
            </Form>
        </StyledDiv>
    )
}
