/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { TelemetryTile } from "./TelemetryTile"
import { TelemetryTileSettings } from "./TelemetryTileSettings"

export const TelemetryTileDefinition = {
    id: GlowbuzzerTileIdentifiers.TELEMETRY,
    name: "Telemetry",
    defaultPlacement: {
        column: 0,
        row: 2
    },
    render: () => createElement(TelemetryTile, {}, null),
    renderSettings: () => TelemetryTileSettings
}
