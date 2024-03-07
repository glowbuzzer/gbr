/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { DwellActivityParams, SetDoutActivityParams } from "@glowbuzzer/store"
import { Select, Space, Tabs, TabsProps } from "antd"
import { FlowEditorTabs } from "./util"
import { FlowEditDigitalOutputSettings } from "./settings/FlowEditDigitalOutputSettings"
import { FlowEditTriggersForActivity } from "./triggers/FlowEditTriggersForActivity"
import { useFlowEdit } from "./FlowEditModal"
import { PrecisionInput } from "../../util/components/PrecisionInput"

type FlowEditorDwellTabsProps = {
    value: DwellActivityParams
    onChangeValue: (value: DwellActivityParams) => void
}

export const FlowEditorDwellTabs = ({ value, onChangeValue }: FlowEditorDwellTabsProps) => {
    const { item, onChange } = useFlowEdit()

    const tabs: TabsProps["items"] = [
        {
            ...FlowEditorTabs.settings,
            children: (
                <Space>
                    Dwell for
                    <PrecisionInput
                        value={value.msToDwell}
                        precision={0}
                        step={1000}
                        min={0}
                        onChange={msToDwell => onChangeValue({ msToDwell })}
                    />
                    ms
                </Space>
            )
        },
        {
            ...FlowEditorTabs.triggers,
            children: (
                <FlowEditTriggersForActivity
                    triggers={item.triggers || []}
                    onChange={triggers => onChange({ ...item, triggers })}
                />
            )
        }
    ]
    return <Tabs items={tabs} />
}
