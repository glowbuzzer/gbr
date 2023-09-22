/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { EmStatTile } from "./EmStatTile"

export const EmStatTileDefinition = {
    id: GlowbuzzerTileIdentifiers.EMSTAT,
    name: "EtherCAT Master Status",
    defaultPlacement: {
        column: 0,
        row: 2
    },
    render: () => createElement(EmStatTile, {}, null)
}
