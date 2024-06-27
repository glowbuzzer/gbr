/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { AnalogInputsTile } from "./AnalogInputsTile"
import { AnalogInputsTileHelp } from "./AnalogInputsTileHelp"
import { DockTileDefinitionBuilder } from "../dock"

export const AnalogInputsTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.ANALOG_INPUTS)
    .name("Analog Inputs")
    .placement(2, 1)
    .render(
        () => createElement(AnalogInputsTile, {}, null),
        () => createElement(AnalogInputsTileHelp, {}, null)
    )
    .requiresConnection()
    .build()
