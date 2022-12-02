/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { ToolsTile, ToolsTileHelp } from "./index"

export const ToolsTileDefinition = {
    id: GlowbuzzerTileIdentifiers.TOOLS,
    name: "Tools",
    defaultPlacement: {
        column: 2,
        row: 2
    },
    render: () => createElement(ToolsTile, {}, null),
    renderHelp: () => createElement(ToolsTileHelp, {}, null)
}
