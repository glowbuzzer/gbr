/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { ToolsTile, ToolsTileHelp } from "./index"
import { ConnectTabButtons } from "../connect"
import { GbDbFacetIndicator } from "../gbdb/GbDbFacetIndicator"
import { DockTileDefinitionBuilder } from "../dock"
import { gbdbFacetIndicatorFactory } from "../gbdb/util"

export const ToolsTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.TOOLS)
    .name("Tools")
    .placement(2, 2)
    .render(() => createElement(ToolsTile), undefined, gbdbFacetIndicatorFactory("config", "tools"))
    .enableWithoutConnection()
    .build()
