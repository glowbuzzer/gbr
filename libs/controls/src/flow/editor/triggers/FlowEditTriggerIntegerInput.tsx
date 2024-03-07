/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { TriggerEditProps } from "../common/types"
import { GTLT, TriggerOnIntegerInput, useIntegerInputList } from "@glowbuzzer/store"
import { Select, Space } from "antd"
import { FlowEditTriggerNumericComparisonDropdown } from "./FlowEditTriggerNumericComparisonDropdown"
import { PrecisionInput } from "../../../util/components/PrecisionInput"
import * as React from "react"

export const FlowEditTriggerIntegerInput = ({ trigger, onChange }: TriggerEditProps) => {
    const integer = trigger.integer || { input: 0, value: 0, when: GTLT.GREATERTHAN }
    const inputs = useIntegerInputList()

    function change(change: Pick<TriggerOnIntegerInput, "input" | "when" | "value">) {
        onChange({ ...trigger, integer: { ...integer, ...change } })
    }

    return (
        <Space>
            <Select
                size="small"
                popupMatchSelectWidth={false}
                value={integer.input}
                onChange={input => change({ input })}
            >
                {inputs.map((input, index) => (
                    <Select.Option key={index} value={index}>
                        {input.name}
                    </Select.Option>
                ))}
            </Select>
            <FlowEditTriggerNumericComparisonDropdown
                value={integer.when || GTLT.GREATERTHAN}
                onChange={when => change({ when })}
            />
            <PrecisionInput
                value={integer.value}
                onChange={value => change({ value })}
                precision={0}
            />
        </Space>
    )
}
