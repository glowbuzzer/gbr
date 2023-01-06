/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { PointsTile } from "./PointsTile"
import { DockTileDefinition } from "../dock"

export const PointsTileDefinition = {
    id: GlowbuzzerTileIdentifiers.POINTS,
    name: "Points",
    defaultPlacement: {
        column: 2,
        row: 0
    },
    render: () => createElement(PointsTile, {}, null),
    config: {
        enableWithoutConnection: "foo"
    }
}
