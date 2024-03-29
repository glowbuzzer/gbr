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

import { ExampleAppMenu } from "../../../util/ExampleAppMenu"

import { config } from "./config"
import { appReducers, useAppState } from "./store"
import { MoveableStaubliRobot } from "./App"
import { PlaneShinyMetal } from "../../../util/PlaneShinyMetal"
import { DefaultEnvironment } from "../../../util/DefaultEnvironment"
import { DemoTile } from "./DemoTile"

import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"

const MoveableStaubliTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        const { tracking } = useAppState()
        return (
            <ThreeDimensionalSceneTile noControls={tracking} noCamera={tracking}>
                <Suspense fallback={null}>
                    <MoveableStaubliRobot />
                </Suspense>
                <PlaneShinyMetal />
                <DefaultEnvironment />
            </ThreeDimensionalSceneTile>
        )
    })
    .build()

const DemoTileDefinition = DockTileDefinitionBuilder()
    .id("demo-tile")
    .name("Demo")
    .placement(1, 1)
    .render(() => React.createElement(DemoTile))
    .build()

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp
            appName="moveable-staubli"
            configuration={config}
            additionalReducers={appReducers}
        >
            <DockLayoutProvider
                tiles={[
                    MoveableStaubliTileDefinition,
                    DemoTileDefinition,
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
                    TelemetryTileDefinition
                ]}
            >
                <ExampleAppMenu title="Moveable Staubli TX40" />
                <DockLayout />
            </DockLayoutProvider>
        </GlowbuzzerApp>
    </StrictMode>
)
