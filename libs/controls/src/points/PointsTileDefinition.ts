/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { PointsTile } from "./PointsTile"
import { DockTileDefinitionBuilder } from "../dock"
import { gbdbFacetIndicatorFactory } from "../gbdb/util"

export const PointsTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.POINTS)
    .name("Points")
    .placement(2, 0)
    .enableWithoutConnection()
    .render(
        () => createElement(PointsTile, {}, null),
        null,
        gbdbFacetIndicatorFactory("config", "points")
    )
    .build()
