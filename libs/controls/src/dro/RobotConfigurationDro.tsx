import * as React from "react"
import { Tag } from "antd"
import { ArrowDownOutlined, ArrowLeftOutlined, ArrowRightOutlined, ArrowUpOutlined, ReloadOutlined } from "@ant-design/icons"
import { useKinematics } from "@glowbuzzer/store"

export const RobotConfigurationDro = () => {
    const kinematics = useKinematics(0, 0)

    if (kinematics.type !== 0) {
        // TX40 only
        throw new Error("Unsupported kinematics type: " + kinematics.type)
    }

    const waist = kinematics.currentConfiguration & 0b100
    const elbow = kinematics.currentConfiguration & 0b100
    const wrist = kinematics.currentConfiguration & 0b100

    return (
        <>
            <Tag>Waist {waist ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}</Tag>
            <Tag>Elbow {elbow ? <ArrowUpOutlined /> : <ArrowDownOutlined />}</Tag>
            <Tag>
                Wrist <ReloadOutlined style={wrist ? { transform: "scaleX(-1)" } : undefined} />
            </Tag>
        </>
    )
}
