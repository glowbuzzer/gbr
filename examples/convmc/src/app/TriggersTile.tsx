import React from "react"
import { Tile } from "@glowbuzzer/controls"
import { Checkbox, Radio, Space } from "antd"
import { useDigitalInputOverrides, useDigitalInputs } from "@glowbuzzer/store"

export const TriggersTile = () => {
    const digitalInputOverrides = useDigitalInputOverrides()
    const dins = useDigitalInputs()

    function toggle(index) {
        digitalInputOverrides.set(index, true, !digitalInputOverrides.get(index))
    }

    function set_cylinder(e) {
        const v = e.target.value
        if (v === 1) {
            digitalInputOverrides.set(0, true, true)
            digitalInputOverrides.set(1, true, false)
        } else {
            digitalInputOverrides.set(0, true, false)
            digitalInputOverrides.set(1, true, true)
        }
    }

    const [extended, retracted, magiceye] = dins

    const value = extended ? 1 : retracted ? 2 : undefined

    return (
        <Tile title="Manual Triggers">
            <Space direction="vertical">
                <Space>
                    Cylinder
                    <Radio.Group onChange={set_cylinder} value={value}>
                        <Radio value={1}>Extended</Radio>
                        <Radio value={2}>Retracted</Radio>
                    </Radio.Group>
                </Space>
                <Space>
                    <Checkbox checked={magiceye} onChange={() => toggle(2)}>
                        Magic Eye
                    </Checkbox>
                </Space>
            </Space>
        </Tile>
    )
}
