/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { TooltipWrapper } from "./TooltipWrapper"
import { Button } from "antd"
import React from "react"

export const ActionButton = ({ onClick, disabled, children, tooltipTitle, type }) => (
    <TooltipWrapper title={tooltipTitle}>
        <Button type={type} onClick={onClick} disabled={disabled} size="small">
            {children}
        </Button>
    </TooltipWrapper>
)
