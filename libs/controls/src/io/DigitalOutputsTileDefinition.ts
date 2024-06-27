/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { DigitalOutputsTile } from "./DigitalOutputsTile"
import { DigitalOutputsTileHelp } from "./DigitalOutputsTileHelp"
import { DockTileDefinitionBuilder } from "../dock"

export const DigitalOutputsTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.DIGITAL_OUTPUTS)
    .name("Digital Outputs")
    .placement(2, 2)
    .render(
        () => createElement(DigitalOutputsTile, {}, null),
        () => createElement(DigitalOutputsTileHelp, {}, null)
    )
    .requiresOperationEnabled()
    .build()
