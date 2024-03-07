/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Tabs, TabsProps } from "antd"
import { FlowEditorTabs } from "./util"
import { useFlowEdit } from "./FlowEditModal"
import { FlowEditMoveParams } from "./common/FlowEditMoveParams"
import { FlowEditTriggersForActivity } from "./triggers/FlowEditTriggersForActivity"
import { FlowEditMoveLineSettings } from "./settings/FlowEditMoveLineSettings"

export const FlowEditorMoveLineTabs = () => {
    const { item, onChange } = useFlowEdit()

    const tabs: TabsProps["items"] = [
        {
            ...FlowEditorTabs.settings,
            children: <FlowEditMoveLineSettings item={item} onChange={onChange} />
        },
        {
            ...FlowEditorTabs.moveParams,
            children: (
                <FlowEditMoveParams
                    params={item.moveLine.moveParams}
                    onChange={params =>
                        onChange({
                            ...item,
                            moveLine: {
                                ...item.moveLine,
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
