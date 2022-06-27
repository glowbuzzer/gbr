/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { usePrefs } from "@glowbuzzer/store"
import { Select } from "antd"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Option = Select.Option as any // hack alert

const linear_units = {
    mm: "Millimeters",
    in: "Inches"
}

const angular_units = {
    rad: "Radians",
    deg: "Degrees"
}

/** @ignore - internal to the preferences dialog */
export const UnitSelector = ({ type }: { type: "linear" | "angular" }) => {
    const prefs = usePrefs()
    const key = "units_" + type

    function change(newValue) {
        prefs.update(key, newValue)
    }

    const pref = prefs.current[key]
    const units = type === "linear" ? linear_units : angular_units

    return (
        <Select defaultValue={pref} onChange={change} dropdownMatchSelectWidth={200}>
            {Object.keys(units).map(k => (
                <Option key={k} value={k}>
                    {units[k]}
                </Option>
            ))}
        </Select>
    )
}
