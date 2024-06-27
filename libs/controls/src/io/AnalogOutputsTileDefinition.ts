/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { AnalogOutputsTile } from "./AnalogOutputsTile"
import { AnalogOutputsTileHelp } from "./AnalogOutputsTileHelp"
import { DockTileDefinitionBuilder } from "../dock"

export const AnalogOutputsTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.ANALOG_OUTPUTS)
    .name("Analog Outputs")
    .placement(2, 2)
    .render(
        () => createElement(AnalogOutputsTile, {}, null),
        () => createElement(AnalogOutputsTileHelp, {}, null)
    )
    .requiresOperationEnabled()
    .build()
