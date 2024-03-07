/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { PrecisionInput } from "../../../util/components/PrecisionInput"
import { CartesianPosition, POSITIONREFERENCE, Quat, usePrefs } from "@glowbuzzer/store"
import { Euler, Quaternion } from "three"
import { Button, Flex, Radio, RadioChangeEvent, Space } from "antd"
import { EditOutlined } from "@ant-design/icons"
import styled from "styled-components"
import { StyledParametersGrid } from "../../styles"

function to_euler(q: Quat): Euler {
    const { x, y, z, w } = q
    const quaternion = new Quaternion(x, y, z, w)
    return new Euler().setFromQuaternion(quaternion)
}

function from_euler(e: Euler): Quat {
    const { x, y, z, w } = new Quaternion().setFromEuler(e)
    return { x, y, z, w }
}

type FlowEditCartesianPositionProps = {
    value: CartesianPosition
    onChange: (value: CartesianPosition) => void
    precision?: number
}

const StyledEditButton = styled(EditOutlined)`
    color: ${props => props.theme.colorTextSecondary};
    min-width: 88px;
`

export const FlowEditCartesianPosition = ({
    value,
    onChange,
    precision = 3
}: FlowEditCartesianPositionProps) => {
    const { current, toSI, fromSI } = usePrefs()

    function update(change: Partial<CartesianPosition>) {
        onChange({
            ...value,
            ...change
        })
    }

    const { translation, rotation, positionReference } = value
    const euler = rotation ? to_euler(value.rotation) : new Euler()

    function update_position_reference(e: RadioChangeEvent) {
        onChange({
            ...value,
            positionReference: e.target.value
        })
    }

    return (
        <Flex vertical gap="small">
            <StyledParametersGrid>
                <div>Translation</div>
                {["x", "y", "z"].map(axis => (
                    <div className="input" key={"t-" + axis}>
                        <Space>
                            {axis.toUpperCase()}
                            {typeof translation?.[axis] === "number" ? (
                                <PrecisionInput
                                    value={fromSI(translation[axis] || 0, "linear")}
                                    onChange={v =>
                                        update({
                                            translation: {
                                                ...translation,
                                                [axis]: toSI(v, "linear")
                                            }
                                        })
                                    }
                                    precision={precision}
                                />
                            ) : (
                                <StyledEditButton
                                    onClick={() =>
                                        update({
                                            translation: {
                                                x: null,
                                                y: null,
                                                z: null,
                                                ...(translation || {}),
                                                [axis]: 0.0
                                            }
                                        })
                                    }
                                />
                            )}
                        </Space>
                    </div>
                ))}
                <div>{current.units_linear}</div>
                {translation ? (
                    <div>
                        <Button
                            size="small"
                            onClick={() =>
                                update({
                                    translation: undefined
                                })
                            }
                        >
                            Clear
                        </Button>
                    </div>
                ) : (
                    <div></div>
                )}

                <div>Rotation</div>
                {["x", "y", "z"].map(axis => (
                    <div className="input" key={"r-" + axis}>
                        <Space>
                            {axis.toUpperCase()}
                            {typeof rotation?.[axis] === "number" ? (
                                <PrecisionInput
                                    value={fromSI(euler[axis], "angular")}
                                    onChange={v => {
                                        const next = euler.clone()
                                        next[axis] = toSI(v, "angular")
                                        update({
                                            rotation: from_euler(next)
                                        })
                                    }}
                                    precision={precision}
                                />
                            ) : (
                                <StyledEditButton
                                    onClick={() =>
                                        update({
                                            rotation: {
                                                x: 0,
                                                y: 0,
                                                z: 0,
                                                w: 1
                                            }
                                        })
                                    }
                                />
                            )}
                        </Space>
                    </div>
                ))}
                <div>{current.units_angular}</div>
                {rotation ? (
                    <div>
                        <Button
                            size="small"
                            onClick={() =>
                                update({
                                    rotation: undefined
                                })
                            }
                        >
                            Clear
                        </Button>
                    </div>
                ) : (
                    <div></div>
                )}
            </StyledParametersGrid>

            <Radio.Group
                size="small"
                value={positionReference || POSITIONREFERENCE.ABSOLUTE}
                onChange={update_position_reference}
            >
                <Radio.Button value={POSITIONREFERENCE.ABSOLUTE}>Absolute</Radio.Button>
                <Radio.Button value={POSITIONREFERENCE.RELATIVE}>Relative</Radio.Button>
            </Radio.Group>
        </Flex>
    )
}
