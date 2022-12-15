/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { useState } from "react"
import {
    CartesianPosition,
    FramesConfig,
    PointsConfig,
    POSITIONREFERENCE,
    Quat,
    useConfigLoader,
    useFramesList,
    usePoints,
    useSelectedPoint,
    Vector3
} from "@glowbuzzer/store"
import { ReactComponent as FramesIcon } from "@material-symbols/svg-400/outlined/account_tree.svg"
import { CssPointNameWithFrame } from "../util/styles/CssPointNameWithFrame"
import styled from "styled-components"
import { CartesianPositionTable } from "../util/components/CartesianPositionTable"
import { Euler, Quaternion } from "three"
import { message } from "antd"
import { CartesianPositionEdit } from "../util/components/CartesianPositionEdit"
import { useConfigLiveEdit } from "../config/ConfigLiveEditProvider"

const StyledDiv = styled.div`
    ${CssPointNameWithFrame}
`

/**
 * The points tile shows a simple table of all configured points.
 */
export const PointsTile = () => {
    const { points: editedPoints, setPoints, clearPoints } = useConfigLiveEdit()
    const [selected, setSelected] = useSelectedPoint()
    const [editMode, setEditMode] = useState(false)

    const points = usePoints(editedPoints)
    const frames = useFramesList()
    const loader = useConfigLoader()

    function transform_point(point: PointsConfig, index: number) {
        {
            const { name, frameIndex, translation, rotation } = point
            const { x, y, z } = translation ?? { x: 0, y: 0, z: 0 }
            const { w, x: qx, y: qy, z: qz } = rotation ?? { x: 0, y: 0, z: 0, w: 1 }
            const q = new Quaternion(qx, qy, qz, w)
            const euler = new Euler().setFromQuaternion(q)

            return {
                key: index,
                name: (
                    <StyledDiv>
                        <div className="point-name">
                            <div className="name">{name}</div>
                            {frames[frameIndex] && (
                                <div className="frame">
                                    <FramesIcon
                                        width={13}
                                        height={13}
                                        viewBox="0 0 48 48"
                                        transform="translate(0,2)"
                                    />{" "}
                                    {frames[frameIndex].name}
                                </div>
                            )}
                        </div>
                    </StyledDiv>
                ),
                x: x,
                y: y,
                z: z,
                qx: qx,
                qy: qy,
                qz: qz,
                qw: w,
                a: euler.x,
                b: euler.y,
                c: euler.z
            }
        }
    }

    const items = points?.map(transform_point)

    function points_with_modification(
        name: string,
        positionReference: POSITIONREFERENCE,
        frameIndex: number,
        translation: Vector3,
        rotation: Quat
    ) {
        return points.map((point, index) => {
            if (index === selected) {
                return {
                    name,
                    frameIndex:
                        positionReference === POSITIONREFERENCE.ABSOLUTE ? undefined : frameIndex,
                    translation,
                    rotation,
                    configuration: point.configuration
                }
            }
            return point
        })
    }

    function update_point(
        name: string,
        {
            positionReference,
            frameIndex: parentFrameIndex,
            rotation,
            translation
        }: CartesianPosition
    ) {
        const overrides: FramesConfig[] = points_with_modification(
            name,
            positionReference,
            parentFrameIndex,
            translation,
            rotation
        )
        setPoints(overrides)
    }

    function save_points(
        name: string,
        { positionReference, frameIndex, rotation, translation }: CartesianPosition
    ) {
        const next: PointsConfig[] = points_with_modification(
            name,
            positionReference,
            frameIndex,
            translation,
            rotation
        )
        loader({
            points: next
        }).then(() => {
            clearPoints()
            setEditMode(false)
            return message.success("Points updated")
        })
    }

    function point_to_cartesian_position(point: PointsConfig): CartesianPosition {
        const { frameIndex, translation, rotation } = point
        return {
            positionReference:
                frameIndex === undefined ? POSITIONREFERENCE.ABSOLUTE : POSITIONREFERENCE.RELATIVE,
            frameIndex,
            translation,
            rotation
        }
    }

    function add_point() {
        const next: PointsConfig[] = [
            ...points,
            {
                name: "New Point",
                frameIndex: undefined,
                translation: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0, w: 1 },
                configuration: 0
            }
        ]
        loader({
            points: next
        }).then(() => {
            setSelected(next.length - 1)
            setEditMode(true)
        })
    }

    function delete_point() {
        const next: PointsConfig[] = points.filter((_, index) => index !== selected)
        loader({
            points: next
        }).then(() => {
            setSelected(selected > 0 ? selected - 1 : 0)
        })
    }

    function cancel_edit() {
        clearPoints()
        setEditMode(false)
    }

    return editMode ? (
        <CartesianPositionEdit
            name={points[selected].name}
            value={point_to_cartesian_position(points[selected])}
            onSave={save_points}
            onChange={update_point}
            onCancel={cancel_edit}
        />
    ) : (
        <CartesianPositionTable
            selected={selected}
            setSelected={setSelected}
            items={items}
            onEdit={() => setEditMode(true)}
            onAdd={add_point}
            onDelete={delete_point}
        />
    )
}
