/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { StateMachineToolsTile } from "./StateMachineToolsTile"
import { StateMachineToolsTileHelp } from "./StateMachineToolsTileHelp"
import { DockTileDefinitionBuilder } from "../dock"

export const StateMachineToolsTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.STATE_MACHINE_TOOLS)
    .name("State Machine Tools")
    .render(
        () => createElement(StateMachineToolsTile, {}, null),
        () => createElement(StateMachineToolsTileHelp, {}, null)
    )
    .placement(0, 2)
    .build()
