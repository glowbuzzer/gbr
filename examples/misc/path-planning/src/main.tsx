/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode } from "react"
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
import { Canvas } from "@react-three/fiber"
import { Scene } from "./Scene"
import { DemoTile } from "./DemoTile"
import { Demo } from "../../../applications/cnc/src/Demo"
import { pathPlanningAppReducers } from "./store"
import { config } from "./config"
import { Vector3 } from "three"

const camera_pos = new Vector3(2000, -2000, 2000)

const CustomSceneTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return (
            <ThreeDimensionalSceneTile hideTrace initialCameraPosition={camera_pos}>
                <Scene />
            </ThreeDimensionalSceneTile>
        )
    })
    .build()

const DemoTileDefinition = DockTileDefinitionBuilder()
    .render(() => <DemoTile />)
    .name("Demo")
    .id("path-demo")
    .placement(1, 1)
    .enableWithoutConnection()
    .build()

const root = createRoot(document.getElementById("root"))
root.render(
    <GlowbuzzerApp
        appName={"path-planning"}
        additionalReducers={pathPlanningAppReducers}
        configuration={config}
    >
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
                CustomSceneTileDefinition,
                DemoTileDefinition
            ]}
        >
            <ExampleAppMenu title="Path Planning" />
            <DockLayout />
        </DockLayoutProvider>
    </GlowbuzzerApp>
)
