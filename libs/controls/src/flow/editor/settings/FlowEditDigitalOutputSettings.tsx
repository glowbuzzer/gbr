/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { SetDoutActivityParams } from "@glowbuzzer/store"
import { Select, Space } from "antd"

type FlowEditDigitalOutputSettingsProps = {
    value: SetDoutActivityParams
    onChange: (value: SetDoutActivityParams) => void
    options: string[]
}

export const FlowEditDigitalOutputSettings = ({
    value,
    onChange,
    options
}: FlowEditDigitalOutputSettingsProps) => {
    return (
        <div>
            <Space>
                Set output
                <Select
                    size="small"
                    options={options.map((s, i) => ({
                        key: i,
                        label: s,
                        value: i
                    }))}
                    popupMatchSelectWidth={false}
                    value={value.doutToSet}
                    onChange={v => onChange({ ...value, doutToSet: v })}
                />
                to
                <Select
                    size="small"
                    options={[
                        { key: 0, label: "ON", value: true },
                        { key: 1, label: "OFF", value: false }
                    ]}
                    popupMatchSelectWidth={false}
                    value={value.valueToSet}
                    onChange={v => onChange({ ...value, valueToSet: v })}
                />
            </Space>
        </div>
    )
}
