/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { DockTileDefinitionBuilder } from "../../dock"
import { createElement } from "react"
import { FlowRuntimeTile } from "./FlowRuntimeTile"
import { gbdbFacetIndicatorFactory } from "../../gbdb"
import { FlowContextProvider } from "../FlowContextProvider"
import { FlowMakerCapability } from "../FlowMakerCapability"

export const FlowRuntimeTileDefinition = DockTileDefinitionBuilder()
    .id("flow-runtime")
    .name("Flow Runner")
    .render(
        () => createElement(FlowContextProvider, { children: createElement(FlowRuntimeTile) }),
        undefined,
        gbdbFacetIndicatorFactory("flow")
    )
    .requiresCapability(FlowMakerCapability.RUN)
    .placement(1, 1)
    .build()
