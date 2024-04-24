/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { useState } from "react"
import {
    CartesianPosition,
    configSlice,
    FramesConfig,
    GlowbuzzerConfig,
    PointsConfig,
    POSITIONREFERENCE,
    useFramesList,
    usePointsList,
    useSelectedPoint,
    WithName
} from "@glowbuzzer/store"
import { ReactComponent as FramesIcon } from "@material-symbols/svg-400/outlined/account_tree.svg"
import { CssPointNameWithFrame } from "../util/styles/CssPointNameWithFrame"
import styled from "styled-components"
import { CartesianPositionTable } from "../util/components/CartesianPositionTable"
import { Euler, Quaternion } from "three"
import { useConfigLiveEdit } from "../config"
import { useDispatch } from "react-redux"
import {
    CartesianPositionEditPanel,
    CartesianPositionEditPanelMode
} from "../util/components/CartesianPositionEditPanel"

const StyledDiv = styled.div`
    ${CssPointNameWithFrame}
`

/**
 * The points tile shows a simple table of all configured points.
 */
export const PointsTile = () => {
    const { points: editedPoints, setPoints, clearPoints } = useConfigLiveEdit()
    const [selected, setSelected] = useSelectedPoint()
    const [mode, setMode] = useState<CartesianPositionEditPanelMode>(
        CartesianPositionEditPanelMode.NONE
    )

    function store(points: GlowbuzzerConfig["points"]) {
        dispatch(configSlice.actions.addConfig({ points }))
    }

    const points = usePointsList()
    const frames = useFramesList()
    const dispatch = useDispatch()

    const treeData = points?.map((point: WithName<PointsConfig>, index: number) => {
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
                            {frames[frameIndex] !== undefined && (
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
    })

    function update_point({
        name,
        positionReference,
        frameIndex: parentFrameIndex,
        rotation,
        translation
    }: WithName<CartesianPosition>) {
        const pointIndex = mode === CartesianPositionEditPanelMode.CREATE ? points.length : selected
        const modifiedPoint: WithName<PointsConfig> = {
            name,
            frameIndex:
                positionReference === POSITIONREFERENCE.ABSOLUTE ? undefined : parentFrameIndex,
            translation,
            rotation,
            configuration: 0
        }
        const overrides: WithName<FramesConfig>[] =
            pointIndex >= points.length
                ? [...points, modifiedPoint]
                : points.map((point, index) => {
                      if (index === pointIndex) {
                          return {
                              ...modifiedPoint,
                              configuration: point.configuration
                          }
                      }
                      return point
                  })
        setPoints(overrides)
    }

    function save_points() {
        store(editedPoints)
        clearPoints()
        setMode(CartesianPositionEditPanelMode.NONE)
    }

    function point_to_cartesian_position(pointIndex: number): CartesianPosition {
        const point = editedPoints?.[pointIndex] || points[pointIndex]
        if (!point) {
            return null
        }
        return {
            ...point,
            positionReference:
                point.frameIndex === undefined
                    ? POSITIONREFERENCE.ABSOLUTE
                    : POSITIONREFERENCE.RELATIVE
        }
    }

    function add_point() {
        setMode(CartesianPositionEditPanelMode.CREATE)
    }

    function delete_point() {
        const next: PointsConfig[] = points.filter((_, index) => index !== selected)
        store(next)
        setSelected(selected > 0 ? selected - 1 : 0)
    }

    function cancel_edit() {
        clearPoints()
        setMode(CartesianPositionEditPanelMode.NONE)
    }

    return mode === CartesianPositionEditPanelMode.NONE ? (
        <CartesianPositionTable
            selected={selected}
            setSelected={setSelected}
            items={treeData}
            onEdit={() => setMode(CartesianPositionEditPanelMode.UPDATE)}
            onAdd={add_point}
            onDelete={delete_point}
        />
    ) : (
        <CartesianPositionEditPanel
            value={
                mode === CartesianPositionEditPanelMode.UPDATE
                    ? point_to_cartesian_position(selected)
                    : null
            }
            mode={mode}
            onSave={save_points}
            onChange={update_point}
            onClose={cancel_edit}
        />
    )
}
