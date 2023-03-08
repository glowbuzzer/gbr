/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { useEffect, useState } from "react"
import {
    CartesianPosition,
    POSITIONREFERENCE,
    Quat,
    useKinematicsCartesianPosition,
    useKinematicsConfigurationList,
    useKinematicsConfigurationPositions,
    usePref,
    usePrefs
} from "@glowbuzzer/store"
import styled from "styled-components"
import { Button, Checkbox, Input, Space } from "antd"
import { Euler, Quaternion } from "three"
import { StyledTileContent } from "../styles/StyledTileContent"
import { PrecisionToolbarButtonGroup } from "./PrecisionToolbarButtonGroup"
import { DockTileWithToolbar } from "../../dock/DockTileWithToolbar"
import { PrecisionInput } from "./PrecisionInput"
import { FramesDropdown } from "../../frames"
import { KinematicsDropdown } from "../../kinematics/KinematicsDropdown"

const StyledDiv = styled.div`
    .grid {
        display: grid;
        width: 100%;
        grid-template-columns: 1fr 2fr 2fr 2fr 1fr;
        gap: 8px;
        margin-bottom: 8px;

        .input {
            text-align: right;
        }
    }

    .frame {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0 12px 0;
    }

    .actions {
        display: flex;
        gap: 10px;

        justify-content: space-between;
    }
`

function to_euler(q: Quat): Euler {
    const { x, y, z, w } = q
    const quaternion = new Quaternion(x, y, z, w)
    return new Euler().setFromQuaternion(quaternion)
}

type CartesianPositionEditProps = {
    name: string

    /** The current position */
    value: CartesianPosition

    /** The position changed callback */
    onSave(name: string, position: CartesianPosition): void

    onChange?(name: string, position: CartesianPosition): void

    onCancel(): void
}

export const CartesianPositionEdit = ({
    name: currentName,
    value,
    onChange,
    onSave,
    onCancel
}: CartesianPositionEditProps) => {
    const [name, setName] = useState(currentName)
    const [positionReference, setPositionReference] = useState<
        CartesianPosition["positionReference"]
    >(value.positionReference)
    const [frameIndex, setFrameIndex] = useState<CartesianPosition["frameIndex"]>(value.frameIndex)
    const [translation, setTranslation] = useState<CartesianPosition["translation"]>(
        value.translation
    )
    const [rotation, setRotation] = useState<CartesianPosition["rotation"]>(value.rotation)
    const [rotationEuler, setRotationEuler] = useState<Euler>(to_euler(value.rotation))

    const { current, toSI, fromSI } = usePrefs()
    const [precision, setPrecision] = usePref<number>("positionPrecision", 2)

    const positions = useKinematicsConfigurationPositions()
    const kinematicsConfigurations = useKinematicsConfigurationList()

    useEffect(() => {
        setRotationEuler(to_euler(value.rotation))
    }, [value.rotation])

    function handle_change(update: Partial<CartesianPosition>) {
        onChange?.(name, {
            positionReference,
            frameIndex,
            translation,
            rotation,
            ...update
        })
    }

    function update_translation(translation: CartesianPosition["translation"]) {
        setTranslation(translation)
        handle_change({ translation })
    }

    function update_rotation(rotation: Euler) {
        // we don't want the full three.js quaternion here, just the x,y,z,w values
        const { x, y, z, w } = new Quaternion().setFromEuler(rotation)
        const next = { x, y, z, w }
        setRotation(next)
        setRotationEuler(rotation)
        handle_change({ rotation: next })
    }

    function update_frame_index(frameIndex: number) {
        setFrameIndex(frameIndex)
        handle_change({ frameIndex })
    }

    function update_from_kc(kinematicsConfigurationIndex: number) {
        const position = positions[kinematicsConfigurationIndex]
        if (position) {
            setTranslation(position.translation)
            setRotation(position.rotation)
            const frameIndex = kinematicsConfigurations[kinematicsConfigurationIndex].frameIndex
            setFrameIndex(frameIndex)
            setPositionReference(POSITIONREFERENCE.RELATIVE)
            handle_change({
                translation: position.translation,
                rotation: position.rotation,
                frameIndex,
                positionReference: POSITIONREFERENCE.RELATIVE
            })
        }
    }

    function save() {
        onSave(name, { positionReference, frameIndex, translation, rotation })
    }

    function toggle_relative() {
        const update = {
            positionReference:
                positionReference === POSITIONREFERENCE.RELATIVE
                    ? POSITIONREFERENCE.ABSOLUTE
                    : POSITIONREFERENCE.RELATIVE,
            frameIndex:
                positionReference === POSITIONREFERENCE.ABSOLUTE
                    ? /* will be relative */ frameIndex || 0
                    : undefined
        }
        setPositionReference(update.positionReference)
        setFrameIndex(update.frameIndex)
        handle_change(update)
    }

    return (
        <DockTileWithToolbar
            toolbar={<PrecisionToolbarButtonGroup value={precision} onChange={setPrecision} />}
        >
            <StyledTileContent>
                <StyledDiv>
                    <div className="grid">
                        <div>Name</div>
                        <div>
                            <Input value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div />
                        <div />
                        <div />

                        <div>Translation</div>
                        {["x", "y", "z"].map(axis => (
                            <div className="input" key={"t-" + axis}>
                                {axis.toUpperCase()}{" "}
                                <PrecisionInput
                                    value={fromSI(translation[axis], "linear")}
                                    onChange={v =>
                                        update_translation({
                                            ...translation,
                                            [axis]: toSI(v, "linear")
                                        })
                                    }
                                    precision={precision}
                                />
                            </div>
                        ))}
                        <div>{current.units_linear}</div>
                        <div>Rotation</div>
                        {["x", "y", "z"].map(axis => (
                            <div className="input" key={"r-" + axis}>
                                {axis.toUpperCase()}{" "}
                                <PrecisionInput
                                    value={fromSI(rotationEuler[axis], "angular")}
                                    onChange={v => {
                                        const next = rotationEuler.clone()
                                        next[axis] = toSI(v, "angular")
                                        update_rotation(next)
                                    }}
                                    precision={precision}
                                />
                            </div>
                        ))}
                        <div>{current.units_angular}</div>
                    </div>
                    <div className="frame">
                        <Space>
                            <Checkbox
                                checked={positionReference === POSITIONREFERENCE.RELATIVE}
                                onChange={toggle_relative}
                            >
                                Relative to frame
                            </Checkbox>
                            {positionReference === POSITIONREFERENCE.RELATIVE && (
                                <FramesDropdown
                                    value={frameIndex || 0}
                                    onChange={update_frame_index}
                                />
                            )}
                        </Space>
                        <KinematicsDropdown
                            value={null}
                            placeholder="Set from current position"
                            onChange={update_from_kc}
                        />
                    </div>
                    <div className="actions">
                        <Space>
                            <Button type="primary" onClick={save}>
                                Save
                            </Button>
                            <Button onClick={onCancel}>Cancel</Button>
                        </Space>
                    </div>
                </StyledDiv>
            </StyledTileContent>
        </DockTileWithToolbar>
    )
}
