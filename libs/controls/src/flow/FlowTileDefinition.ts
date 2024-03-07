/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { DockTileDefinitionBuilder } from ".."
import React from "react"
import { FlowTile } from "./FlowTile"

export const FlowTileDefinition = DockTileDefinitionBuilder()
    .id("flow")
    .name("Flow Maker")
    .placement(1, 1)
    .render(() => React.createElement(FlowTile))
    .enableWithoutConnection()
    .build()
