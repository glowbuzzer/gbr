/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Slider } from "antd"
import { SegmentDisplay } from "./SegmentDisplay"
import {
    JOINT_FINITECONTINUOUS,
    JOINT_TYPE,
    useJoint,
    useJointConfigurationList,
    useJointCount,
    usePrefs
} from "@glowbuzzer/store"
import styled from "styled-components"
import { MathUtils } from "three"

const StyledGrid = styled.div<{ cols }>`
    display: grid;
    grid-template-columns: ${props => (props.cols === 2 ? "auto 1fr" : "auto auto 1fr")};
    align-items: center;
    column-gap: 8px;

    .label {
        font-weight: bold;
        text-align: center;
        border: 1px solid ${props => props.theme.colorBorder};
        padding: 0 4px;
    }
    .value {
        text-align: right;
    }
`

const JointDroItem = ({ index, warningThreshold, valueKey }) => {
    const { fromSI, getUnits } = usePrefs()
    const j = useJoint(index)
    const config = useJointConfigurationList()[index]

    if (!config) {
        return null
    }

    const { name, finiteContinuous, negLimit, posLimit, jointType } = config
    const showSlider = finiteContinuous === JOINT_FINITECONTINUOUS.JOINT_FINITE
    const type = jointType === JOINT_TYPE.JOINT_REVOLUTE ? "angular" : "linear"

    const is_torque = valueKey === JointDroValueKey.TORQUE

    const { units, precision } = is_torque ? { units: "Nm", precision: 3 } : getUnits(type)
    const [min, max] = [negLimit, posLimit].map(limit =>
        type === "angular" ? MathUtils.degToRad(limit) : limit
    )
    const current_in_si_units = j[valueKey]
    const current = is_torque ? current_in_si_units : fromSI(current_in_si_units, type)
    const warn_range = (max - min) * warningThreshold
    const warn =
        warn_range > 0 &&
        valueKey === JointDroValueKey.POS &&
        (current_in_si_units < min + warn_range || current_in_si_units > max - warn_range)

    return (
        <>
            <div className="label">{name}</div>
            <div className="value">
                <SegmentDisplay
                    value={current}
                    toFixed={precision === undefined ? 4 : precision}
                    width={12}
                    error={warn}
                />
                {units}
            </div>
            {showSlider && (
                <div className="slider-wrapper">
                    {min.toPrecision(4)}
                    <Slider
                        min={min}
                        max={max}
                        disabled
                        value={j?.actPos}
                        tooltip={{ open: false }}
                    />
                    {max.toPrecision(4)}
                </div>
            )}
        </>
    )
}

export enum JointDroValueKey {
    POS = "actPos",
    VEL = "actVel",
    TORQUE = "actTorque"
}

/**
 * Displays values of joints. By default will display all configured joints. If joints specify minimum and maximum values,
 * a gauge will be displayed showing the range of motion.
 */
export const JointDro = ({
    jointsToDisplay,
    warningThreshold,
    valueKey
}: {
    jointsToDisplay?: number[]
    warningThreshold: number
    valueKey: JointDroValueKey
}) => {
    const count = useJointCount()
    const joints = jointsToDisplay ? jointsToDisplay : Array.from(Array(count).keys())

    const jointConfigs = useJointConfigurationList()

    // determine if we need to show a slider for any of the joints
    const cols = joints.some(
        j => jointConfigs[j].finiteContinuous === JOINT_FINITECONTINUOUS.JOINT_FINITE
    )
        ? 3
        : 2

    return (
        <StyledGrid cols={cols}>
            {joints.map(j => (
                <JointDroItem
                    key={j}
                    index={j}
                    warningThreshold={warningThreshold}
                    valueKey={valueKey}
                />
            ))}
        </StyledGrid>
    )
}
