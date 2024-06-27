/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { JointDroTile } from "./JointDroTile"
import { JointDroTileHelp } from "./JointDroTileHelp"
import { DockTileDefinitionBuilder } from "../dock"

export const JointDroTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.JOINT_DRO)
    .name("Joint DRO")
    .render(
        () => createElement(JointDroTile, {}, null),
        () => createElement(JointDroTileHelp, {}, null)
    )
    .placement(0, 2)
    .requiresConnection()
    .build()
