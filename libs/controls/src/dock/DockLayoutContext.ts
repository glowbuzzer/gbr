/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Model } from "flexlayout-react"
import { TabNode } from "flexlayout-react/src/model/TabNode"
import * as React from "react"
import { createContext } from "react"
import { DockTileDefinition } from "./DockTileDefinition"
import { DockPerspective } from "@glowbuzzer/controls"

export type DockLayoutContextType = {
    appName: string
    model: Model
    factory: (node: TabNode) => React.ReactNode
    settingsFactory: (node: TabNode) => React.ReactNode
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
