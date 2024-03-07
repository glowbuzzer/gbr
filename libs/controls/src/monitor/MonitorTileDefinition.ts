/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { DockTileDefinitionBuilder } from "../dock"
import * as React from "react"
import { MonitorTile } from "./MonitorTile"

export const MonitorTileDefinition = DockTileDefinitionBuilder()
    .name("Connection Monitoring")
    .id("monitor")
    .enableWithoutConnection()
    .placement(2, 2)
    .render(() => React.createElement(MonitorTile))
    .build()
