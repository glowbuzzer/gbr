/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { StateMachineToolsTile } from "./StateMachineToolsTile"
import { StateMachineToolsTileHelp } from "./StateMachineToolsTileHelp"

export const StateMachineToolsTileDefinition = {
    id: GlowbuzzerTileIdentifiers.STATE_MACHINE_TOOLS,
    name: "State Machine Tools",
    defaultPlacement: {
        column: 0,
        row: 2
    },
    render: () => createElement(StateMachineToolsTile, {}, null),
    renderHelp: () => createElement(StateMachineToolsTileHelp, {}, null),
    excludeByDefault: true
}
