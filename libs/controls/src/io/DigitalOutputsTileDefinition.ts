/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { DigitalOutputsTile } from "./DigitalOutputsTile"
import { DigitalOutputsTileHelp } from "./DigitalOutputsTileHelp"

export const DigitalOutputsTileDefinition = {
    id: GlowbuzzerTileIdentifiers.DIGITAL_OUTPUTS,
    name: "Digital Outputs",
    defaultPlacement: {
        column: 2,
        row: 2
    },
    render: () => createElement(DigitalOutputsTile, {}, null),
    renderHelp: () => createElement(DigitalOutputsTileHelp, {}, null)
}
