/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { DockTileDefinitionBuilder } from ".."
import React, { createElement } from "react"
import { FlowTile } from "./FlowTile"
import { FlowContextProvider } from "./FlowContextProvider"

export const FlowTileDefinition = DockTileDefinitionBuilder()
    .id("flow")
    .name("Flow Maker")
    .placement(1, 1)
    .render(() => createElement(FlowContextProvider, { children: createElement(FlowTile) }))
    .enableWithoutConnection()
    .build()
