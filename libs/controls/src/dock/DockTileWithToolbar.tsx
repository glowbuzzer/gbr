/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { ReactNode } from "react"
import styled from "styled-components"
import { DockToolbar } from "./DockToolbar"

const StyledTileWithToolbar = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;

    .panel {
        flex-grow: 1;
        overflow-y: auto;
        min-height: 0;
    }
`

/** @ignore - internal component */
export const DockTileWithToolbar = ({
    children,
    toolbar
}: {
    children: ReactNode
    toolbar: ReactNode
}) => {
    return (
        <StyledTileWithToolbar>
            <DockToolbar>{toolbar}</DockToolbar>
            <div className="panel">{children}</div>
        </StyledTileWithToolbar>
    )
}
