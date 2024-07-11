/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { DockTileDefinition, DockTileDefinitionBuilder } from "../dock"
import { DiagnosticsTile } from "./DiagnosticsTile"

export const DiagnosticsTileDefinition: DockTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.DIAGNOSTICS)
    .name("Diagnostics")
    .render(() => createElement(DiagnosticsTile, {}, null))
    .placement(1, 0)
    .build()
