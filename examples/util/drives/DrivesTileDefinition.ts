/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { DockTileDefinitionBuilder } from "@glowbuzzer/controls"
import React from "react"
import { DrivesTile } from "./DrivesTile"

export const DrivesTileDefinition = DockTileDefinitionBuilder()
    .id("drives")
    .name("Drives")
    .placement(1, 0)
    .render(() => React.createElement(DrivesTile))
    .enableWithoutConnection()
    .build()
