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
    ThreeDimensionalSceneTile,
    ThreeDimensionalSceneTileDefinition,
    ToolsTileDefinition
} from "@glowbuzzer/controls"
import { ExampleAppMenu } from "../../../util/ExampleAppMenu"

import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { config } from "./config"
import { PlaneShinyMetal } from "../../../util/PlaneShinyMetal"
import { DefaultEnvironment } from "../../../util/DefaultEnvironment"
import { StewartPlatform } from "./StewartPlatform"
import { StewartPlatformDebug } from "./test/StewartPlatformDebug"

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
                ConfigEditTileDefinition,
                FeedRateTileDefinition,
                CustomSceneTileDefinition
            ]}
        >
            <ExampleAppMenu title="Stewart Platform" />
            <DockLayout />
        </DockLayoutProvider>
    </GlowbuzzerApp>
)
