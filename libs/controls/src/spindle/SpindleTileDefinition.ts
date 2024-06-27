/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { SpindleTile } from "./SpindleTile"
import { DockTileDefinitionBuilder } from "../dock"

export const SpindleTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.SPINDLE)
    .name("Spindle")
    .placement(2, 0)
    .render(() => createElement(SpindleTile, {}, null))
    .requiresConnection()
    .build()
