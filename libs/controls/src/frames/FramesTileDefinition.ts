/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { FramesTile } from "./FramesTile"
import { DockTileDefinitionBuilder } from "../dock"
import { gbdbFacetIndicatorFactory } from "../gbdb/util"

export const FramesTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.FRAMES)
    .name("Frames")
    .render(
        () => createElement(FramesTile, {}, null),
        null,
        gbdbFacetIndicatorFactory("config", "frames")
    )
    .placement(2, 0)
    .build()
