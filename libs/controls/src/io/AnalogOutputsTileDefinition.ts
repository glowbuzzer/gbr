/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { AnalogOutputsTile } from "./AnalogOutputsTile"
import { AnalogOutputsTileHelp } from "./AnalogOutputsTileHelp"

export const AnalogOutputsTileDefinition = {
    id: GlowbuzzerTileIdentifiers.ANALOG_OUTPUTS,
    name: "Analog Outputs",
    defaultPlacement: {
        column: 2,
        row: 2
    },
    render: () => createElement(AnalogOutputsTile, {}, null),
    renderHelp: () => createElement(AnalogOutputsTileHelp, {}, null)
}
