/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { TriggerEditProps } from "../common/types"
import { GTLT, TriggerOnAnalogInput, useAnalogInputList } from "@glowbuzzer/store"
import { Select, Space } from "antd"
import { FlowEditTriggerNumericComparisonDropdown } from "./FlowEditTriggerNumericComparisonDropdown"
import { PrecisionInput } from "../../../util/components/PrecisionInput"
import * as React from "react"

export const FlowEditTriggerAnalogInput = ({ trigger, onChange }: TriggerEditProps) => {
    const analog = trigger.analog || { input: 0, value: 0, when: GTLT.GREATERTHAN }
    const inputs = useAnalogInputList()

    function change(change: Pick<TriggerOnAnalogInput, "input" | "when" | "value">) {
        onChange({ ...trigger, integer: { ...analog, ...change } })
    }

    return (
        <Space>
            <Select
                size="small"
                popupMatchSelectWidth={false}
                value={analog.input}
                onChange={input => change({ input })}
            >
                {inputs.map((input, index) => (
                    <Select.Option key={index} value={index}>
                        {input.name}
                    </Select.Option>
                ))}
            </Select>
            <FlowEditTriggerNumericComparisonDropdown
                value={analog.when || GTLT.GREATERTHAN}
                onChange={when => change({ when })}
            />
            <PrecisionInput
                value={analog.value}
                onChange={value => change({ value })}
                precision={3}
            />
        </Space>
    )
}
