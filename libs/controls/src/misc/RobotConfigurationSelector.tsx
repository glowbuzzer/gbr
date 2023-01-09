/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Tag } from "antd"
import {
    ArrowDownOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    ArrowUpOutlined,
    ReloadOutlined
} from "@ant-design/icons"
import * as React from "react"
import styled from "styled-components"

const StyledDiv = styled.div`
    display: inline-block;
    white-space: nowrap;

    .ant-tag {
        cursor: pointer;
    }
`

type RobotConfigurationSelectorProps = {
    /** Current configuration */
    currentValue: number
    /** Edited value */
    value: number
    /** Which configuration bits are allowed (waist, elbow, wrist) */
    supportedConfigurationBits: number
    /** On change handler, called when the user interacts with the control */
    onChange(value: number)
}

/** @ignore - internal to the jog tile */
export const RobotConfigurationSelector = ({
    currentValue,
    value,
    supportedConfigurationBits,
    onChange
}: RobotConfigurationSelectorProps) => {
    const waist = value & 0b100
    const elbow = value & 0b010
    const wrist = value & 0b001

    const currentWaist = currentValue & 0b100
    const currentElbow = currentValue & 0b010
    const currentWrist = currentValue & 0b001

    function toggle(bit: number) {
        onChange(value ^ bit)
    }

    const waistSupported = supportedConfigurationBits & 0b100 || null
    const elbowSupported = supportedConfigurationBits & 0b010 || null
    const wristSupported = supportedConfigurationBits & 0b001 || null

    return (
        <StyledDiv>
            {waistSupported && (
                <Tag
                    onClick={() => toggle(0b100)}
                    color={currentWaist !== waist ? "blue" : undefined}
                >
                    Waist {waist ? <ArrowRightOutlined color={"red"} /> : <ArrowLeftOutlined />}
                </Tag>
            )}
            {elbowSupported && (
                <Tag
                    onClick={() => toggle(0b010)}
                    color={currentElbow !== elbow ? "blue" : undefined}
                >
                    Elbow {elbow ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                </Tag>
            )}
            {wristSupported && (
                <Tag
                    onClick={() => toggle(0b001)}
                    color={currentWrist !== wrist ? "blue" : undefined}
                >
                    Wrist <ReloadOutlined style={wrist ? { transform: "scaleX(-1)" } : undefined} />
                </Tag>
            )}
        </StyledDiv>
    )
}
