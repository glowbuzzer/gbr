/*
 * Copyright (c) 2022-2024. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { JointJogTile } from "./JointJogTile"

export const JointJogTileDefinition = {
    id: GlowbuzzerTileIdentifiers.JOG_JOINT,
    name: "Joint Jog",
    defaultPlacement: {
        column: 0,
        row: 1
    },
    render: () => createElement(JointJogTile, {}, null)
}
