/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { CartesianDroTile } from "./CartesianDroTile"
import { CartesianDroTileHelp } from "./CartesianDroTileHelp"
import { DockTileDefinitionBuilder } from "../dock"

export const CartesianDroTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.CARTESIAN_DRO)
    .name("Cartesian DRO")
    .placement(0, 2)
    .render(
        () => createElement(CartesianDroTile, {}, null),
        () => createElement(CartesianDroTileHelp, {}, null)
    )
    .build()
