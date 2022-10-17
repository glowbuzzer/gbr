/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Model } from "flexlayout-react"
import { TabNode } from "flexlayout-react/src/model/TabNode"
import * as React from "react"
import { createContext } from "react"
import { GlowbuzzerDockComponentDefinition } from "./GlowbuzzerDockComponentDefinition"

export type GlowbuzzerDockLayoutContextType = {
    model: Model
    factory: (node: TabNode) => React.ReactNode
    settingsFactory: (node: TabNode) => React.ReactNode
    headerFactory: (node: TabNode) => React.ReactNode
    buttonsFactory: (node: TabNode) => React.ReactNode
    helpFactory: (node: TabNode) => React.ReactNode
    components: { [index: string]: Partial<GlowbuzzerDockComponentDefinition> }
    updateModel(model: Model): void
    resetLayout(): void
    showComponent(id: string, show: boolean): void
}
export const GlowbuzzerDockLayoutContext = createContext<GlowbuzzerDockLayoutContextType>(null)
