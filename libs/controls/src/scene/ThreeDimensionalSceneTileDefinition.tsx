/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { ThreeDimensionalSceneTileHelp } from "./ThreeDimensionalSceneTileHelp"
import { ThreeDimensionalSceneTile } from "./ThreeDimensionalSceneTile"
import { TrackPosition } from "./TrackPosition"
import { Frustum } from "./Frustum"

export const ThreeDimensionalSceneTileDefinition = {
    id: GlowbuzzerTileIdentifiers.THREE_DIMENSIONAL_SCENE,
    name: "3D Scene",
    enableClose: false,
    defaultPlacement: {
        column: 1,
        row: 0
    },
    render: () => (
        <ThreeDimensionalSceneTile>
            <TrackPosition kinematicsConfigurationIndex={0}>
                <Frustum />
            </TrackPosition>
        </ThreeDimensionalSceneTile>
    ),
    renderHelp: () => createElement(ThreeDimensionalSceneTileHelp, {}, null),
    config: {
        enableWithoutConnection: true
    }
}
