/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { Frame, useFrames, usePref, useSelectedFrame } from "@glowbuzzer/store"
import { TreeDataNode } from "antd"
import { Euler } from "three"
import { CartesianPositionTable } from "../util/components/CartesianPositionTable"

/**
 * The frames tile shows the hierarchy of configured frames in your application along with their translation and rotation.
 */
export const FramesTile = () => {
    const { asTree } = useFrames()
    const [selected, setSelected] = useSelectedFrame()
    const [precision] = usePref("positionPrecision", 2)

    function transform_frame(frames: Frame[]): TreeDataNode[] {
        if (!frames) {
            return
        }
        return frames.map(frame => {
            const translation = frame.relative.translation
            const rotation = frame.relative.rotation
            const euler = new Euler().setFromQuaternion(rotation)

            return {
                key: frame.index,
                name: frame.text,
                x: translation.x,
                y: translation.y,
                z: translation.z,
                qx: rotation.x,
                qy: rotation.y,
                qz: rotation.z,
                qw: rotation.w,
                a: euler.x,
                b: euler.y,
                c: euler.z,
                children: transform_frame(frame.children)
            }
        })
    }

    const treeData = transform_frame(asTree)

    return <CartesianPositionTable selected={selected} setSelected={setSelected} items={treeData} />
}
