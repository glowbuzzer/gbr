/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { useState } from "react"
import {
    CartesianPosition,
    Frame,
    FramesConfig,
    PointsConfig,
    POSITIONREFERENCE,
    Quat,
    useConfigLoader,
    useFrames,
    useFramesList,
    useSelectedFrame,
    Vector3
} from "@glowbuzzer/store"
import { message, TreeDataNode } from "antd"
import { Euler } from "three"
import { CartesianPositionTable } from "../util/components/CartesianPositionTable"
import { CartesianPositionEdit } from "../util/components/CartesianPositionEdit"
import { useConfigLiveEdit } from "../config/ConfigLiveEditProvider"
import styled from "styled-components"
import { CssPointNameWithFrame } from "../util/styles/CssPointNameWithFrame"

const StyledDiv = styled.div`
    ${CssPointNameWithFrame}
`

/**
 * The frames tile shows the hierarchy of configured frames in your application along with their translation and rotation.
 */
export const FramesTile = () => {
    // Note that `asList` is in tree order, whereas `frames` is in the order given in the config file (not necessarily the same)
    const { frames: editedFrames, setFrames, clearFrames } = useConfigLiveEdit()
    const { asTree, asList } = useFrames(editedFrames)
    const frames = useFramesList(editedFrames)
    const [selected, setSelected] = useSelectedFrame()
    const [editMode, setEditMode] = useState(false)

    const loader = useConfigLoader()

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
                name: (
                    <StyledDiv>
                        <div className="frame-name">
                            <div className="name">{frame.name}</div>
                            {frame.workspaceOffset > 0 && (
                                <div className="gcode">G{frame.workspaceOffset + 53}</div>
                            )}
                        </div>
                    </StyledDiv>
                ),
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
                children: frame.children?.length ? transform_frame(frame.children) : undefined
            }
        })
    }

    function frame_to_cartesian_position(frameIndex: number): CartesianPosition {
        const frame = frames[frameIndex]
        return {
            positionReference: frame.positionReference,
            frameIndex:
                frame.positionReference === POSITIONREFERENCE.ABSOLUTE
                    ? undefined
                    : frame.parentFrameIndex,
            translation: frame.translation,
            rotation: frame.rotation
        }
    }

    function frames_with_modification(
        frameIndex: number,
        name: string,
        positionReference: POSITIONREFERENCE,
        parentFrameIndex: number,
        translation: Vector3,
        rotation: Quat
    ) {
        return frames.map((frame, index) => {
            if (index === frameIndex) {
                return {
                    name,
                    positionReference,
                    parentFrameIndex,
                    translation,
                    rotation
                } as FramesConfig
            }
            return frame
        })
    }

    function update_frame(
        name: string,
        {
            positionReference,
            frameIndex: parentFrameIndex,
            rotation,
            translation
        }: CartesianPosition
    ) {
        const frameIndex = asList[selected].index
        const overrides: FramesConfig[] = frames_with_modification(
            frameIndex,
            name,
            positionReference,
            parentFrameIndex,
            translation,
            rotation
        )
        setFrames(overrides)
    }

    function save_frames(
        name: string,
        {
            positionReference,
            frameIndex: parentFrameIndex,
            rotation,
            translation
        }: CartesianPosition
    ) {
        const frameIndex = asList[selected].index
        const next: FramesConfig[] = frames_with_modification(
            frameIndex,
            name,
            positionReference,
            parentFrameIndex,
            translation,
            rotation
        )
        loader({
            frames: next
        }).then(() => {
            clearFrames()
            setEditMode(false)
            return message.success("Frames updated")
        })
    }

    function add_frame() {
        const next: FramesConfig[] = [
            ...frames,
            {
                name: "New Frame",
                translation: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0, w: 1 },
                positionReference: POSITIONREFERENCE.ABSOLUTE
            }
        ]
        loader({
            frames: next
        }).then(() => {
            setSelected(next.length - 1)
            setEditMode(true)
        })
    }

    function delete_frame() {
        const frameIndex = asList[selected].index
        const next: PointsConfig[] = frames.filter((_, index) => index !== frameIndex)
        loader({
            frames: next
        }).then(() => {
            setSelected(selected > 0 ? selected - 1 : 0)
        })
    }

    function cancel_edit() {
        clearFrames()
        setEditMode(false)
    }

    const treeData = transform_frame(asTree)

    return editMode ? (
        <CartesianPositionEdit
            name={asList[selected].name}
            value={frame_to_cartesian_position(asList[selected].index)}
            onSave={save_frames}
            onChange={update_frame}
            onCancel={cancel_edit}
        />
    ) : (
        <CartesianPositionTable
            selected={selected}
            setSelected={setSelected}
            items={treeData}
            onEdit={() => setEditMode(true)}
            onAdd={add_frame}
            onDelete={delete_frame}
        />
    )
}
