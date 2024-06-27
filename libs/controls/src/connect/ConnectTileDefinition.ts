/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createElement } from "react"
import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { ConnectTile } from "./ConnectTile"
import { ConnectTabButtons } from "./ConnectTabButtons"
import { ConnectTileHelp } from "./ConnectTileHelp"
import { DockTileDefinitionBuilder } from "../dock"

export const ConnectTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.CONNECT)
    .name("Connection")
    .render(
        () => createElement(ConnectTile, {}, null),
        () => createElement(ConnectTileHelp, {}, null),
        () => createElement(ConnectTabButtons, {}, null)
    )
    .placement(0, 0)
    .build()
