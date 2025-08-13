/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Card, Space } from "antd"
import { KinematicsDropdown } from "../../../kinematics/KinematicsDropdown"

type FlowEditKcSelectCardProps = {
    kinematicsConfigurationIndex: number
    onChange: (kinematicsConfigurationIndex: number) => void
}

export const FlowEditKcSelectCard = ({
    kinematicsConfigurationIndex,
    onChange
}: FlowEditKcSelectCardProps) => {
    return (
        <Card title="Kinematics Configuration Index" size="small">
            <Space align="center">
                Select kinematics configuration{" "}
                <KinematicsDropdown value={kinematicsConfigurationIndex} onChange={onChange} />
            </Space>
        </Card>
    )
}
