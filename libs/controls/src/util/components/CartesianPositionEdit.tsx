/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { useState } from "react"
import { CartesianPosition, POSITIONREFERENCE, usePrefs } from "@glowbuzzer/store"
import styled from "styled-components"
import { Button, Checkbox, Input, InputNumber, Space } from "antd"
import { Euler, Quaternion } from "three"
import { FramesDropdown } from "@glowbuzzer/controls"

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
        padding: 8px 0 12px 0;
    }

    .actions {
        display: flex;
        gap: 10px;

        justify-content: space-between;
    }
`

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
    const [translation, setTranslation] = useState<CartesianPosition["translation"]>({
        ...value.translation
    })
    const { current, toSI, fromSI } = usePrefs()

    const [rotation, setRotation] = useState<Euler>(
        // hold as Euler
        new Euler().setFromQuaternion(
            new Quaternion(value.rotation.x, value.rotation.y, value.rotation.z, value.rotation.w)
        )
    )

    function handle_change(update: Partial<CartesianPosition>) {
        onChange?.(name, {
            positionReference,
            frameIndex,
            translation,
            rotation: new Quaternion().setFromEuler(rotation),
            ...update
        })
    }

    function update_translation(translation: CartesianPosition["translation"]) {
        setTranslation(translation)
        handle_change({ translation })
    }

    function update_rotation(rotation: Euler) {
        setRotation(rotation)
        handle_change({ rotation: new Quaternion().setFromEuler(rotation) })
    }

    function update_frame_index(frameIndex: number) {
        setFrameIndex(frameIndex)
        handle_change({ frameIndex })
    }

    function save() {
        const { x, y, z, w } = new Quaternion().setFromEuler(rotation)
        onSave(name, { positionReference, frameIndex, translation, rotation: { x, y, z, w } })
    }

    function toggle_relative() {
        const next =
            positionReference === POSITIONREFERENCE.ABSOLUTE
                ? POSITIONREFERENCE.RELATIVE
                : POSITIONREFERENCE.ABSOLUTE
        setPositionReference(next)
        handle_change({ positionReference: next })
    }

    return (
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
                        <InputNumber
                            value={translation[axis]}
                            size="small"
                            onChange={v => update_translation({ ...translation, [axis]: v })}
                        />
                    </div>
                ))}
                <div>{current.units_linear}</div>
                <div>Rotation</div>
                {["x", "y", "z"].map(axis => (
                    <div className="input" key={"r-" + axis}>
                        {axis.toUpperCase()}{" "}
                        <InputNumber
                            value={fromSI(rotation[axis], "angular")}
                            size="small"
                            onChange={v => {
                                const next = rotation.clone()
                                next[axis] = toSI(v, "angular")
                                update_rotation(next)
                            }}
                        />{" "}
                    </div>
                ))}
                <div>{current.units_angular}</div>
            </div>
            <div className="frame">
                <Checkbox
                    checked={positionReference === POSITIONREFERENCE.RELATIVE}
                    onChange={toggle_relative}
                >
                    Relative to frame
                </Checkbox>
                {positionReference === POSITIONREFERENCE.RELATIVE && (
                    <FramesDropdown value={frameIndex || 0} onChange={update_frame_index} />
                )}
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
    )
}
