/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { StyledToolTipDiv } from "./commonStyles"
import { Tooltip } from "antd"
import React from "react"

/**
 * A wrapper for the Tooltip component.
 * @param title The title of the tooltip.
 * @param children The children to be displayed.
 */
export const TooltipWrapper = ({ title, children }) => (
    <StyledToolTipDiv>
        <Tooltip
            title={title}
            placement="top"
            mouseEnterDelay={1}
            getPopupContainer={triggerNode => triggerNode}
        >
            {children}
        </Tooltip>
    </StyledToolTipDiv>
)
