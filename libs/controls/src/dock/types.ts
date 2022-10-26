/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { DockTileDefinition } from "./DockTileDefinition"
import { ReactNode } from "react"

export type DockPerspective = {
    id: string
    name: string
    defaultVisible?: string[]
}

export type DockPerspectiveLayoutProviderProps = {
    appName: string
    tiles: DockTileDefinition[]
    perspectives: DockPerspective[]
    defaultPerspective: string
    children: ReactNode
}

export type DockLayoutProviderProps = {
    appName: string
    tiles: DockTileDefinition[]
    defaultVisible?: string[]
    children: ReactNode
}
