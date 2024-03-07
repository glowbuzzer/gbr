/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { usePrefs } from "@glowbuzzer/store"
import { Select, Space } from "antd"
import { PrecisionInput } from "../util/components/PrecisionInput"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Option = Select.Option as any // hack alert

const linear_units = {
    m: "Meters",
    mm: "Millimeters",
    in: "Inches"
}

const angular_units = {
    rad: "Radians",
    deg: "Degrees",
    rev: "Revolutions"
}

/** @ignore - internal to the preferences dialog */
export const UnitSelector = ({ type }: { type: "linear" | "angular" }) => {
    const prefs = usePrefs()
    const key = "units_" + type

    function change(newValue) {
        prefs.update(key, newValue)
    }

    const pref = prefs.current[key]
    const units_options = type === "linear" ? linear_units : angular_units
    const { precision } = prefs.getUnits(type)

    console.log("PREF", pref, precision)
    return (
        <Space>
            <Select size="small" defaultValue={pref} onChange={change} popupMatchSelectWidth={200}>
                {Object.keys(units_options).map(k => (
                    <Option key={k} value={k}>
                        {units_options[k]}
                    </Option>
                ))}
            </Select>
            to
            <PrecisionInput
                value={precision}
                precision={0}
                min={0}
                onChange={value => prefs.setPrecision(pref as any, value)}
                width={2}
            />
            dp
        </Space>
    )
}
