/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import {
    EnvelopeConstraint,
    KC_ENVELOPE_CONSTRAINT_AXIS,
    KC_ENVELOPE_CONSTRAINT_TYPE
} from "@glowbuzzer/store"
import { List } from "antd"
import { ReactComponent as EditIcon } from "@material-symbols/svg-400/outlined/edit.svg"
import { ReactComponent as DeleteIcon } from "@material-symbols/svg-400/outlined/delete.svg"
import { GlowbuzzerIcon } from "../../util/GlowbuzzerIcon"
import { MachineEnvelopeConstraintEditModal } from "./MachineEnvelopeConstraintEditModal"

const ItemRender = ({ item }: { item: EnvelopeConstraint }) => {
    function to_array(obj: any) {
        return Object.values(obj).join(", ")
    }
    function to_axis(axis: KC_ENVELOPE_CONSTRAINT_AXIS) {
        return ["X", "Y", "Z"][axis]
    }

    switch (item.constraintType) {
        case KC_ENVELOPE_CONSTRAINT_TYPE.KC_ENVELOPE_CONSTRAINT_PLANE:
            return (
                <div>
                    Plane in {to_axis(item.plane.direction)}, offset {item.plane.position}{" "}
                    {item.plane.outside && " (outside)"}
                </div>
            )
        case KC_ENVELOPE_CONSTRAINT_TYPE.KC_ENVELOPE_CONSTRAINT_BOX:
            return (
                <div>
                    Box from {to_array(item.box.origin)} with extents {to_array(item.box.extents)}
                    {item.box.outside && " (outside)"}
                </div>
            )
        case KC_ENVELOPE_CONSTRAINT_TYPE.KC_ENVELOPE_CONSTRAINT_CYLINDER:
            return (
                <div>
                    Cylinder in {to_axis(item.cylinder.axis)}, center{" "}
                    {to_array(item.cylinder.center)} with radius {item.cylinder.radius} and height{" "}
                    {item.cylinder.height}
                    {item.cylinder.outside && " (outside)"}
                </div>
            )
        case KC_ENVELOPE_CONSTRAINT_TYPE.KC_ENVELOPE_CONSTRAINT_SPHERE:
            return (
                <div>
                    Sphere center {to_array(item.sphere.center)} with radius {item.sphere.radius}
                    {item.sphere.outside && " (outside)"}
                </div>
            )
        default:
            return <div>Unknown constraint</div>
    }
}

type MachineEnvelopeConstraintItemProps = {
    item: EnvelopeConstraint
    onDelete: () => void
    onChange: (item: EnvelopeConstraint) => void
}

export const MachineEnvelopeConstraintItem = ({
    item,
    onDelete,
    onChange
}: MachineEnvelopeConstraintItemProps) => {
    const [modalVisible, setModalVisible] = React.useState(false)

    const Actions = () => {
        return (
            <div>
                <GlowbuzzerIcon
                    useFill={true}
                    Icon={EditIcon}
                    button
                    onClick={() => setModalVisible(true)}
                />
                <GlowbuzzerIcon useFill={true} Icon={DeleteIcon} button onClick={onDelete} />
            </div>
        )
    }

    function confirm_edit(item: EnvelopeConstraint) {
        onChange(item)
        setModalVisible(false)
    }

    return (
        <List.Item>
            <ItemRender item={item} />
            <Actions />
            <MachineEnvelopeConstraintEditModal
                open={modalVisible}
                item={item}
                onConfirm={confirm_edit}
                onCancel={() => setModalVisible(false)}
            />
        </List.Item>
    )
}
