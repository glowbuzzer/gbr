/*
 * Copyright (c) 2022-2024. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { JointJogTile } from "./JointJogTile"
import { DockTileDefinitionBuilder } from "../../dock"
import { CartesianJogTile } from "../cartesian/CartesianJogTile"

export const JointJogTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.JOG_JOINT)
    .name("Joint Jog")
    .placement(0, 1)
    .render(() => createElement(JointJogTile, {}, null))
    .requiresOperationEnabled()
    .build()
