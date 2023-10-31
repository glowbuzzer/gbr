/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createElement } from "react"
import { GlowbuzzerTileIdentifiers } from ".."
import { JointTorqueModesTile } from "./JointTorqueModesTile"

export const JointTorqueModesTileDefinition = {
    id: GlowbuzzerTileIdentifiers.JOINT_TORQUE_MODES,
    name: "Joint Torque Mode",
    defaultPlacement: {
        column: 0,
        row: 1
    },
    render: () => createElement(JointTorqueModesTile, {}, null)
}
