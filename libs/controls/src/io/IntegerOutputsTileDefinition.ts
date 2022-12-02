/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { IntegerOutputsTile } from "./IntegerOutputsTile"
import { IntegerOutputsTileHelp } from "./IntegerOutputsTileHelp"

export const IntegerOutputsTileDefinition = {
    id: GlowbuzzerTileIdentifiers.INTEGER_OUTPUTS,
    name: "Integer Outputs",
    defaultPlacement: {
        column: 2,
        row: 2
    },
    render: () => createElement(IntegerOutputsTile, {}, null),
    renderHelp: () => createElement(IntegerOutputsTileHelp, {}, null)
}
