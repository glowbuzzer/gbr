/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Select } from "antd"
import { TRIGGERON } from "@glowbuzzer/store"
import { toEnumString } from "../../util"

type FlowEditTriggerOnDropdownProps = {
    type: TRIGGERON
    onChange: (type: TRIGGERON) => void
    enabledOptions: boolean[]
    includeImmediate?: boolean
}

export const FlowEditTriggerOnDropdown = ({
    type,
    onChange,
    enabledOptions,
    includeImmediate
}: FlowEditTriggerOnDropdownProps) => {
    function get_style(enabled: boolean) {
        if (!enabled) {
            return {
                color: "grey",
                pointerEvents: "none"
            }
        }
    }

    const additional_options = includeImmediate ? [TRIGGERON.TRIGGERON_NONE] : []
    const additional_enabled = includeImmediate ? [true] : []
    const all_enabled = [...additional_enabled, ...enabledOptions]

    return (
        <Select size="small" value={type} popupMatchSelectWidth={false} onChange={onChange}>
            {[
                ...additional_options,
                TRIGGERON.TRIGGERON_DIGITAL_INPUT,
                TRIGGERON.TRIGGERON_SAFE_DIGITAL_INPUT,
                TRIGGERON.TRIGGERON_ANALOG_INPUT,
                TRIGGERON.TRIGGERON_INTEGER_INPUT,
                TRIGGERON.TRIGGERON_TIMER
            ].map((v, index) => (
                <Select.Option key={v} value={v} style={get_style(all_enabled[index])}>
                    {v === TRIGGERON.TRIGGERON_NONE
                        ? "NONE (IMMEDIATE)"
                        : toEnumString(TRIGGERON[v])}
                </Select.Option>
            ))}
        </Select>
    )
}
