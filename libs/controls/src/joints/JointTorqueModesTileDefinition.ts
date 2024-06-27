/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createElement } from "react"
import { DockTileDefinitionBuilder, GlowbuzzerTileIdentifiers } from ".."
import { JointTorqueModesTile } from "./JointTorqueModesTile"

export const JointTorqueModesTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.JOINT_TORQUE_MODES)
    .name("Joint Torque Mode")
    .placement(0, 1)
    .render(() => createElement(JointTorqueModesTile, {}, null))
    .requiresOperationEnabled()
    .build()
