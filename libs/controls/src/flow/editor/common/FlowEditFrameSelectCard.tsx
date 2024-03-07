/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { FramesDropdown } from "../../.."
import { FlowEditTabTitleRadioGroup } from "./FlowEditTabTitleRadioGroup"
import { Card, Space } from "antd"

type FlowEditFrameSelectCardProps = {
    frame: number
    onChange: (frame: number) => void
}

export const FlowEditFrameSelectCard = ({ frame, onChange }: FlowEditFrameSelectCardProps) => {
    return (
        <Card
            title={
                <FlowEditTabTitleRadioGroup
                    title="Reference Frame"
                    value={frame !== undefined}
                    onChange={value => onChange(value ? 0 : undefined)}
                    options={[
                        { value: false, label: "ROBOT FRAME" },
                        { value: true, label: "OTHER" }
                    ]}
                />
            }
            size="small"
        >
            {frame === undefined ? (
                <div>Move will use the local frame of the robot</div>
            ) : (
                <Space align="center">
                    Select frame of reference <FramesDropdown value={frame} onChange={onChange} />
                </Space>
            )}
        </Card>
    )
}
