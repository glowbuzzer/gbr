/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Tile } from "../tiles"
import * as React from "react"
import { JointDro } from "./JointDro"

/**
 * The joint DRO tile displays all configured joints with joint position.
 * If the joint is finite, a read-only slider will be displayed next to the joint position.
 *
 * If the joint has negative and positive limits and the current position is close to or beyond a limit, the
 * value will be highlighted in red.
 */
export const JointDroTile = () => {
    return (
        <Tile title="Joint DRO">
            <JointDro warningThreshold={0.05} />
        </Tile>
    )
}
