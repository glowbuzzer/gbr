/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { CartesianJogTile } from "./CartesianJogTile"

export const CartesianJogTileDefinition = {
    id: GlowbuzzerTileIdentifiers.JOG_CARTESIAN,
    name: "Cartesian Jog",
    defaultPlacement: {
        column: 0,
        row: 1
    },
    render: () => createElement(CartesianJogTile, {}, null)
}
