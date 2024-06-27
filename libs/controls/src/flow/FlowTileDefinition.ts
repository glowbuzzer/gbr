/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { DockTileDefinitionBuilder } from ".."
import React, { createElement } from "react"
import { FlowTile } from "./FlowTile"
import { FlowContextProvider } from "./FlowContextProvider"
import { GbdbFacetIndicator } from "../gbdb/GbdbFacetIndicator"
import { gbdbFacetIndicatorFactory } from "../gbdb/util"

export const FlowTileDefinition = DockTileDefinitionBuilder()
    .id("flow")
    .name("Flow Maker")
    .render(
        () => createElement(FlowContextProvider, { children: createElement(FlowTile) }),
        undefined,
        gbdbFacetIndicatorFactory("flow")
    )
    .placement(1, 1)
    .build()
