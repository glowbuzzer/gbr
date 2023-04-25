/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { DockTileDefinitionBuilder } from "@glowbuzzer/controls"
import React from "react"
import { DrivesTile } from "./DrivesTile"
import { DrivesMoveTile } from "./DrivesMoveTile"

export const DrivesTileDefinition = DockTileDefinitionBuilder()
    .id("drives")
    .name("Drives")
    .placement(1, 0)
    .render(() => React.createElement(DrivesTile))
    .build()

export const DrivesOscillatingMoveTileDefinition = DockTileDefinitionBuilder()
    .id("drives-oscillating-move")
    .name("Move Drives")
    .placement(0, 1)
    .render(() => React.createElement(DrivesMoveTile))
    .build()
