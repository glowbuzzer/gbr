/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { SafetyDigitalOutputsTile } from "./SafetyDigitalOutputsTile"
import { SafetyDigitalOutputsTileHelp } from "./SafetyDigitalOutputsTileHelp"

export const SafetyDigitalOutputsTileDefinition = {
    id: GlowbuzzerTileIdentifiers.SAFETY_DIGITAL_OUTPUTS,
    name: "Safety Digital Outputs",
    defaultPlacement: {
        column: 2,
        row: 2
    },
    enableWithoutConnection: true,
    render: () => createElement(SafetyDigitalOutputsTile, {}, null),
    renderHelp: () => createElement(SafetyDigitalOutputsTileHelp, {}, null)
}
