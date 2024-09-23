/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import React, { useContext } from "react"
import { StyledSafetyTileContent } from "../util/styles/StyledTileContent"
import { DockTileDisabledContext } from "../dock"

export const SafetyTileContent = ({ children }) => {
    const { active } = useContext(DockTileDisabledContext)

    return (
        <StyledSafetyTileContent $dimmed={active}>
            <div className="content">{children}</div>
        </StyledSafetyTileContent>
    )
}
