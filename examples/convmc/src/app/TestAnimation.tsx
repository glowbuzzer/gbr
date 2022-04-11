import React, { useState } from "react"
import { JobAnimation } from "./JobAnimation"
import { Radio } from "antd"

export const TestAnimation = ({ c1, c2 }) => {
    const [value, setValue] = useState("idle")

    function update_value(e) {
        setValue(e.target.value)
    }

    return (
        <>
            <JobAnimation state={value} c1={c1 || 0} c2={c2 || 0} />
            <Radio.Group
                optionType="button"
                options={[
                    { label: "idle", value: "idle" },
                    { label: "detect_image", value: "detect_image" },
                    { label: "extend_cylinder", value: "extend_cylinder" },
                    { label: "retract_cylinder", value: "retract_cylinder" },
                    { label: "eject_type1", value: "eject_type1" },
                    { label: "eject_type2", value: "eject_type2" }
                ]}
                value={value}
                onChange={update_value}
            />
        </>
    )
}
