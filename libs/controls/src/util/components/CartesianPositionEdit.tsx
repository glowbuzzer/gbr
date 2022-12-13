/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { useEffect, useState } from "react"
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

    onCancel(): void
}

export const CartesianPositionEdit = ({
    name: currentName,
    value,
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
    const [rotation, setRotation] = useState<Euler>(
        // hold as Euler
        new Euler().setFromQuaternion(
            new Quaternion(value.rotation.x, value.rotation.y, value.rotation.z, value.rotation.w)
        )
    )

    const { current } = usePrefs()

    useEffect(() => {
        setName(currentName)
        setTranslation({ ...value.translation })
        setRotation(
            new Euler().setFromQuaternion(
                new Quaternion(
                    value.rotation.x,
                    value.rotation.y,
                    value.rotation.z,
                    value.rotation.w
                )
            )
        )
        setFrameIndex(value.frameIndex)
        setPositionReference(value.positionReference)
    }, [currentName, value])

    function save() {
        const { x, y, z, w } = new Quaternion().setFromEuler(rotation)
        onSave(name, { positionReference, frameIndex, translation, rotation: { x, y, z, w } })
    }

    function toggle_relative() {
        setPositionReference(
            positionReference === POSITIONREFERENCE.ABSOLUTE
                ? POSITIONREFERENCE.RELATIVE
                : POSITIONREFERENCE.ABSOLUTE
        )
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
                            onChange={v =>
                                setTranslation(current => ({
                                    ...current,
                                    [axis]: v
                                }))
                            }
                        />
                    </div>
                ))}
                <div>{current.units_linear}</div>
                <div>Rotation</div>
                {["x", "y", "z"].map(axis => (
                    <div className="input" key={"r-" + axis}>
                        {axis.toUpperCase()}{" "}
                        <InputNumber
                            value={rotation[axis]}
                            size="small"
                            onChange={v =>
                                setRotation(current => {
                                    const next = current.clone()
                                    next[axis] = v
                                    return next
                                })
                            }
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
                    <FramesDropdown value={frameIndex || 0} onChange={setFrameIndex} />
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
