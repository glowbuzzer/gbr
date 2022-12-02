/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { SpindleTile } from "./SpindleTile"

export const SpindleTileDefinition = {
    id: GlowbuzzerTileIdentifiers.SPINDLE,
    name: "Spindle",
    defaultPlacement: {
        column: 2,
        row: 0
    },
    render: () => createElement(SpindleTile, {}, null)
}
