import React from "react"
import { StyledToolTipDiv } from "./commonStyles"
import { Button, Tooltip } from "antd"

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

export const ActionButton = ({ onClick, disabled, children, tooltipTitle, type }) => (
    <TooltipWrapper title={tooltipTitle}>
        <Button type={type} onClick={onClick} disabled={disabled} size="small">
            {children}
        </Button>
    </TooltipWrapper>
)
