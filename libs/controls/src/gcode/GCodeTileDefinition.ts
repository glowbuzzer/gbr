/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { GCodeTile } from "./GCodeTile"
import { GCodeTileHelp } from "./GCodeTileHelp"
import { DockTileDefinitionBuilder } from "../dock"

export const GCodeTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.GCODE)
    .name("GCode")
    .placement(1, 1)
    .render(
        () => createElement(GCodeTile, {}, null),
        () => createElement(GCodeTileHelp, {}, null)
    )
    .build()
