/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { DockTileDefinitionBuilder } from "@glowbuzzer/controls"
import React from "react"
import { DrivesMoveTile } from "./DrivesMoveTile"
import { SerialCommsTile } from "./SerialCommsTile"

export const DrivesOscillatingMoveTileDefinition = DockTileDefinitionBuilder()
    .id("drives-oscillating-move")
    .name("Move Drives")
    .placement(0, 1)
    .render(() => React.createElement(DrivesMoveTile))
    .build()

export const SerialCommsTileDefinition = DockTileDefinitionBuilder()
    .id("serial-comms")
    .name("Serial Comms")
    .placement(2, 2)
    .render(() => React.createElement(SerialCommsTile))
    .build()
