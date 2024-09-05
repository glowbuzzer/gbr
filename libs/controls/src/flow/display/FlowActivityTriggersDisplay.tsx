/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { TriggerParams } from "@glowbuzzer/store"
import { StyledFlowSettingItem } from "../styles"
import { FlowTriggerDisplay } from "./FlowTriggerDisplay"

export const FlowActivityTriggersDisplay = ({ triggers }: { triggers: TriggerParams[] }) => {
    return (
        <div>
            {triggers?.length > 0 &&
                triggers.map((trigger, index) => {
                    return <FlowTriggerDisplay key={index} trigger={trigger} />
                })}
        </div>
    )
}
