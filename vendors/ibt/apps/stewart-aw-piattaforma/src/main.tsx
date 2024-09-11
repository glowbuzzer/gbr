/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { Suspense } from "react"
import { createRoot } from "react-dom/client"
import {
    CartesianDroTileDefinition,
    CartesianJogTileDefinition,
    ConfigEditTileDefinition,
    ConnectTileDefinition,
    DockLayout,
    DockLayoutProvider,
    DockTileDefinitionBuilder,
    FeedRateTileDefinition,
    FramesTileDefinition,
    GlowbuzzerApp,
    JointDroTileDefinition,
    JointJogTileDefinition,
    PointsTileDefinition,
    TelemetryTileDefinition,
    ThreeDimensionalSceneTile,
    ThreeDimensionalSceneTileDefinition,
    ToolsTileDefinition
} from "@glowbuzzer/controls"
import { ExampleAppMenu } from "../../../../../examples/util/ExampleAppMenu"

import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { config } from "./config"
import { PlaneShinyMetal } from "../../../../../examples/util/PlaneShinyMetal"
import { DefaultEnvironment } from "../../../../../examples/util/DefaultEnvironment"
import { StewartPlatform } from "./StewartPlatform"
import { PointsLoaderTile } from "./PointsLoaderTile"
import { MechHumanTile } from "./mh/MechHumanTile"
import { LowerJaw } from "./mh/scene/LowerJaw"
import { UpperJaw } from "./mh/scene/UpperJaw"
import { MechHumanContextProvider } from "./mh/MechHumanContextProvider"
import {
    FlowGbdbFacetSlice,
    FramesGbdbFacetSlice,
    GbdbConfiguration,
    PointsGbdbFacetSlice,
    ToolsGbdbFacetSlice
} from "@glowbuzzer/store"

const MechHumanTileDefinition = DockTileDefinitionBuilder()
    .id("mech-human")
    .name("Teeth Motion")
    .placement(2, 0)
    .render(() => <MechHumanTile />)
    .build()

const CustomSceneTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return (
            <ThreeDimensionalSceneTile hidePreview hideTrace>
                <Suspense fallback={null}>
                    <StewartPlatform>
                        <LowerJaw />
                    </StewartPlatform>
                    <UpperJaw />
                </Suspense>
                <PlaneShinyMetal />
                <DefaultEnvironment />
            </ThreeDimensionalSceneTile>
        )
    })
    .build()

const PointsLoaderTileDefinition = DockTileDefinitionBuilder()
    .id("points-loader")
    .name("Points Loader")
    .placement(2, 1)
    .render(() => <PointsLoaderTile />)
    .build()

const persistence: GbdbConfiguration = {
    // remoteDb: "http://localhost:5984",
    facets: {
        cell: {
            singleton: true,
            autoSave: true,
            slices: [PointsGbdbFacetSlice]
        }
    }
}

const root = createRoot(document.getElementById("root"))
root.render(
    <GlowbuzzerApp
        appName="stewart_platform"
        configuration={config}
        persistenceConfiguration={persistence}
    >
        <MechHumanContextProvider>
            <DockLayoutProvider
                tiles={[
                    CartesianJogTileDefinition,
                    CartesianDroTileDefinition,
                    JointJogTileDefinition,
                    JointDroTileDefinition,
                    ToolsTileDefinition,
                    PointsTileDefinition,
                    FramesTileDefinition,
                    FeedRateTileDefinition,
                    ConfigEditTileDefinition,
                    CustomSceneTileDefinition,
                    PointsLoaderTileDefinition,
                    TelemetryTileDefinition,
                    MechHumanTileDefinition
                ]}
            >
                <ExampleAppMenu title="Stewart Platform" />
                <DockLayout />
            </DockLayoutProvider>
        </MechHumanContextProvider>
    </GlowbuzzerApp>
)
