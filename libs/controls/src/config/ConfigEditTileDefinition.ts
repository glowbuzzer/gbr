/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { ConfigEditTile } from "./ConfigEditTile"

export const ConfigEditTileDefinition = {
    id: GlowbuzzerTileIdentifiers.CONFIG_EDIT,
    name: "Config Editor",
    defaultPlacement: {
        column: 2,
        row: 1
    },
    render: () => createElement(ConfigEditTile, {}, null)
}
