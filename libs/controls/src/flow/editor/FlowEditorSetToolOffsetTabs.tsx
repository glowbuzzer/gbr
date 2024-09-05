/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { useFlowEdit } from "./FlowEditModal"
import { Select, Space, Tabs, TabsProps } from "antd"
import { FlowEditorTabs } from "./util"
import { FlowEditTriggersForActivity } from "./triggers/FlowEditTriggersForActivity"
import * as React from "react"
import { StyledEditTabCardContent } from "./styles"
import { PrecisionInput } from "../../util"
import { TRIGGERACTION, useToolList } from "@glowbuzzer/store"
import { toEnumString } from "../util"

export const FlowEditorSetToolOffsetTabs = () => {
    const { item, onChange } = useFlowEdit()
    const tools = useToolList()

    const tabs: TabsProps["items"] = [
        {
            ...FlowEditorTabs.settings,
            children: (
                <StyledEditTabCardContent>
                    <Space>
                        Select tool:
                        <Select
                            size="small"
                            value={item.setToolOffset.toolIndex}
                            popupMatchSelectWidth={false}
                            onChange={toolIndex =>
                                onChange({ ...item, setToolOffset: { toolIndex } })
                            }
                        >
                            {tools.map((t, index) => (
                                <Select.Option key={index} value={index}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Space>
                </StyledEditTabCardContent>
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
