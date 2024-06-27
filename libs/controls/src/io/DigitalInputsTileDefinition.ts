/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { DigitalInputsTile } from "./DigitalInputsTile"
import { DigitalInputsTileHelp } from "./DigitalInputsTileHelp"
import { DockTileDefinitionBuilder } from "../dock"

export const DigitalInputsTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.DIGITAL_INPUTS)
    .name("Digital Inputs")
    .placement(2, 1)
    .render(
        () => createElement(DigitalInputsTile, {}, null),
        () => createElement(DigitalInputsTileHelp, {}, null)
    )
    .requiresConnection()
    .build()
