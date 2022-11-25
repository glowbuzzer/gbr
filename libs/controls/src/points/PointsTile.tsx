/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { useState } from "react"
import { PointsConfig, useFramesList, usePoints } from "@glowbuzzer/store"
import { PrecisionToolbarButtonGroup } from "../util/components/PrecisionToolbarButtonGroup"
import { StyledTable } from "../util/styles/StyledTable"
import { ReactComponent as FramesIcon } from "@material-symbols/svg-400/outlined/account_tree.svg"
import { CssPointNameWithFrame } from "../util/styles/CssPointNameWithFrame"
import styled from "styled-components"
import { DockTileWithToolbar } from "../dock/DockTileWithToolbar"
import { CartesianPositionTable } from "../util/components/CartesianPositionTable"
import { Euler, Quaternion } from "three"

const StyledDiv = styled.div`
    ${CssPointNameWithFrame}
`

/**
 * The points tile shows a simple table of all configured points.
 */
export const PointsTile = () => {
    const [selected, setSelected] = useState(0)

    const points = usePoints()
    const frames = useFramesList()

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

    return <CartesianPositionTable selected={selected} setSelected={setSelected} items={items} />
}
