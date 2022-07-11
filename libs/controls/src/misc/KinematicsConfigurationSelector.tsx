/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Select } from "antd"
import * as React from "react"
import { useKinematicsConfigurationList } from "@glowbuzzer/store"

type KinematicsConfigurationSelectorProps = {
    value: number
    onChange: (index: number) => void
}

/**
 * Provides a way to select a kinematics configuration.
 *
 * @param value the current kinematics configuration index
 * @param onChange handler for change events
 */
export const KinematicsConfigurationSelector = ({
    value,
    onChange
}: KinematicsConfigurationSelectorProps) => {
    const kcs = useKinematicsConfigurationList()
    const items = kcs.map((kc, index) => (
        <Select.Option key={index} value={index}>
            {kc.name}
        </Select.Option>
    ))
    return (
        <Select dropdownMatchSelectWidth={200} value={value} onChange={onChange} size="small">
            {items}
        </Select>
    )
}
