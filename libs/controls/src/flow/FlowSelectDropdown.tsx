/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Select } from "antd"
import { useFlows } from "@glowbuzzer/store"
import { useFlowContext } from "./FlowContextProvider"
import { useUser } from "../usermgmt"
import { FlowMakerCapability } from "./FlowMakerCapability"
import { ItemType } from "antd/es/menu/interface"

export const FlowSelectDropdown = ({ runnable = false }) => {
    const flows = useFlows()
    const { selectedFlowIndex, setSelectedFlowIndex } = useFlowContext()
    const { hasCapability } = useUser()

    const items: ItemType[] = flows
        .filter(f => !runnable || !f.restricted || hasCapability(FlowMakerCapability.EDIT))
        .map((flow, index) => ({
            key: index,
            value: index,
            label: <>{flow.name}</>
        }))

    const selected_index = Math.min(selectedFlowIndex, flows.length - 1)

    return (
        <Select
            size="small"
            options={items}
            value={selected_index}
            onChange={value => setSelectedFlowIndex(value)}
            popupMatchSelectWidth={false}
        ></Select>
    )
}
