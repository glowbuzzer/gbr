/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { IntegerInputsTile } from "./IntegerInputsTile"
import { IntegerInputsTileHelp } from "./IntegerInputsTileHelp"
import { DockTileDefinitionBuilder } from "../dock"

export const IntegerInputsTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.INTEGER_INPUTS)
    .name("Integer Inputs")
    .placement(2, 1)
    .render(
        () => createElement(IntegerInputsTile, {}, null),
        () => createElement(IntegerInputsTileHelp, {}, null)
    )
    .requiresConnection()
    .build()
