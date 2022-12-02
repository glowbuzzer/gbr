/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { AnalogInputsTile } from "./AnalogInputsTile"
import { AnalogInputsTileHelp } from "./AnalogInputsTileHelp"

export const AnalogInputsTileDefinition = {
    id: GlowbuzzerTileIdentifiers.ANALOG_INPUTS,
    name: "Analog Inputs",
    defaultPlacement: {
        column: 2,
        row: 1
    },
    render: () => createElement(AnalogInputsTile, {}, null),
    renderHelp: () => createElement(AnalogInputsTileHelp, {}, null)
}
