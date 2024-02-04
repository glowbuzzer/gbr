/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { SafetyTile } from "./SafetyTile"
import { SafetyTileHelp } from "./SafetyTileHelp"

export const SafetyTileDefinition = {
    id: GlowbuzzerTileIdentifiers.SAFETY,
    name: "Safety",
    defaultPlacement: {
        column: 2,
        row: 1
    },
    render: () => createElement(SafetyTile, {}, null),
    renderHelp: () => createElement(SafetyTileHelp, {}, null)
}
