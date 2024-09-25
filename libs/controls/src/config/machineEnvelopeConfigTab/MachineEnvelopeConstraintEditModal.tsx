/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import {
    EnvelopeConstraint,
    KC_ENVELOPE_CONSTRAINT_AXIS,
    KC_ENVELOPE_CONSTRAINT_TYPE
} from "@glowbuzzer/store"
import { Checkbox, Form, Input, Modal, Select } from "antd"
import { PrecisionInput } from "../../util"
import React, { ForwardedRef, forwardRef, useEffect } from "react"
import { useForm } from "antd/es/form/Form"

const AxisSelect = forwardRef(
    ({ value = null, onChange = () => {}, ...props }: any, ref: ForwardedRef<HTMLInputElement>) => {
        return (
            <Select ref={ref} value={value} onChange={onChange} {...props}>
                <Select.Option value={KC_ENVELOPE_CONSTRAINT_AXIS.KC_ENVELOPE_CONSTRAINT_AXIS_X}>
                    X
                </Select.Option>
                <Select.Option value={KC_ENVELOPE_CONSTRAINT_AXIS.KC_ENVELOPE_CONSTRAINT_AXIS_Y}>
                    Y
                </Select.Option>
                <Select.Option value={KC_ENVELOPE_CONSTRAINT_AXIS.KC_ENVELOPE_CONSTRAINT_AXIS_Z}>
                    Z
                </Select.Option>
            </Select>
        )
    }
)

const CoordinateInput = ({ namePrefix, labelPrefix }) => {
    return (
        <>
            <Form.Item
                name={[namePrefix, "x"]}
                label={`${labelPrefix} X`}
                rules={[{ type: "number" }]}
            >
                <PrecisionInput precision={1} />
            </Form.Item>
            <Form.Item
                name={[namePrefix, "y"]}
                label={`${labelPrefix} Y`}
                rules={[{ type: "number" }]}
            >
                <PrecisionInput precision={1} />
            </Form.Item>
            <Form.Item
                name={[namePrefix, "z"]}
                label={`${labelPrefix} Z`}
                rules={[{ type: "number" }]}
            >
                <PrecisionInput precision={1} />
            </Form.Item>
        </>
    )
}

const HiddenFields = ({ constraintType, unionType }) => {
    return (
        <>
            <Form.Item name="constraintType" initialValue={constraintType} hidden>
                <Input />
            </Form.Item>
            <Form.Item name="unionType" initialValue={unionType} hidden>
                <Input />
            </Form.Item>
        </>
    )
}

const FormFields = ({
    selectedConstraint
}: {
    selectedConstraint: KC_ENVELOPE_CONSTRAINT_TYPE
}) => {
    switch (selectedConstraint) {
        case KC_ENVELOPE_CONSTRAINT_TYPE.KC_ENVELOPE_CONSTRAINT_PLANE:
            return (
                <>
                    <HiddenFields constraintType={selectedConstraint} unionType="plane" />
                    <Form.Item name="direction" label="Direction" rules={[{ required: true }]}>
                        <AxisSelect />
                    </Form.Item>
                    <Form.Item name="position" label="Position" rules={[{ type: "number" }]}>
                        <PrecisionInput precision={1} />
                    </Form.Item>
                    <Form.Item name="outside" valuePropName="checked" initialValue={false}>
                        <Checkbox>Outside</Checkbox>
                    </Form.Item>
                </>
            )
        case KC_ENVELOPE_CONSTRAINT_TYPE.KC_ENVELOPE_CONSTRAINT_BOX:
            return (
                <>
                    <HiddenFields constraintType={selectedConstraint} unionType="box" />
                    <CoordinateInput labelPrefix={"Origin"} namePrefix={"origin"} />
                    <CoordinateInput labelPrefix={"Extents"} namePrefix={"extents"} />
                    <Form.Item name="outside" valuePropName="checked" initialValue={false}>
                        <Checkbox>Outside</Checkbox>
                    </Form.Item>
                </>
            )
        case KC_ENVELOPE_CONSTRAINT_TYPE.KC_ENVELOPE_CONSTRAINT_CYLINDER:
            return (
                <>
                    <HiddenFields constraintType={selectedConstraint} unionType="cylinder" />
                    <Form.Item name="axis" label="Axis" rules={[{ required: true }]}>
                        <AxisSelect />
                    </Form.Item>
                    <CoordinateInput labelPrefix={"Center"} namePrefix={"center"} />
                    <Form.Item name="radius" label="Radius">
                        <PrecisionInput precision={1} />
                    </Form.Item>
                    <Form.Item name="height" label="Height">
                        <PrecisionInput precision={1} />
                    </Form.Item>
                    <Form.Item name="outside" valuePropName="checked" initialValue={false}>
                        <Checkbox>Outside</Checkbox>
                    </Form.Item>
                </>
            )
        case KC_ENVELOPE_CONSTRAINT_TYPE.KC_ENVELOPE_CONSTRAINT_SPHERE:
            return (
                <>
                    <HiddenFields constraintType={selectedConstraint} unionType="sphere" />
                    <CoordinateInput labelPrefix={"Center"} namePrefix={"center"} />
                    <Form.Item name="radius" label="Radius">
                        <PrecisionInput precision={1} />
                    </Form.Item>
                    <Form.Item name="outside" valuePropName="checked" initialValue={false}>
                        <Checkbox>Outside</Checkbox>
                    </Form.Item>
                </>
            )
        default:
            return null
    }
}

type MachineEnvelopeConstraintEditModalProps = {
    open: boolean
    item: EnvelopeConstraint
    onConfirm: (item: EnvelopeConstraint) => void
    onCancel: () => void
}

export const MachineEnvelopeConstraintEditModal = ({
    open,
    item,
    onConfirm,
    onCancel
}: MachineEnvelopeConstraintEditModalProps) => {
    const [form] = useForm()

    useEffect(() => {
        if (!open) {
            return
        }

        const { constraintType, ...rest } = item
        switch (constraintType) {
            case KC_ENVELOPE_CONSTRAINT_TYPE.KC_ENVELOPE_CONSTRAINT_PLANE:
                form.setFieldsValue({
                    constraintType,
                    unionType: "plane",
                    ...rest.plane
                })
                break
            case KC_ENVELOPE_CONSTRAINT_TYPE.KC_ENVELOPE_CONSTRAINT_BOX:
                form.setFieldsValue({
                    constraintType,
                    unionType: "box",
                    ...rest.box
                })
                break
            case KC_ENVELOPE_CONSTRAINT_TYPE.KC_ENVELOPE_CONSTRAINT_CYLINDER:
                form.setFieldsValue({
                    constraintType,
                    unionType: "cylinder",
                    ...rest.cylinder
                })
                break
            case KC_ENVELOPE_CONSTRAINT_TYPE.KC_ENVELOPE_CONSTRAINT_SPHERE:
                form.setFieldsValue({
                    constraintType,
                    unionType: "sphere",
                    ...rest.sphere
                })
                break
            default:
                break
        }
        form.setFieldsValue(item)
    }, [item, open, form])

    function confirm() {
        form.validateFields().then(values => {
            const { constraintType, unionType, ...rest } = values
            const constraint = {
                constraintType: constraintType,
                [unionType]: rest
            }
            onConfirm(constraint)
            form.resetFields()
        })
    }

    return (
        <Modal open={open} onCancel={onCancel} onOk={confirm}>
            <Form
                form={form}
                layout="vertical"
                // initialValues={item}
            >
                <FormFields selectedConstraint={item.constraintType} />
            </Form>
        </Modal>
    )
}
