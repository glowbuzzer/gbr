/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import styled, { css } from "styled-components"
import { Divider, Space } from "antd"

const StyledDockToolbar = styled.div<{ $floating: boolean }>`
    ${props =>
        props.$floating &&
        css`
            position: absolute;
            top: 0;
            left: 0;
        `}

    font-size: 12px;
    padding: 4px 5px;
    width: 100%;

    div:hover > & {
        visibility: visible;
    }

    border-bottom: 1px solid var(--color-tabset-divider-line);
`

export const DockToolbarButtonGroup = styled.span`
    .button + .button {
        margin-left: 3px;
    }
`

const StyledSpace = styled(Space)`
    gap: 0 !important;
`

/**
 * The toolbar for a tile. This is a simple container for buttons and other controls. You can group buttons using the `DockToolbarButtonGroup` component.
 */
export const DockToolbar = ({
    floating = false,
    children
}: {
    /** Whether toolbar should float above the tile content */
    floating?: boolean
    children
}) => {
    return (
        <StyledDockToolbar $floating={floating}>
            <StyledSpace split={<Divider type="vertical" />}>{children}</StyledSpace>
        </StyledDockToolbar>
    )
}
