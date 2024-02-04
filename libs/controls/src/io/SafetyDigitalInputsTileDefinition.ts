/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { SafetyDigitalInputsTile } from "./SafetyDigitalInputsTile"
import { SafetyDigitalInputsTileHelp } from "./SafetyDigitalInputsTileHelp"

export const SafetyDigitalInputsTileDefinition = {
    id: GlowbuzzerTileIdentifiers.SAFETY_DIGITAL_INPUTS,
    name: "Safety Digital Inputs",
    defaultPlacement: {
        column: 2,
        row: 1
    },
    render: () => createElement(SafetyDigitalInputsTile, {}, null),
    renderHelp: () => createElement(SafetyDigitalInputsTileHelp, {}, null)
}
