import React, { useState } from "react"
import { Button, List, Select, Space } from "antd"
import useMessage from "antd/es/message/useMessage"
import {
    configSlice,
    EnvelopeConstraint,
    KC_ENVELOPE_CONSTRAINT_TYPE,
    useConfig
} from "@glowbuzzer/store"
import { MachineEnvelopeConstraintItem } from "./MachineEnvelopeConstraintItem"
import { MachineEnvelopeConstraintEditModal } from "./MachineEnvelopeConstraintEditModal"
import { ActionButton } from "../ioConfig/ActionButton"
import { useDispatch } from "react-redux"
import { StyledFlex } from "../ioConfig/commonStyles"

const { Option } = Select

export const MachineEnvelopeConfigTab = () => {
    const [constraints, setConstraints] = useState<EnvelopeConstraint[]>([])
    const [selectedConstraintType, setSelectedConstraintType] =
        useState<KC_ENVELOPE_CONSTRAINT_TYPE>(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [messageApi, messageContext] = useMessage()
    const config = useConfig()
    const dispatch = useDispatch()

    const existing = config.kinematicsConfiguration[0]?.envelopeConstraints || []
    const modified = JSON.stringify(constraints) !== JSON.stringify(existing)

    const handleAddConstraint = async () => {
        if (
            selectedConstraintType === KC_ENVELOPE_CONSTRAINT_TYPE.KC_ENVELOPE_CONSTRAINT_PLANE &&
            constraints.some(
                c => c.constraintType !== KC_ENVELOPE_CONSTRAINT_TYPE.KC_ENVELOPE_CONSTRAINT_PLANE
            )
        ) {
            await messageApi.error("Cannot add Plane when Box, Cylinder or Sphere is present")
            return
        }

        if (
            [
                KC_ENVELOPE_CONSTRAINT_TYPE.KC_ENVELOPE_CONSTRAINT_BOX,
                KC_ENVELOPE_CONSTRAINT_TYPE.KC_ENVELOPE_CONSTRAINT_CYLINDER,
                KC_ENVELOPE_CONSTRAINT_TYPE.KC_ENVELOPE_CONSTRAINT_SPHERE
            ].includes(selectedConstraintType) &&
            constraints.length > 0
        ) {
            await messageApi.error(
                "Cannot add Box, Cylinder or Sphere when other constraints are present"
            )
            return
        }

        if (
            selectedConstraintType === KC_ENVELOPE_CONSTRAINT_TYPE.KC_ENVELOPE_CONSTRAINT_PLANE &&
            constraints.filter(
                c => c.constraintType === KC_ENVELOPE_CONSTRAINT_TYPE.KC_ENVELOPE_CONSTRAINT_PLANE
            ).length >= 3
        ) {
            await messageApi.error("Cannot add more than three Plane constraints")
            return
        }

        setModalVisible(true)
    }

    function cancel() {
        setModalVisible(false)
    }

    function add_new_constraint(item: EnvelopeConstraint) {
        setConstraints([...constraints, item])
        setSelectedConstraintType(null)
        setModalVisible(false)
    }

    function delete_item(index: number) {
        setConstraints(constraints.filter((_, i) => i !== index))
    }

    function change_item(index: number, item: EnvelopeConstraint) {
        setConstraints(constraints.map((c, i) => (i === index ? item : c)))
    }

    function save() {
        dispatch(
            configSlice.actions.addConfig({
                kinematicsConfiguration: [
                    {
                        ...config.kinematicsConfiguration[0],
                        envelopeConstraints: constraints
                    }
                ]
            })
        )
    }

    function reset() {
        setConstraints(existing || [])
    }

    return (
        <StyledFlex>
            {messageContext}
            <Space style={{ paddingBottom: "6px" }}>
                <Select
                    value={selectedConstraintType}
                    onChange={value => setSelectedConstraintType(value)}
                    style={{ width: 200, marginRight: 10 }}
                    placeholder="Select constraint type"
                    size="small"
                >
                    <Option value={KC_ENVELOPE_CONSTRAINT_TYPE.KC_ENVELOPE_CONSTRAINT_PLANE}>
                        Plane
                    </Option>
                    <Option value={KC_ENVELOPE_CONSTRAINT_TYPE.KC_ENVELOPE_CONSTRAINT_BOX}>
                        Box
                    </Option>
                    <Option value={KC_ENVELOPE_CONSTRAINT_TYPE.KC_ENVELOPE_CONSTRAINT_CYLINDER}>
                        Cylinder
                    </Option>
                    <Option value={KC_ENVELOPE_CONSTRAINT_TYPE.KC_ENVELOPE_CONSTRAINT_SPHERE}>
                        Sphere
                    </Option>
                </Select>
                <Button
                    size="small"
                    type="primary"
                    onClick={handleAddConstraint}
                    disabled={!selectedConstraintType}
                >
                    Add Constraint
                </Button>
            </Space>

            <List
                className="content"
                header={<div>Added Constraints</div>}
                bordered
                size="small"
                dataSource={constraints}
                renderItem={(item, index) => (
                    <MachineEnvelopeConstraintItem
                        item={item}
                        onDelete={() => delete_item(index)}
                        onChange={item => change_item(index, item)}
                    />
                )}
            />

            <div className="actions">
                <Space>
                    <ActionButton
                        onClick={save}
                        disabled={!modified}
                        tooltipTitle="Save the changes to the configuration"
                        type="primary"
                    >
                        Save
                    </ActionButton>
                    <ActionButton
                        onClick={reset}
                        disabled={!modified}
                        tooltipTitle="Reset changes made to the envelope configuration"
                        type="default"
                    >
                        Reset
                    </ActionButton>
                </Space>
            </div>

            <MachineEnvelopeConstraintEditModal
                open={modalVisible}
                item={{ constraintType: selectedConstraintType }}
                onConfirm={add_new_constraint}
                onCancel={cancel}
            />
        </StyledFlex>
    )
}
