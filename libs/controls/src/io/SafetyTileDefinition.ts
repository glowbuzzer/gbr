/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { SafetyTile } from "./SafetyTile"
import { SafetyTileHelp } from "./SafetyTileHelp"
import { DockTileDefinitionBuilder } from "../dock"

export const SafetyTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.SAFETY)
    .name("Safety")
    .placement(2, 1)
    .render(
        () => createElement(SafetyTile, {}, null),
        () => createElement(SafetyTileHelp, {}, null)
    )
    .requiresConnection()
    .build()
