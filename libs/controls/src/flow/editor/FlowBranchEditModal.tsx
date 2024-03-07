/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useEffect, useState } from "react"
import { FlowBranch, TRIGGERON, useFlows } from "@glowbuzzer/store"
import { Modal, Select, Space } from "antd"
import { FlowEditTriggerParams } from "./triggers/FlowEditTriggerParams"
import { FlowEditTriggerOnDropdown } from "./triggers/FlowEditTriggerOnDropdown"
import { update_trigger_type, useEnabledTriggerOnOptions } from "./common/util"

function clone(item: FlowBranch): FlowBranch {
    return item ? JSON.parse(JSON.stringify(item)) : item
}

type FlowEditBranchModalProps = {
    selectedFlowIndex: number
    branch: FlowBranch
    onSave(item: FlowBranch): void
    onClose(): void
}

export const FlowBranchEditModal = ({
    selectedFlowIndex,
    branch,
    onSave,
    onClose
}: FlowEditBranchModalProps) => {
    const flows = useFlows()
    const enabledTriggerOnOptions = useEnabledTriggerOnOptions()
    const [edited, setEdited] = useState<FlowBranch>()

    useEffect(() => {
        setEdited(clone(branch))
    }, [branch])

    const options = flows.map((flow, index) => ({
        key: index,
        label: flow.name,
        value: index,
        disabled: index === selectedFlowIndex
    }))

    if (!edited) {
        return null
    }

    function update_type(type: TRIGGERON) {
        const next = {
            ...edited.trigger,
            type
        }
        const next_edited = {
            trigger: update_trigger_type(next, edited.trigger.type),
            flowIndex: edited.flowIndex
        }
        setEdited(next_edited)
    }

    function update_trigger(trigger) {
        return setEdited({ ...edited, trigger })
    }

    function save() {
        return onSave(edited)
    }

    return (
        <Modal open={true} onCancel={onClose} onOk={save} title="Configure Next Flow">
            <Space wrap>
                <div>After current flow ends, when condition</div>
                <FlowEditTriggerOnDropdown
                    type={edited.trigger.type}
                    onChange={update_type}
                    enabledOptions={enabledTriggerOnOptions}
                    includeImmediate
                />
                <FlowEditTriggerParams trigger={edited.trigger} onChange={update_trigger} /> is met,
                start flow
                <Select
                    size="small"
                    options={options}
                    value={edited.flowIndex}
                    onChange={flowIndex => setEdited({ ...edited, flowIndex })}
                />
            </Space>
        </Modal>
    )
}
