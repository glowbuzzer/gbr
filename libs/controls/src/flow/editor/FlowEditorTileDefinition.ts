/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { DockTileDefinitionBuilder } from "../../index"
import { createElement } from "react"
import { FlowEditorTile } from "./FlowEditorTile"
import { FlowContextProvider } from "../FlowContextProvider"
import { gbdbFacetIndicatorFactory } from "../../gbdb"
import { FlowMakerCapability } from "../FlowMakerCapability"

export const FlowEditorTileDefinition = DockTileDefinitionBuilder()
    .id("flow-edit")
    .name("Flow Editor")
    .render(
        () => createElement(FlowContextProvider, { children: createElement(FlowEditorTile) }),
        undefined,
        gbdbFacetIndicatorFactory("flow")
    )
    .requiresCapability(FlowMakerCapability.EDIT)
    .placement(1, 1)
    .build()
