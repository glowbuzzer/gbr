/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { useState } from "react"
import { Button, InputNumber, Switch, Tag } from "antd"
import { ArrowRightOutlined } from "@ant-design/icons"

/** @ignore - internal to the jog tile */
export function NumericOutputWidget({
    label,
    effectiveValue,
    setValue,
    override,
    onChange
}: {
    label: string
    effectiveValue: number
    setValue: number
    override: boolean
    onChange(value, override): void
}) {
    const [overrideValue, setOverrideValue] = useState(setValue)

    function handle_override_change() {
        onChange(overrideValue, !override)
    }

    function handle_value_change() {
        onChange(overrideValue, true)
    }

    return (
        <div>
            <div className="output-label">{label || "Unknown"}</div>
            <div>
                <Switch
                    checkedChildren="Override"
                    unCheckedChildren="Auto"
                    checked={override}
                    onChange={handle_override_change}
                />
            </div>
            <div>
                <InputNumber
                    disabled={!override}
                    size="small"
                    value={overrideValue}
                    onChange={v => setOverrideValue(Number(v))}
                />
            </div>
            <div>
                <Button size="small" disabled={!override} onClick={handle_value_change}>
                    <ArrowRightOutlined />
                </Button>
            </div>
            <div>
                <Tag>{effectiveValue || 0}</Tag>
            </div>
        </div>
    )
}
