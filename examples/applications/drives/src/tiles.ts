/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { DockTileDefinitionBuilder } from "@glowbuzzer/controls"
import React from "react"
import { DrivesMoveTile } from "./DrivesMoveTile"

export const DrivesOscillatingMoveTileDefinition = DockTileDefinitionBuilder()
    .id("drives-oscillating-move")
    .name("Move Drives")
    .placement(0, 1)
    .render(() => React.createElement(DrivesMoveTile))
    .requiresOperationEnabled()
    .build()
