/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { Frame, useFrames } from "@glowbuzzer/store"
import { TreeDataNode } from "antd"
import { DownOutlined, RightOutlined } from "@ant-design/icons"
import { PrecisionToolbarButtonGroup } from "../util/components/PrecisionToolbarButtonGroup"
import { useLocalStorage } from "../util/LocalStorageHook"
import { StyledTable } from "../util/styles/StyledTable"
import { DockTileWithToolbar } from "../dock/DockTileWithToolbar"

/**
 * The frames tile shows the hierarchy of configured frames in your application along with their translation and rotation.
 */
export const FramesTile = () => {
    const [precision, setPrecision] = useLocalStorage("frames.precision", 2)
    const { asTree } = useFrames()

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

    function transform_frame(frames: Frame[]): TreeDataNode[] {
        if (!frames) {
            return
        }
        return frames.map(frame => {
            const translation = frame.relative.translation
            const rotation = frame.relative.rotation

            return {
                key: frame.index.toString(),
                name: frame.text,
                x: translation.x.toFixed(precision),
                y: translation.y.toFixed(precision),
                z: translation.z.toFixed(precision),
                qx: rotation.x.toFixed(precision),
                qy: rotation.y.toFixed(precision),
                qz: rotation.z.toFixed(precision),
                qw: rotation.w.toFixed(precision),
                children: transform_frame(frame.children)
            }
        })
    }

    const treeData = transform_frame(asTree)

    const expand_icon = ({ expanded, onExpand, record }) => {
        if ((record as any).children) {
            return expanded ? (
                <DownOutlined className="toggle-icon" onClick={e => onExpand(record, e)} />
            ) : (
                <RightOutlined className="toggle-icon" onClick={e => onExpand(record, e)} />
            )
        } else {
            // placeholder to keep the alignment
            return <RightOutlined className="toggle-icon hidden" />
        }
    }

    return (
        <DockTileWithToolbar
            toolbar={<PrecisionToolbarButtonGroup value={precision} onChange={setPrecision} />}
        >
            <StyledTable
                dataSource={treeData}
                columns={columns}
                size={"small"}
                pagination={false}
                expandable={{
                    // expandedRowRender: record => <p style={{ margin: 0 }}>{record.name}</p>,
                    expandIcon: expand_icon
                }}
            />
        </DockTileWithToolbar>
    )
}
