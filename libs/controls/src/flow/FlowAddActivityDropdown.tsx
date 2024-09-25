/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { ActivityStreamItem, useConfig, useKinematicsCartesianPosition } from "@glowbuzzer/store"
import { ActivityFactoryList, toActivityTypeString } from "./util"
import { Dropdown } from "antd"

type FlowAddActivityDropdownProps = {
    children: React.ReactNode
    onAddActivity: (activity: ActivityStreamItem) => void
}

export const FlowAddActivityDropdown = ({
    children,
    onAddActivity
}: FlowAddActivityDropdownProps) => {
    const config = useConfig()
    const cartesianPosition = useKinematicsCartesianPosition(0)

    const options = ActivityFactoryList.map(item => ({
        key: item.type,
        value: item.type,
        label: <>{toActivityTypeString(item.type)}</>,
        onClick() {
            onAddActivity(item.factory(cartesianPosition))
        },
        disabled: item.configKey && !(config[item.configKey] as [])?.length
    }))

    return (
        <Dropdown menu={{ items: options }} trigger={["click"]}>
            {children}
        </Dropdown>
    )
}
