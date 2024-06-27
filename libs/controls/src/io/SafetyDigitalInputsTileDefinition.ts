/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { SafetyDigitalInputsTile } from "./SafetyDigitalInputsTile"
import { SafetyDigitalInputsTileHelp } from "./SafetyDigitalInputsTileHelp"
import { DockTileDefinitionBuilder } from "../dock"

export const SafetyDigitalInputsTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.SAFETY_DIGITAL_INPUTS)
    .name("Safety Digital Inputs")
    .placement(2, 1)
    .render(
        () => createElement(SafetyDigitalInputsTile, {}, null),
        () => createElement(SafetyDigitalInputsTileHelp, {}, null)
    )
    .requiresConnection()
    .build()
