/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { EmStatTab } from "./EmStatTab"
import { DockTileDefinition, DockTileDefinitionBuilder } from "../dock"

export const EmStatTileDefinition: DockTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.EMSTAT)
    .name("EtherCAT Master Status")
    .render(() => createElement(EmStatTab, {}, null))
    .placement(1, 0)
    .build()
