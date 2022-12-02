/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { FramesTile } from "./FramesTile"

export const FramesTileDefinition = {
    id: GlowbuzzerTileIdentifiers.FRAMES,
    name: "Frames",
    defaultPlacement: {
        column: 2,
        row: 0
    },
    render: () => createElement(FramesTile, {}, null)
}
