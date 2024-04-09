/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { DockTileDefinitionBuilder } from ".."
import React, { createElement } from "react"
import { FlowTile } from "./FlowTile"
import { FlowContextProvider } from "./FlowContextProvider"
import { GbDbFacetIndicator } from "../gbdb/GbDbFacetIndicator"
import { gbdbFacetIndicatorFactory } from "../gbdb/util"

export const FlowTileDefinition = DockTileDefinitionBuilder()
    .id("flow")
    .name("Flow Maker")
    .placement(1, 1)
    .render(
        () => createElement(FlowContextProvider, { children: createElement(FlowTile) }),
        undefined,
        gbdbFacetIndicatorFactory("flow")
    )
    .enableWithoutConnection()
    .build()
