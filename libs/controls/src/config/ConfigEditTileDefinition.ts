/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { ConfigEditTile } from "./ConfigEditTile"
import { ConfigEditTile2 } from "./ConfigEditTile2"
import { DockTileDefinitionBuilder } from "../dock"

// export const ConfigEditTileDefinition = {
//     id: GlowbuzzerTileIdentifiers.CONFIG_EDIT,
//     name: "Config Editor",
//     defaultPlacement: {
//         column: 2,
//         row: 1
//     },
//     config: {
//         enableWithoutConnection: true
//     },
//     render: () => createElement(ConfigEditTile2, {}, null)
// }

export const ConfigEditTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.CONFIG_EDIT)
    .name("Config Editor")
    .placement(1, 0)
    .enableWithoutConnection()
    .render(() => createElement(ConfigEditTile2, {}, null), null)
    .build()
