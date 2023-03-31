import { DockTileDefinitionBuilder } from "@glowbuzzer/controls"
import React from "react"
import { DemoTile } from "./DemoTile"

export const DemoTileDefinition = DockTileDefinitionBuilder()
    .id("sync-controls")
    .name("Demo")
    .placement(1, 1)
    .render(() => React.createElement(DemoTile))
    .build()
