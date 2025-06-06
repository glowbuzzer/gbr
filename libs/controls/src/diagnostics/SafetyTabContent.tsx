/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import React from "react"
import { StyledSafetyTileContent } from "../util/styles/StyledTileContent"

export const SafetyTabContent = ({ children }) => {
    return (
        <StyledSafetyTileContent>
            <div className="content">{children}</div>
        </StyledSafetyTileContent>
    )
}
