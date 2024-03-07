/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { StyledFlowSettingItem } from "../styles"
import * as React from "react"

export const FlowActivityParamsGeneric = ({ name, value }: { name: string; value: string }) => {
    return (
        <StyledFlowSettingItem>
            <div>{name}</div>
            <div>{value}</div>
        </StyledFlowSettingItem>
    )
}
