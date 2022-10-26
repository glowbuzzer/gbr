/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import styled from "styled-components"
import { DockLayoutContext } from "./DockLayoutContext"
import {
    DockLayoutProviderProps,
    DockPerspective,
    DockPerspectiveLayoutProviderProps
} from "./types"
import { useDockContext } from "./hooks"

const StyledDiv = styled.div`
    padding: 10px;
    display: flex;
    gap: 10px;
    position: absolute;
    flex-direction: column;
    justify-content: stretch;
    height: 100vh;
    width: 100vw;

    .flexlayout__layout {
        position: relative;
        flex-grow: 1;
        border: 1px solid rgba(128, 128, 128, 0.27);
    }

    .flexlayout__tab_button--selected {
        background: none;
        border-bottom: 1px solid #1890ff;
    }

    .help-popover {
        visibility: hidden;
    }

    .flexlayout__tabset-selected {
        .flexlayout__tab_button--selected {
            background-color: var(--color-tab-selected-background);
            border-bottom: none;
        }

        .help-popover {
            visibility: visible;
        }
    }
`

export const DockPerspectiveLayoutProvider = ({
    tiles,
    perspectives,
    defaultPerspective,
    appName,
    children
}: DockPerspectiveLayoutProviderProps) => {
    const context = useDockContext(tiles, perspectives, defaultPerspective, appName)

    return (
        <StyledDiv>
            <DockLayoutContext.Provider value={context}>{children}</DockLayoutContext.Provider>
        </StyledDiv>
    )
}

export const DockLayoutProvider = ({
    appName,
    tiles,
    defaultVisible,
    children
}: DockLayoutProviderProps) => {
    // create a single 'default' perspective
    const perspective: DockPerspective = {
        id: "default",
        name: "Default",
        defaultVisible
    }
    const context = useDockContext(tiles, [perspective], "default", appName)

    return (
        <StyledDiv>
            <DockLayoutContext.Provider value={context}>{children}</DockLayoutContext.Provider>
        </StyledDiv>
    )
}
