/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { TelemetryTile } from "./TelemetryTile"
import { DockTileDefinitionBuilder } from "../dock"

export const TelemetryTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.TELEMETRY)
    .name("Telemetry")
    .placement(1, 1)
    .render(() => createElement(TelemetryTile, {}, null))
    .requiresConnection()
    .build()
