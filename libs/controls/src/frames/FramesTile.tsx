/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { useState } from "react"
import {
    CartesianPosition,
    configSlice,
    Frame,
    FramesConfig,
    GlowbuzzerConfig,
    POSITIONREFERENCE,
    useFrames,
    useFramesList,
    useSelectedFrame,
    WithName
} from "@glowbuzzer/store"
import { TreeDataNode } from "antd"
import { Euler } from "three"
import { CartesianPositionTable } from "../util/components/CartesianPositionTable"
import { useConfigLiveEdit } from "../config"
import styled from "styled-components"
import { CssPointNameWithFrame } from "../util/styles/CssPointNameWithFrame"
import { useDispatch } from "react-redux"
import {
    CartesianPositionEditPanel,
    CartesianPositionEditPanelMode
} from "../util/components/CartesianPositionEditPanel"

const StyledDiv = styled.div`
    display: inline-block;

    ${CssPointNameWithFrame}
`

/**
 * The frames tile shows the hierarchy of configured frames in your application along with their translation and rotation.
 */
export const FramesTile = () => {
    // Note that `asList` is in tree order, whereas `frames` is in the order given in the config file (not necessarily the same)
    const { frames: editedFrames, setFrames, clearFrames } = useConfigLiveEdit()
    const { asTree } = useFrames(editedFrames)
    const frames = useFramesList()
    const [selected, setSelected] = useSelectedFrame()
    const [mode, setMode] = useState<CartesianPositionEditPanelMode>(
        CartesianPositionEditPanelMode.NONE
    )

    const dispatch = useDispatch()

    function store(frames: GlowbuzzerConfig["frames"]) {
        dispatch(configSlice.actions.addConfig({ frames }))
    }

    function make_tree(frames: Frame[]): TreeDataNode[] {
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
                children: frame.children?.length ? make_tree(frame.children) : undefined
            }
        })
    }

    function frame_to_cartesian_position(frameIndex: number): WithName<CartesianPosition> {
        const frame = editedFrames?.[frameIndex] || frames[frameIndex]
        if (!frame) {
            return null
        }
        return {
            ...frame,
            // shift from frame's parent index to position frame index
            frameIndex:
                frame.positionReference === POSITIONREFERENCE.ABSOLUTE
                    ? undefined
                    : frame.parentFrameIndex
        }
    }

    function update_frame({
        name,
        positionReference,
        frameIndex: parentFrameIndex,
        rotation,
        translation
    }: WithName<CartesianPosition>) {
        const frameIndex = mode === CartesianPositionEditPanelMode.CREATE ? frames.length : selected
        const modifiedFrame = {
            name,
            positionReference,
            parentFrameIndex,
            rotation,
            translation
        }

        // append or update list with modification
        const overrides: WithName<FramesConfig>[] =
            frameIndex >= frames.length
                ? [...frames, modifiedFrame]
                : frames.map((frame, index) => {
                      if (index === frameIndex) {
                          return modifiedFrame
                      }
                      return frame
                  })

        setFrames(overrides)
    }

    function save_frames() {
        store(editedFrames)
        clearFrames()
        setMode(CartesianPositionEditPanelMode.NONE)
    }

    function add_frame() {
        setMode(CartesianPositionEditPanelMode.CREATE)
    }

    function delete_frame() {
        const next = frames.filter((_, index) => index !== selected)
        store(next)
        setSelected(selected > 0 ? selected - 1 : 0)
    }

    const treeData = make_tree(asTree)

    return mode === CartesianPositionEditPanelMode.NONE ? (
        <CartesianPositionTable
            selected={selected}
            setSelected={setSelected}
            items={treeData}
            onEdit={() => setMode(CartesianPositionEditPanelMode.UPDATE)}
            onAdd={add_frame}
            onDelete={delete_frame}
        />
    ) : (
        <CartesianPositionEditPanel
            mode={mode}
            value={
                mode === CartesianPositionEditPanelMode.UPDATE
                    ? frame_to_cartesian_position(selected)
                    : null
            }
            onChange={update_frame}
            onSave={save_frames}
            onClose={() => setMode(CartesianPositionEditPanelMode.NONE)}
        />
    )
}
