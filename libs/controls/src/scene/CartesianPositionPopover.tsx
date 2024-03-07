/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { usePrefs } from "@glowbuzzer/store"
import { Euler, Quaternion, Vector3 } from "three"
import { Html } from "@react-three/drei"
import React from "react"
import styled, { useTheme } from "styled-components"
import { ReactComponent as TranslationIcon } from "../icons/translation.svg"
import { ReactComponent as RotationIcon } from "../icons/rotation.svg"

const StyledDiv = styled.div<{ $background; $color }>`
    margin-top: 10px;
    padding: 5px;
    user-select: none;
    white-space: nowrap;
    background: ${props => props.$background};
    color: ${props => props.$color}
    border: 1px solid rgba(0, 0, 0, 0.1);

    .title {
        font-weight: bold;
        padding-bottom: 3px;
    }

    .grid {
        display: grid;
        gap: 5px;
        grid-template-columns: 25px repeat(4, fit-content(100px));

        > div {
            text-align: right;
        }

        .units {
            text-align: left;
        }
    }
`
type CartesianPositionPopoverProps = {
    name: string
    translation: Vector3
    rotation: Quaternion
    point: Vector3
}

export const CartesianPositionPopover = ({
    name,
    translation,
    rotation,
    point
}: CartesianPositionPopoverProps) => {
    const { getUnits, fromSI } = usePrefs()
    const theme = useTheme()

    const euler = new Euler().setFromQuaternion(
        new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)
    )
    const [x, y, z] = translation.toArray().map(v => fromSI(v, "linear"))
    const [rx, ry, rz] = euler.toArray().map(v => fromSI(Number(v), "angular"))

    const { units: linear_units, precision: linear_precision } = getUnits("linear")
    const { units: angular_units, precision: angular_precision } = getUnits("angular")

    return (
        <Html position={point}>
            <StyledDiv $background={theme.colorBgContainer} $color={theme.colorText}>
                <div className="title">{name}</div>

                <div className="grid">
                    <TranslationIcon height={20} fill={theme.colorText} />
                    <div>{x.toFixed(linear_precision)}</div>
                    <div>{y.toFixed(linear_precision)}</div>
                    <div>{z.toFixed(linear_precision)}</div>
                    <div className="units">{linear_units}</div>

                    <RotationIcon height={20} fill={theme.colorText} />
                    <div>{rx.toFixed(angular_precision)}</div>
                    <div>{ry.toFixed(angular_precision)}</div>
                    <div>{rz.toFixed(angular_precision)}</div>
                    <div className="units">{angular_units}</div>
                </div>
            </StyledDiv>
        </Html>
    )
}
