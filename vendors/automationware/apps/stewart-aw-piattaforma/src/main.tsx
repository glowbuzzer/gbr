/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode, Suspense } from "react"
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

const CustomSceneTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return (
            <ThreeDimensionalSceneTile>
                <Suspense fallback={null}>
                    <StewartPlatform />
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
    .enableWithoutConnection()
    .build()

const root = createRoot(document.getElementById("root"))
root.render(
    <GlowbuzzerApp appName="stewart_platform" configuration={config}>
        <DockLayoutProvider
            tiles={[
                ConnectTileDefinition,
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
                TelemetryTileDefinition
            ]}
        >
            <ExampleAppMenu title="Stewart Platform" />
            <DockLayout />
        </DockLayoutProvider>
    </GlowbuzzerApp>
)
