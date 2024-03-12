/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { DockTileDefinitionBuilder, GlowbuzzerTileIdentifiers } from "@glowbuzzer/controls"
import { PayloadTile } from "./PayloadTile"

export const PayloadTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.PAYLOAD)
    .name("Payload Tile")
    .placement(2, 1)
    .render(() => React.createElement(PayloadTile))
    .build()
