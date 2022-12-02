/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { PointsTile } from "./PointsTile"

export const PointsTileDefinition = {
    id: GlowbuzzerTileIdentifiers.POINTS,
    name: "Points",
    defaultPlacement: {
        column: 2,
        row: 0
    },
    render: () => createElement(PointsTile, {}, null)
}
