/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { GCodeTile } from "./GCodeTile"
import { GCodeTileHelp } from "./GCodeTileHelp"

export const GCodeTileDefinition = {
    id: GlowbuzzerTileIdentifiers.GCODE,
    name: "GCode",
    defaultPlacement: {
        column: 1,
        row: 1
    },
    render: () => createElement(GCodeTile, {}, null),
    renderHelp: () => createElement(GCodeTileHelp, {}, null)
}
