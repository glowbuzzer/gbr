/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Select } from "antd"
import { GTLT } from "@glowbuzzer/store"

type FlowEditTriggerNumericComparisonDropdownProps = {
    value: GTLT
    onChange: (type: GTLT) => void
}

export const FlowEditTriggerNumericComparisonDropdown = ({
    value,
    onChange
}: FlowEditTriggerNumericComparisonDropdownProps) => {
    return (
        <Select size="small" value={value} onChange={onChange}>
            <Select.Option value={GTLT.GREATERTHAN}>&gt;</Select.Option>
            <Select.Option value={GTLT.LESSTHAN}>&lt;</Select.Option>
        </Select>
    )
}
