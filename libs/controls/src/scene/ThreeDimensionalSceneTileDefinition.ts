/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { ThreeDimensionalSceneTileHelp } from "./ThreeDimensionalSceneTileHelp"
import { ThreeDimensionalSceneTile } from "./ThreeDimensionalSceneTile"
import { TrackPosition } from "./TrackPosition"
import { Frustum } from "./Frustum"
import { DockTileDefinitionBuilder } from "../dock"

function renderThreeDimensionalSceneWithFrustum() {
    return createElement(
        ThreeDimensionalSceneTile,
        {},
        createElement(TrackPosition, { kinematicsConfigurationIndex: 0 }, createElement(Frustum))
    )
}

export const ThreeDimensionalSceneTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.THREE_DIMENSIONAL_SCENE)
    .name("3D Scene")
    .placement(1, 0)
    .render(
        () => renderThreeDimensionalSceneWithFrustum(),
        () => createElement(ThreeDimensionalSceneTileHelp, {}, null)
    )
    .enableWithoutConnection()
    .build()
