/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { Suspense } from "react"

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

import { ActivityApi, GCodeContextProvider } from "@glowbuzzer/store"
import { createRoot } from "react-dom/client"

import { ExampleAppMenu } from "../../../util/ExampleAppMenu"
import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import * as THREE from "three"
import { config } from "./config"
import { PlaneShinyMetal } from "../../../util/PlaneShinyMetal"
import { DefaultEnvironment } from "../../../util/DefaultEnvironment"
import { Wmr } from "./Wmr"

const DEG90 = Math.PI / 2
const DEG180 = Math.PI
const DEFAULT_POSITION = new THREE.Vector3(0, 0, 0)
const DEFAULT_ROTATION = new THREE.Quaternion(1, 0, 0, 0)

const CustomSceneTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return (
            <ThreeDimensionalSceneTile>
                <Suspense fallback={null}>
                    <Wmr />
                </Suspense>
                <PlaneShinyMetal />
                <DefaultEnvironment />
            </ThreeDimensionalSceneTile>
        )
    })
    .build()

function App() {
    function handleToolChange(
        kinematicsConfigurationIndex: number,
        current: number,
        next: number,
        api: ActivityApi
    ) {
        return [api.moveToPosition(null, null, 50), api.setToolOffset(next), api.dwell(500)]
    }

    return (
        <GCodeContextProvider value={{ handleToolChange }}>
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
                <ExampleAppMenu />
                <DockLayout />
            </DockLayoutProvider>
        </GCodeContextProvider>
    )
}

const root = createRoot(document.getElementById("root"))
root.render(
    <GlowbuzzerApp appName="wmr" configuration={config}>
        <App />
    </GlowbuzzerApp>
)
