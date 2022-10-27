/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { useLocalStorage } from "../util/LocalStorageHook"
import { PointsConfig, useFramesList, usePoints } from "@glowbuzzer/store"
import { PrecisionToolbarButtonGroup } from "../util/components/PrecisionToolbarButtonGroup"
import { DockToolbar } from "../dock/DockToolbar"
import { StyledTable } from "../util/styles/StyledTable"
import { ReactComponent as FramesIcon } from "@material-symbols/svg-400/outlined/account_tree.svg"
import { CssPointNameWithFrame } from "../util/styles/CssPointNameWithFrame"
import styled from "styled-components"
import { DockTileWithToolbar } from "../dock/DockTileWithToolbar"

const StyledDiv = styled.div`
    ${CssPointNameWithFrame}
`

export const PointsTile = () => {
    const [precision, setPrecision] = useLocalStorage("frames.precision", 2)
    const points = usePoints()
    const frames = useFramesList()

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            ellipsis: true,
            width: "30%"
        },
        ...["x", "y", "z"].map(key => ({
            key: key,
            title: key.toUpperCase(),
            ellipsis: true,
            dataIndex: key,
            align: "right" as "right"
        })),
        ...["x", "y", "z", "w"].map(key => ({
            key: "q" + key,
            title: "q" + key.toUpperCase(),
            ellipsis: true,
            dataIndex: "q" + key,
            align: "right" as "right"
        }))
    ]

    function transform_point(point: PointsConfig, index: number) {
        {
            const { name, frameIndex, translation, rotation } = point
            const { x, y, z } = translation ?? { x: 0, y: 0, z: 0 }
            const { w, x: qx, y: qy, z: qz } = rotation ?? { x: 0, y: 0, z: 0, w: 1 }

            return {
                key: index.toString(),
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
                x: x.toFixed(precision),
                y: y.toFixed(precision),
                z: z.toFixed(precision),
                qx: qx.toFixed(precision),
                qy: qy.toFixed(precision),
                qz: qz.toFixed(precision),
                qw: w.toFixed(precision)
            }
        }
    }

    const tableData = points?.map(transform_point)

    return (
        <DockTileWithToolbar
            toolbar={<PrecisionToolbarButtonGroup value={precision} onChange={setPrecision} />}
        >
            <StyledDiv>
                <StyledTable
                    columns={columns}
                    dataSource={tableData}
                    pagination={false}
                    size="small"
                />
            </StyledDiv>
        </DockTileWithToolbar>
    )
}
