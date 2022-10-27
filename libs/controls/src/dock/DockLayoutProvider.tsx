/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { DockLayoutContext } from "./DockLayoutContext"
import { DockLayoutProviderProps, DockPerspective } from "./types"
import { useDockContext } from "./hooks"
import { StyledDockLayout } from "./styles"

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
        <StyledDockLayout>
            <DockLayoutContext.Provider value={context}>{children}</DockLayoutContext.Provider>
        </StyledDockLayout>
    )
}
