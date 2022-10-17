/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { useLocalStorage } from "../util/LocalStorageHook"
import { PointsConfig, usePoints } from "@glowbuzzer/store"
import { PrecisionToolbarButtonGroup } from "../util/components/PrecisionToolbarButtonGroup"
import { DockToolbar } from "../dock/DockToolbar"
import { StyledTable } from "../util/styles/StyledTable"

export const PointsTile = () => {
    const [precision, setPrecision] = useLocalStorage("frames.precision", 2)
    const points = usePoints()

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
            const { name, translation, rotation } = point
            const { x, y, z } = translation ?? { x: 0, y: 0, z: 0 }
            const { w, x: qx, y: qy, z: qz } = rotation ?? { x: 0, y: 0, z: 0, w: 1 }

            return {
                key: index.toString(),
                name: name,
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
        <>
            <DockToolbar>
                <PrecisionToolbarButtonGroup value={precision} onChange={setPrecision} />
            </DockToolbar>
            <StyledTable columns={columns} dataSource={tableData} pagination={false} size="small" />
        </>
    )
}
