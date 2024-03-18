/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../.."
import { createElement } from "react"
import { DevInputOverridesTile } from "./DevInputOverridesTile"

export const DevInputOverridesTileDefinition = {
    id: GlowbuzzerTileIdentifiers.DEV_INPUT_OVERRIDES,
    name: "Developer Input Overrides",
    defaultPlacement: {
        column: 2,
        row: 1
    },
    render: () => createElement(DevInputOverridesTile, {}, null)
}
