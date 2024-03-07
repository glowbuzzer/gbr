/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import {
    SetAoutActivityParams,
    SetDoutActivityParams,
    SetIoutActivityParams,
    SetUioutActivityParams
} from "@glowbuzzer/store"
import { Select, Space } from "antd"
import { PrecisionInput } from "../../../util/components/PrecisionInput"

type FlowEditGenericNumericOutputSettingsProps = {
    index: number
    value: number
    precision: number
    onChange: (index: number, value: number) => void
    options: string[]
}

export const FlowEditGenericNumbericOutputSettings = ({
    index,
    value,
    precision,
    onChange,
    options
}: FlowEditGenericNumericOutputSettingsProps) => {
    return (
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
                value={value}
                onChange={i => onChange(i, value)}
            />
            to
            <PrecisionInput
                value={value}
                onChange={v => onChange(index, v)}
                precision={precision}
            />
        </Space>
    )
}
