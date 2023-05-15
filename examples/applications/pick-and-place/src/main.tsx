/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode } from "react"

import {
    CartesianDroTileDefinition,
    CartesianJogTileDefinition,
    ConnectTileDefinition,
    DockLayout,
    DockLayoutProvider,
    DockTileDefinitionBuilder,
    FeedRateTileDefinition,
    GlowbuzzerApp,
    JointDroTileDefinition,
    JointJogTileDefinition,
    TelemetryTileDefinition,
    ThreeDimensionalSceneTileDefinition
} from "@glowbuzzer/controls"
import { createRoot } from "react-dom/client"

import { ExampleAppMenu } from "../../../util/ExampleAppMenu"

import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { config } from "./config"
import { PickAndPlaceSceneTile } from "./PickAndPlaceSceneTile"
import { appReducers } from "./store"
import { DemoTile } from "./DemoTile"

const PickAndPlaceTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return <PickAndPlaceSceneTile />
    })
    .build()

const DemoTileDefinition = DockTileDefinitionBuilder()
    .id("picknplace-demo")
    .name("Demo")
    .placement(1, 1)
    .render(() => React.createElement(DemoTile))
    .build()

function App() {
    return (
        <DockLayoutProvider
            tiles={[
                ConnectTileDefinition,
                CartesianJogTileDefinition,
                CartesianDroTileDefinition,
                JointJogTileDefinition,
                JointDroTileDefinition,
                FeedRateTileDefinition,
                TelemetryTileDefinition,
                PickAndPlaceTileDefinition,
                DemoTileDefinition
            ]}
        >
            <ExampleAppMenu />
            <DockLayout />
        </DockLayoutProvider>
    )
}

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp
            appName="pick-and-place"
            configuration={config}
            additionalReducers={appReducers}
        >
            <App />
        </GlowbuzzerApp>
    </StrictMode>
)
