/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { DockLayoutContext } from "./DockLayoutContext"
import { DockPerspective } from "./types"
import { useDockContext } from "./hooks"
import { StyledDockLayout } from "./styles"
import { DockTileDefinition } from "./DockTileDefinition"
import { ReactNode } from "react"
import { useAppName } from "../app"
import { StatusTray } from "../status/StatusTray"
import { StatusBar } from "../status/StatusBar"
import { StatusTrayProvider } from "../status/StatusTrayProvider"

type DockLayoutProviderProps = {
    /** The tiles that are available in the dock layout. */
    tiles: DockTileDefinition[]
    /** A list of tile ids that should be visible by default. If not specified, all tiles are visible. */
    defaultVisible?: string[]
    /** The children of the dock layout provider. This must include {@link DockLayout}. */
    children: ReactNode
}

/**
 * The dock layout provider is the root component of the dock layout. It provides the context for {@link DockLayout} and
 * the tiles contained within it.
 */
export const DockLayoutProvider = ({
    tiles,
    defaultVisible,
    children
}: DockLayoutProviderProps) => {
    const appName = useAppName()

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
            <StatusTrayProvider>
                <StatusBar />
                <StatusTray />
            </StatusTrayProvider>
        </StyledDockLayout>
    )
}
