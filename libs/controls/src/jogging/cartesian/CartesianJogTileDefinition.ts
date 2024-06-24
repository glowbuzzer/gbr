/*
 * Copyright (c) 2022-2024. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { CartesianJogTile } from "./CartesianJogTile"
import { DockTileDefinitionBuilder } from "../../dock"

export const CartesianJogTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.JOG_CARTESIAN)
    .name("Cartesian Jog")
    .placement(0, 1)
    .render(() => createElement(CartesianJogTile, {}, null))
    // .modeBehaviour((connected, op) => {
    //     return {
    //         disabled: !connected || !op,
    //         overlay: null
    //     }
    // })
    .build()
