/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { CartesianDroTile } from "./CartesianDroTile"
import { CartesianDroTileHelp } from "./CartesianDroTileHelp"

export const CartesianDroTileDefinition = {
    id: GlowbuzzerTileIdentifiers.CARTESIAN_DRO,
    name: "Cartesian DRO",
    defaultPlacement: {
        column: 0,
        row: 2
    },
    render: () => createElement(CartesianDroTile, {}, null),
    renderHelp: () => createElement(CartesianDroTileHelp, {}, null)
}
