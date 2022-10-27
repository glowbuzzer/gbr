/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { DockPerspectiveLayoutProviderProps } from "./types"
import { useDockContext } from "./hooks"
import { StyledDockLayout } from "./styles"
import { DockLayoutContext } from "./DockLayoutContext"
import * as React from "react"

export const DockPerspectiveLayoutProvider = ({
    tiles,
    perspectives,
    defaultPerspective,
    appName,
    children
}: DockPerspectiveLayoutProviderProps) => {
    const context = useDockContext(tiles, perspectives, defaultPerspective, appName)

    return (
        <StyledDockLayout>
            <DockLayoutContext.Provider value={context}>{children}</DockLayoutContext.Provider>
        </StyledDockLayout>
    )
}
