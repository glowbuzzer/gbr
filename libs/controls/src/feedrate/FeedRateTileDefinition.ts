/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { FeedRateTile } from "./FeedRateTile"
import { FeedRateTileHelp } from "./FeedRateTileHelp"

export const FeedRateTileDefinition = {
    id: GlowbuzzerTileIdentifiers.FEEDRATE,
    name: "Feedrate",
    defaultPlacement: {
        column: 2,
        row: 0
    },
    render: () => createElement(FeedRateTile, {}, null),
    renderHelp: () => createElement(FeedRateTileHelp, {}, null)
}
