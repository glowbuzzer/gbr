/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { SafetyDigitalOutputsTile } from "./SafetyDigitalOutputsTile"
import { SafetyDigitalOutputsTileHelp } from "./SafetyDigitalOutputsTileHelp"
import { DockTileDefinitionBuilder } from "../dock"

export const SafetyDigitalOutputsTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.SAFETY_DIGITAL_OUTPUTS)
    .name("Safety Digital Outputs")
    .placement(2, 2)
    .render(
        () => createElement(SafetyDigitalOutputsTile, {}, null),
        () => createElement(SafetyDigitalOutputsTileHelp, {}, null)
    )
    .requiresConnection()
    .build()
