/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { IntegerOutputsTile } from "./IntegerOutputsTile"
import { IntegerOutputsTileHelp } from "./IntegerOutputsTileHelp"
import { DockTileDefinitionBuilder } from "../dock"

export const IntegerOutputsTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.INTEGER_OUTPUTS)
    .name("Integer Outputs")
    .placement(2, 2)
    .render(
        () => createElement(IntegerOutputsTile, {}, null),
        () => createElement(IntegerOutputsTileHelp, {}, null)
    )
    .requiresOperationEnabled()
    .build()
