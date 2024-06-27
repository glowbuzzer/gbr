/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { DockTileDefinitionBuilder } from "../dock"
import { gbdbFacetIndicatorFactory } from "../gbdb"
import { ToolsTile } from "./ToolsTile"

export const ToolsTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.TOOLS)
    .name("Tools")
    .render(() => createElement(ToolsTile), undefined, gbdbFacetIndicatorFactory("config", "tools"))
    .placement(2, 2)
    .build()
