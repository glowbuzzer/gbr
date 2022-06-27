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
    value: number
    /** On change handler, called when the user interacts with the control */
    onChange(value: number)
}

/** @ignore - internal to the jog tile */
export const RobotConfigurationSelector = ({
    value,
    onChange
}: RobotConfigurationSelectorProps) => {
    const waist = value & 0b100
    const elbow = value & 0b010
    const wrist = value & 0b001

    function toggle(bit: number) {
        // noinspection JSBitwiseOperatorUsage
        const update = value & bit ? value & ~bit : value | bit
        onChange(update)
    }

    return (
        <StyledDiv>
            <Tag onClick={() => toggle(0b100)}>
                Waist {waist ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
            </Tag>
            <Tag onClick={() => toggle(0b010)}>
                Elbow {elbow ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            </Tag>
            <Tag onClick={() => toggle(0b001)}>
                Wrist <ReloadOutlined style={wrist ? { transform: "scaleX(-1)" } : undefined} />
            </Tag>
        </StyledDiv>
    )
}
