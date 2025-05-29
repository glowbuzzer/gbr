import * as React from "react"
import { createElement, Suspense } from "react"
import {
    CartesianDroTileDefinition,
    CartesianJogTile,
    DockLayout,
    DockLayoutProvider,
    DockTileDefinitionBuilder,
    FeedRateTileDefinition,
    FramesTileDefinition,
    GlowbuzzerTileIdentifiers,
    JointDroTileDefinition,
    PointsTileDefinition,
    TelemetryTileDefinition,
    ThreeDimensionalSceneTile,
    ThreeDimensionalSceneTileDefinition
} from "@glowbuzzer/controls"
import { ExampleAppMenu } from "../../../util/ExampleAppMenu"
import { PlaneShinyMetal } from "../../../util/PlaneShinyMetal"
import { DefaultEnvironment } from "../../../util/DefaultEnvironment"
import { AgvModel } from "./scene/AgvOmni"
import { AgvSampleTile } from "./AgvSampleTile"
import { AgvJogTileDefinition } from "./AgvJogTile"
import { AgvTracks } from "./scene/AgvTracks"
import { LoadedRobot } from "./scene/Robot"

const AgvSceneTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return (
            <ThreeDimensionalSceneTile hideTrace hidePreview>
                <Suspense fallback={null}>
                    <AgvModel>
                        <LoadedRobot />
                    </AgvModel>
                    <AgvTracks />
                </Suspense>
                <PlaneShinyMetal />
                <DefaultEnvironment />
            </ThreeDimensionalSceneTile>
        )
    })
    .build()

const AgvSampleTileDefinition = DockTileDefinitionBuilder()
    .id("agv-sample")
    .name("AGV Sample Moves")
    .placement(2, 1)
    .render(() => <AgvSampleTile />)
    .build()

export const CartesianJogTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.JOG_CARTESIAN)
    .name("Robot Jog")
    .placement(0, 1)
    .render(() => createElement(CartesianJogTile, { kinematicsConfigurationIndex: 0 }, null))
    .requiresOperationEnabled()
    .build()

export const App = () => {
    return (
        <DockLayoutProvider
            tiles={[
                CartesianJogTileDefinition,
                AgvJogTileDefinition,
                CartesianDroTileDefinition,
                JointDroTileDefinition,
                PointsTileDefinition,
                FramesTileDefinition,
                FeedRateTileDefinition,
                TelemetryTileDefinition,
                AgvSceneTileDefinition,
                AgvSampleTileDefinition
            ]}
        >
            <ExampleAppMenu title="AGV Demo" />
            <DockLayout />
        </DockLayoutProvider>
    )
}
