/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { ActivityStreamItem, useKinematicsCartesianPosition } from "@glowbuzzer/store"
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
    const cartesianPosition = useKinematicsCartesianPosition(0)

    const options = ActivityFactoryList.map(item => ({
        key: item.type,
        value: item.type,
        label: <>{toActivityTypeString(item.type)}</>,
        onClick() {
            onAddActivity(item.factory(cartesianPosition))
        }
    }))

    return (
        <Dropdown menu={{ items: options }} trigger={["click"]}>
            {children}
        </Dropdown>
    )
}
