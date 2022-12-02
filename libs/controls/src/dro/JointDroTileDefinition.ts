/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { JointDroTile } from "./JointDroTile"
import { JointDroTileHelp } from "./JointDroTileHelp"

export const JointDroTileDefinition = {
    id: GlowbuzzerTileIdentifiers.JOINT_DRO,
    name: "Joint DRO",
    defaultPlacement: {
        column: 0,
        row: 2
    },
    render: () => createElement(JointDroTile, {}, null),
    renderHelp: () => createElement(JointDroTileHelp, {}, null)
}
