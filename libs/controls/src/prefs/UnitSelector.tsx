import * as React from "react"
import { usePrefs } from "@glowbuzzer/store"
import { Select } from "antd"

const Option = Select.Option as any // hack alert

const scalar_units = {
    mm: "Millimeters",
    in: "Inches"
}

const angular_units = {
    rad: "Radians",
    deg: "Degrees"
}

export const UnitSelector = ({ type }: { type: "scalar" | "angular" }) => {
    const prefs = usePrefs()
    const key = "units_" + type

    function change(newValue) {
        prefs.update(key, newValue)
    }

    const pref = prefs.current[key]
    const units = type === "scalar" ? scalar_units : angular_units

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
