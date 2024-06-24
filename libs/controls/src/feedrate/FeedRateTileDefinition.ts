/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { FeedRateTile } from "./FeedRateTile"
import { FeedRateTileHelp } from "./FeedRateTileHelp"
import { DockTileDefinitionBuilder } from "../dock"

export const FeedRateTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.FEEDRATE)
    .name("Feedrate")
    .placement(2, 0)
    .render(
        () => createElement(FeedRateTile, {}, null),
        () => createElement(FeedRateTileHelp, {}, null)
    )
    .requiresOperationEnabled()
    .build()
