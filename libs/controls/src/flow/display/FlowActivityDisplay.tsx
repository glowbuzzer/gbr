/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { ActivityStreamItem } from "@glowbuzzer/store"
import { StyledFlowSettingItem } from "../styles"
import { toActivityTypeString } from "../util"
import { FlowActivityParams } from "./FlowActivityParams"
import { FlowTriggersDisplay } from "./FlowTriggersDisplay"
import { GlowbuzzerIcon } from "../../util/GlowbuzzerIcon"
import { ReactComponent as EditIcon } from "@material-symbols/svg-400/outlined/edit.svg"
import { ReactComponent as DeleteIcon } from "@material-symbols/svg-400/outlined/delete.svg"

type FlowActivityProps = {
    item: ActivityStreamItem
    onEdit(): void
    onDelete(): void
}
export const FlowActivityDisplay = ({ item, onEdit, onDelete }: FlowActivityProps) => {
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
            <FlowTriggersDisplay triggers={item.triggers} />
            <div className="actions">
                <GlowbuzzerIcon Icon={EditIcon} button onClick={onEdit} />
                <GlowbuzzerIcon Icon={DeleteIcon} button onClick={onDelete} />
            </div>
        </>
    )
}
