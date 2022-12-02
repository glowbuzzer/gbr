/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { DigitalInputsTile } from "./DigitalInputsTile"
import { DigitalInputsTileHelp } from "./DigitalInputsTileHelp"

export const DigitalInputsTileDefinition = {
    id: GlowbuzzerTileIdentifiers.DIGITAL_INPUTS,
    name: "Digital Inputs",
    defaultPlacement: {
        column: 2,
        row: 1
    },
    render: () => createElement(DigitalInputsTile, {}, null),
    renderHelp: () => createElement(DigitalInputsTileHelp, {}, null)
}
