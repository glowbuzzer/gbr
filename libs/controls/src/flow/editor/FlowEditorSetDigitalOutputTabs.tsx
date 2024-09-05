/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Tabs, TabsProps } from "antd"
import { FlowEditorTabs } from "./util"
import { useFlowEdit } from "./FlowEditModal"
import { FlowEditTriggersForActivity } from "./triggers/FlowEditTriggersForActivity"
import { FlowEditDigitalOutputSettings } from "./settings/FlowEditDigitalOutputSettings"
import { SetDoutActivityParams, useDigitalOutputList } from "@glowbuzzer/store"

type FlowEditorSetDigitalOutputTabsProps = {
    value: SetDoutActivityParams
    onChangeValue: (value: SetDoutActivityParams) => void
    options: string[]
}

export const FlowEditorSetDigitalOutputTabs = ({
    value,
    options,
    onChangeValue
}: FlowEditorSetDigitalOutputTabsProps) => {
    const { item, onChange } = useFlowEdit()

    const tabs: TabsProps["items"] = [
        {
            ...FlowEditorTabs.settings,
            children: (
                <FlowEditDigitalOutputSettings
                    value={value}
                    onChange={onChangeValue}
                    options={options}
                />
            )
        },
        {
            ...FlowEditorTabs.triggers,
            children: (
                <FlowEditTriggersForActivity
                    triggers={item.triggers || []}
                    startActionOnly
                    onChange={triggers => onChange({ ...item, triggers })}
                />
            )
        }
    ]
    return <Tabs items={tabs} />
}
