/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { StyledToolTipDiv } from "./commonStyles"
import { Tooltip } from "antd"
import React from "react"

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
