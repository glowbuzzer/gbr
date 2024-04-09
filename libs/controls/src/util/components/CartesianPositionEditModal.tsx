/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { ChangeEvent, useEffect, useState } from "react"
import { Button, Checkbox, Input, Space } from "antd"
import {
    CartesianPosition,
    POSITIONREFERENCE,
    Quat,
    useKinematicsConfigurationList,
    useKinematicsConfigurationPositions,
    usePrefs,
    Vector3,
    WithName
} from "@glowbuzzer/store"
import { Euler, Quaternion } from "three"
import styled from "styled-components"
import { PrecisionInput } from "./PrecisionInput"
import { KinematicsDropdown } from "../../kinematics/KinematicsDropdown"
import { FramesDropdown } from "../../frames"

const StyledDiv = styled.div`
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .grid {
        display: grid;
        width: 100%;
        grid-template-columns: 1fr 2fr 2fr 2fr 1fr;
        gap: 8px;
        align-items: center;

        .input {
            text-align: right;
        }
    }

    .frame {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;
    }

    .actions {
        display: flex;
        justify-content: right;
    }
`

export enum CartesianPositionEditModalMode {
    NONE,
    CREATE,
    UPDATE
}

const DEFAULT_VALUE: WithName<CartesianPosition> = {
    name: "",
    positionReference: POSITIONREFERENCE.ABSOLUTE,
    translation: {
        x: 0,
        y: 0,
        z: 0
    },
    rotation: {
        x: 0,
        y: 0,
        z: 0,
        w: 1
    }
}

function to_euler(q: Quat): Euler {
    const { x, y, z, w } = q
    const quaternion = new Quaternion(x, y, z, w)
    return new Euler().setFromQuaternion(quaternion)
}

type CartesianPositionEditModalProps = {
    mode: CartesianPositionEditModalMode
    value?: WithName<CartesianPosition>
    onChange: (position: WithName<CartesianPosition>) => void
    onSave: () => void
    onClose: () => void
}

export const CartesianPositionEditModal = ({
    mode,
    value: value_or_null,
    onChange,
    onSave,
    onClose
}: CartesianPositionEditModalProps) => {
    const value = value_or_null || DEFAULT_VALUE
    // const [position, setPosition] = React.useState(value)
    const [name, setName] = useState(value.name)
    const [positionReference, setPositionReference] = useState<POSITIONREFERENCE>(
        value.positionReference
    )
    const [frameIndex, setFrameIndex] = useState<number>(value?.frameIndex)
    const [translation, setTranslation] = useState<Vector3>(value.translation)
    const [rotation, setRotation] = useState<Quat>(value.rotation)
    const [rotationEuler, setRotationEuler] = useState<Euler>(to_euler(value.rotation))

    const { toSI, fromSI, getUnits } = usePrefs()
    const { units: linearUnits, precision: linearPrecision } = getUnits("linear")
    const { units: angularUnits, precision: angularPrecision } = getUnits("angular")

    const positions = useKinematicsConfigurationPositions()
    const kinematicsConfigurations = useKinematicsConfigurationList()

    useEffect(() => {
        const update = value || DEFAULT_VALUE
        // setPosition(update)
        setName(update.name)
    }, [value, mode])

    function handle_change(update: Partial<WithName<CartesianPosition>>) {
        onChange({
            name,
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

    function toggle_relative() {
        const nextPositionReference =
            positionReference === POSITIONREFERENCE.RELATIVE
                ? POSITIONREFERENCE.ABSOLUTE
                : POSITIONREFERENCE.RELATIVE
        const update = {
            positionReference: nextPositionReference,
            frameIndex:
                nextPositionReference === POSITIONREFERENCE.RELATIVE
                    ? /* will be relative */ frameIndex || 0
                    : undefined
        }
        setPositionReference(nextPositionReference)
        setFrameIndex(update.frameIndex)
        handle_change(update)
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

    if (mode === CartesianPositionEditModalMode.NONE) {
        return null
    }

    function update_name(e: ChangeEvent<HTMLInputElement>) {
        const name = e.target.value
        handle_change({ name })
        setName(name)
    }

    return (
        <StyledDiv>
            <Input value={name} placeholder="Enter name" onChange={update_name} />
            <div className="grid">
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
                            precision={linearPrecision}
                        />
                    </div>
                ))}
                <div>{linearUnits}</div>
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
                            precision={angularPrecision}
                        />
                    </div>
                ))}
                <div>{angularUnits}</div>
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
                        <FramesDropdown value={frameIndex || 0} onChange={update_frame_index} />
                    )}
                </Space>
                {kinematicsConfigurations.length < 2 ? (
                    <Button size="small" onClick={() => update_from_kc(0)}>
                        Set from current position
                    </Button>
                ) : (
                    <KinematicsDropdown
                        value={null}
                        placeholder="Set from current position"
                        onChange={update_from_kc}
                    />
                )}
            </div>
            <Space className="actions">
                <Button onClick={onClose}>Cancel</Button>
                <Button type="primary" onClick={onSave} disabled={!name?.length}>
                    {mode === CartesianPositionEditModalMode.CREATE ? "Create" : "Save"}
                </Button>
            </Space>
        </StyledDiv>
    )
}
