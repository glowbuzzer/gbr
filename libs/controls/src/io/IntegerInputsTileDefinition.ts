/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { IntegerInputsTile } from "./IntegerInputsTile"
import { IntegerInputsTileHelp } from "./IntegerInputsTileHelp"

export const IntegerInputsTileDefinition = {
    id: GlowbuzzerTileIdentifiers.INTEGER_INPUTS,
    name: "Integer Inputs",
    defaultPlacement: {
        column: 2,
        row: 1
    },
    render: () => createElement(IntegerInputsTile, {}, null),
    renderHelp: () => createElement(IntegerInputsTileHelp, {}, null)
}
