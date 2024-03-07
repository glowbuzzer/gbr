/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { ActivityStreamItem, ACTIVITYTYPE, useKinematicsCartesianPosition } from "@glowbuzzer/store"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"
import { ReactComponent as AddIcon } from "@material-symbols/svg-400/outlined/add.svg"
import { Select, Space } from "antd"
import { useState } from "react"
import { ActivityFactoryList } from "./util"

type FlowTeachControlsProps = {
    onAddActivity(activity: ActivityStreamItem): void
}

export const FlowTeachControls = ({ onAddActivity }: FlowTeachControlsProps) => {
    const [selected, setSelected] = useState(ACTIVITYTYPE.ACTIVITYTYPE_MOVETOPOSITION)
    const position = useKinematicsCartesianPosition(0)

    const options = [
        { value: ACTIVITYTYPE.ACTIVITYTYPE_MOVETOPOSITION, label: "Move To Position" },
        { value: ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE, label: "Move Line" }
    ]

    function add_activity() {
        const entry = ActivityFactoryList.find(item => item.type === selected)
        const activity = entry.factory(position)
        onAddActivity(activity)
    }

    return (
        <Space style={{ padding: "2px" }}>
            Quick Add
            <Select
                size="small"
                value={selected}
                options={options}
                popupMatchSelectWidth={false}
                onChange={value => setSelected(value)}
            />
            <div style={{ fontSize: "12px" }}>
                <GlowbuzzerIcon Icon={AddIcon} button title="Add Move" onClick={add_activity} />
            </div>
        </Space>
    )
}
