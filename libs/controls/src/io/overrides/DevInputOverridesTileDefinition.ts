/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { DockTileDefinitionBuilder, GlowbuzzerTileIdentifiers } from "../.."
import { createElement } from "react"
import { DevInputOverridesTile } from "./DevInputOverridesTile"

export const DevInputOverridesTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.DEV_INPUT_OVERRIDES)
    .name("Developer Input Overrides")
    .placement(2, 1)
    .render(() => createElement(DevInputOverridesTile, {}, null))
    .build()
