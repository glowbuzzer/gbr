/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { CartesianPosition } from "@glowbuzzer/store"
import { StyledFlowSettingItem } from "../styles"
import { FlowValuesDisplay } from "./FlowValuesDisplay"
import * as React from "react"

export const FlowActivityCartesianPosition = ({ position }: { position: CartesianPosition }) => {
    const { x, y, z } = position.translation || {}
    const translation = [x, y, z]
    return (
        <StyledFlowSettingItem>
            <FlowValuesDisplay values={translation} labels={["X", "Y", "Z"]} type="linear" />
        </StyledFlowSettingItem>
    )
}
