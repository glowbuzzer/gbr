/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { ActivityStreamItem } from "@glowbuzzer/store"
import { StyledFlowSettingItem } from "../styles"
import { toActivityTypeString } from "../util"
import { FlowActivityParams } from "./FlowActivityParams"
import { FlowActivityTriggersDisplay } from "./FlowActivityTriggersDisplay"
import { GlowbuzzerIcon } from "../../util/GlowbuzzerIcon"
import { ReactComponent as EditIcon } from "@material-symbols/svg-400/outlined/edit.svg"
import { ReactComponent as MoreVerticalIcon } from "@material-symbols/svg-400/outlined/more_vert.svg"
import { Dropdown } from "antd"
import { ItemType } from "antd/es/menu/interface"

type FlowActivityProps = {
    item: ActivityStreamItem
    onEdit?(): void
    onExecute?(): void
    onDelete?(): void
    onMoveUp?(): void
    onMoveDown?(): void
}
export const FlowActivityDisplay = ({
    item,
    onEdit,
    onDelete,
    onExecute,
    onMoveUp,
    onMoveDown
}: FlowActivityProps) => {
    const menu_options: ItemType[] = [
        {
            key: "delete",
            label: "Delete Activity",
            onClick: onDelete
        },
        {
            key: "exec",
            label: "Execute Activity",
            onClick: onExecute
        },
        {
            key: "move-up",
            label: "Move Up",
            onClick: onMoveUp
        },
        {
            key: "move-down",
            label: "Move Down",
            onClick: onMoveDown
        }
    ].filter(m => m.onClick)

    return (
        <>
            <div>
                <StyledFlowSettingItem>
                    <div>{toActivityTypeString(item.activityType)}</div>
                </StyledFlowSettingItem>
            </div>
            <div>
                <FlowActivityParams item={item} />
            </div>
            <FlowActivityTriggersDisplay triggers={item.triggers} />
            {onEdit && onDelete && (
                <div className="actions">
                    <GlowbuzzerIcon Icon={EditIcon} button onClick={onEdit} />
                    <Dropdown menu={{ items: menu_options }} trigger={["click"]}>
                        <GlowbuzzerIcon Icon={MoreVerticalIcon} button />
                    </Dropdown>
                </div>
            )}
        </>
    )
}
