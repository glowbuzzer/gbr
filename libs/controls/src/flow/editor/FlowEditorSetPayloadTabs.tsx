/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { useFlowEdit } from "./FlowEditModal"
import { Space, Tabs, TabsProps } from "antd"
import { FlowEditorTabs } from "./util"
import { FlowEditTriggersForActivity } from "./triggers/FlowEditTriggersForActivity"
import * as React from "react"
import { StyledEditTabCardContent } from "./styles"
import { PrecisionInput } from "../../util"

export const FlowEditorSetPayloadTabs = () => {
    const { item, onChange } = useFlowEdit()

    const tabs: TabsProps["items"] = [
        {
            ...FlowEditorTabs.settings,
            children: (
                <StyledEditTabCardContent>
                    <Space>
                        Payload mass:
                        <PrecisionInput
                            value={item.setPayload.mass}
                            precision={0}
                            step={1000}
                            min={0}
                            onChange={mass => onChange({ ...item, setPayload: { mass } })}
                        />
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
