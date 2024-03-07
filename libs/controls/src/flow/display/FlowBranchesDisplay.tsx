/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Button, Card, Dropdown, Flex, Space } from "antd"
import { FlowBranch, TRIGGERON, TRIGGERTYPE, useFlows } from "@glowbuzzer/store"
import { StyledFlowSettingItem } from "../styles"
import { FlowBranchEditModal } from "../editor/FlowBranchEditModal"
import { GlowbuzzerIcon } from "../../util/GlowbuzzerIcon"
import { ReactComponent as EditIcon } from "@material-symbols/svg-400/outlined/edit.svg"
import { ReactComponent as DeleteIcon } from "@material-symbols/svg-400/outlined/delete.svg"
import { BranchesOutlined, PlusOutlined } from "@ant-design/icons"
import { FlowTriggerDisplay } from "./FlowTriggerDisplay"

type FlowEndBranchDisplayProps = {
    branches: FlowBranch[]
    onChange: (branches: FlowBranch[]) => void
    selectedFlowIndex: number
}

export const FlowBranchesDisplay = ({
    selectedFlowIndex,
    branches,
    onChange
}: FlowEndBranchDisplayProps) => {
    const flows = useFlows()

    const [editingBranchIndex, setEditingBranchIndex] = React.useState<number>()

    function save_branch(branch: FlowBranch) {
        const next = branches.map((item, index) => (index === editingBranchIndex ? branch : item))
        onChange(next)
        setEditingBranchIndex(null)
    }

    function delete_branch(index: number) {
        onChange(branches.filter((_, i) => i !== index))
    }

    const flow_items = flows.map((flow, index) => ({
        key: index,
        label: flow.name,
        value: index,
        disabled: index === selectedFlowIndex, // cannot call itself
        onClick() {
            onChange([
                ...branches,
                {
                    flowIndex: index,
                    trigger: {
                        type: TRIGGERON.TRIGGERON_DIGITAL_INPUT,
                        digital: { input: 0, when: TRIGGERTYPE.TRIGGERTYPE_RISING }
                    }
                }
            ])
            setEditingBranchIndex(branches.length)
        }
    }))

    return (
        <Card
            size="small"
            title={
                <Space>
                    <BranchesOutlined />
                    Branch After Flow Completed
                </Space>
            }
            actions={[
                <Dropdown
                    menu={{ items: flow_items }}
                    trigger={["click"]}
                    disabled={flows.length <= 1}
                >
                    <Button size="small" icon={<PlusOutlined />}>
                        Add Branch
                    </Button>
                </Dropdown>
            ]}
        >
            <FlowBranchEditModal
                selectedFlowIndex={selectedFlowIndex}
                branch={branches[editingBranchIndex]}
                onClose={() => setEditingBranchIndex(null)}
                onSave={save_branch}
            />
            <>
                {!!branches.length ? (
                    <div className="grid col3">
                        <div>Next Flow</div>
                        <div>When</div>
                        <div></div>
                        {branches.map((branch, index) => (
                            <React.Fragment key={index}>
                                <StyledFlowSettingItem>
                                    <div>{flows[branch.flowIndex].name}</div>
                                </StyledFlowSettingItem>
                                <FlowTriggerDisplay trigger={branch.trigger} />
                                <div className="actions">
                                    <GlowbuzzerIcon
                                        Icon={EditIcon}
                                        button
                                        onClick={() => setEditingBranchIndex(index)}
                                    />
                                    <GlowbuzzerIcon
                                        Icon={DeleteIcon}
                                        button
                                        onClick={() => delete_branch(index)}
                                    />
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                ) : (
                    <div>
                        When this flow completes, you can invoke another flow.{" "}
                        {flows.length <= 1 && <>Create another flow to enable this option.</>}
                    </div>
                )}
            </>
        </Card>
    )
}
