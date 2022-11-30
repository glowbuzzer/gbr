/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Model, TabNode } from "flexlayout-react"
import * as React from "react"
import { createContext } from "react"
import { DockTileDefinition } from "./DockTileDefinition"
import { DockPerspective } from "./types"

export type DockLayoutContextType = {
    appName: string
    model: Model
    factory: (node: TabNode) => React.ReactNode
    settingsFactory: (node: TabNode) => ({ open, onClose }) => JSX.Element
    headerFactory: (node: TabNode) => React.ReactNode
    buttonsFactory: (node: TabNode) => React.ReactNode
    helpFactory: (node: TabNode) => React.ReactNode
    tiles: (Partial<DockTileDefinition> & { id: string })[]
    perspectives: DockPerspective[]
    currentPerspective: string
    changePerspective: (perspective: string) => void
    updateModel(model: Model): void
    resetLayout(): void
    showTile(id: string, show: boolean): void
}

export const DockLayoutContext = createContext<DockLayoutContextType>(null)
