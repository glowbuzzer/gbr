import React, { useState } from "react"
import { Button, InputNumber, Switch, Tag } from "antd"
import { ArrowRightOutlined } from "@ant-design/icons"

export function NumericOutputWidget({ hookRef, index, label }: { hookRef: any; index: number; label?: string }) {
    const item = hookRef.values[index]

    const [overrideValue, setOverrideValue] = useState(item.actValue)

    const override = !!item.override

    function handle_override_change(value) {
        hookRef.update(index, {
            override: value > 0,
            value: overrideValue
        })
    }

    function handle_value_change(value) {
        hookRef.update(index, {
            override: true,
            value: overrideValue
        })
    }

    return (
        <div>
            <div className="output-label">{label || "Unknown"}</div>
            <div>
                <Switch checkedChildren="Override" unCheckedChildren="Auto" checked={override} onChange={handle_override_change} />
            </div>
            <div>
                <InputNumber disabled={!override} size="small" value={overrideValue} onChange={v => setOverrideValue(Number(v))} />
            </div>
            <div>
                <Button size="small" disabled={!override} onClick={handle_value_change}>
                    <ArrowRightOutlined />
                </Button>
            </div>
            <div>
                <Tag>{item.actValue || 0}</Tag>
            </div>
        </div>
    )
}
