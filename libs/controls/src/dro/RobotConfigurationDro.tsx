/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Tag } from "antd"
import {
    ArrowDownOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    ArrowUpOutlined,
    ReloadOutlined
} from "@ant-design/icons"
import { useKinematics } from "@glowbuzzer/store"
import styled from "styled-components"

const StyledDiv = styled.div`
    display: flex;
    justify-content: center;

    .ant-tag {
        border: none;
        padding: 5px 10px;
    }
`

/** @ignore - internal to the cartesian DRO tile */
export const RobotConfigurationDro = ({ value, supportedConfigurationBits }) => {
    const waist = value & 0b100
    const elbow = value & 0b010
    const wrist = value & 0b001

    const waistSupported = supportedConfigurationBits & 0b100 || null
    const elbowSupported = supportedConfigurationBits & 0b010 || null
    const wristSupported = supportedConfigurationBits & 0b001 || null

    return (
        <StyledDiv>
            {waistSupported && (
                <Tag>Waist {waist ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}</Tag>
            )}
            {elbowSupported && (
                <Tag>Elbow {elbow ? <ArrowDownOutlined /> : <ArrowUpOutlined />}</Tag>
            )}
            {wristSupported && (
                <Tag>
                    Wrist <ReloadOutlined style={wrist ? { transform: "scaleX(-1)" } : undefined} />
                </Tag>
            )}
        </StyledDiv>
    )
}
