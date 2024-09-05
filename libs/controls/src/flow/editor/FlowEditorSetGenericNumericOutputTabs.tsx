/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Select, Space, Tabs, TabsProps } from "antd"
import { FlowEditorTabs } from "./util"
import { useFlowEdit } from "./FlowEditModal"
import { FlowEditTriggersForActivity } from "./triggers/FlowEditTriggersForActivity"
import { PrecisionInput } from "../../util/components/PrecisionInput"

type FlowEditorSetGenericNumbericOutputTabsProps = {
    index: number
    value: number
    precision: number
    onChange: (index: number, value: number) => void
    options: string[]
}

export const FlowEditorSetGenericNumericOutputTabs = ({
    index,
    value,
    precision,
    options,
    onChange: onChangeOutput
}: FlowEditorSetGenericNumbericOutputTabsProps) => {
    const { item, onChange } = useFlowEdit()

    const tabs: TabsProps["items"] = [
        {
            ...FlowEditorTabs.settings,
            children: (
                <Space>
                    Set output
                    <Select
                        size="small"
                        options={options.map((s, i) => ({
                            key: i,
                            label: s,
                            value: i
                        }))}
                        popupMatchSelectWidth={false}
                        value={index}
                        onChange={i => onChangeOutput(i, value)}
                    />
                    to
                    <PrecisionInput
                        value={value}
                        onChange={v => onChangeOutput(index, v)}
                        precision={precision}
                    />
                </Space>
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
