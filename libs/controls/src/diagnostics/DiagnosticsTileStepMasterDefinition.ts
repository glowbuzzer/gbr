/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { DockTileDefinition, DockTileDefinitionBuilder } from "../dock"
import { DiagnosticsTile } from "./DiagnosticsTile"
import { DiagnosticsTileStepMaster } from "./DiagnosticsTileStepMaster"

export const DiagnosticsTileStepMasterDefinition: DockTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.DIAGNOSTICS)
    .name("Diagnostics")
    .render(() => createElement(DiagnosticsTileStepMaster, {}, null))
    .placement(1, 0)
    .build()
