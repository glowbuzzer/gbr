/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Tabs, TabsProps } from "antd"
import { FlowEditorTabs } from "./util"
import { FlowEditMoveToPositionSettings } from "./settings/FlowEditMoveToPositionSettings"
import { useFlowEdit } from "./FlowEditModal"
import { FlowEditMoveParams } from "./common/FlowEditMoveParams"
import { FlowEditTriggersForActivity } from "./triggers/FlowEditTriggersForActivity"

export const FlowEditorMoveToPositionTabs = () => {
    const { item, onChange } = useFlowEdit()

    const tabs: TabsProps["items"] = [
        {
            ...FlowEditorTabs.settings,
            children: <FlowEditMoveToPositionSettings item={item} onChange={onChange} />
        },
        {
            ...FlowEditorTabs.moveParams,
            children: (
                <FlowEditMoveParams
                    params={item.moveToPosition.moveParams}
                    onChange={params =>
                        onChange({
                            ...item,
                            moveToPosition: {
                                ...item.moveToPosition,
                                moveParams: params
                            }
                        })
                    }
                />
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
