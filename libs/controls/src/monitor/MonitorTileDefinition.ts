/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { DockTileDefinitionBuilder } from "../dock"
import * as React from "react"
import { MonitorTile } from "./MonitorTile"

export const MonitorTileDefinition = DockTileDefinitionBuilder()
    .name("Connection Monitoring")
    .id("monitor")
    .render(() => React.createElement(MonitorTile))
    .placement(2, 2)
    .requiresConnection()
    .build()
