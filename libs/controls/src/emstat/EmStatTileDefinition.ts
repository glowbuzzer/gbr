/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { EmStatTile } from "./EmStatTile"
import { DockTileDefinition, DockTileDefinitionBuilder } from "../dock"

export const EmStatTileDefinition: DockTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.EMSTAT)
    .name("EtherCAT Master Status")
    .render(() => createElement(EmStatTile, {}, null))
    .placement(1, 0)
    .build()
