/*
 * Copyright (c) 2022-2023. Glowbuzzer. All rights reserved
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
    GCodeTileDefinition,
    GlowbuzzerApp,
    JointDroTileDefinition,
    JointJogTileDefinition,
    PointsTileDefinition,
    TelemetryTileDefinition,
    ThreeDimensionalSceneTile,
    ThreeDimensionalSceneTileDefinition,
    ToolsTileDefinition,
    Trace,
    TrackPosition
} from "@glowbuzzer/controls"
import { Environment } from "@react-three/drei"
import { ExampleAppMenu } from "../../../util/ExampleAppMenu"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { OscillatingMoveTileDefinition } from "../../../util/OscillatingMoveTile"
import { TraceLabel } from "./TraceLabel"
import { DemoTileDefinition } from "./tiles"
import { StaubliRobot } from "../../../util/StaubliRobot"
import { config } from "./config"
import { PlaneShinyMetal } from "../../../util/PlaneShinyMetal"
import { DefaultEnvironment } from "../../../util/DefaultEnvironment"

const StaubliDanceTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return (
            <ThreeDimensionalSceneTile hideTrace>
                <Suspense fallback={null}>
                    <StaubliRobot kinematicsConfigurationIndex={0} />
                    <Trace kinematicsConfigurationIndex={0} color={"red"} />
                    <TrackPosition kinematicsConfigurationIndex={0}>
                        <TraceLabel kinematicsConfigurationIndex={0} />
                    </TrackPosition>
                    <StaubliRobot kinematicsConfigurationIndex={1} />
                    <Trace kinematicsConfigurationIndex={1} color={"blue"} />
                    <TrackPosition kinematicsConfigurationIndex={1}>
                        <TraceLabel kinematicsConfigurationIndex={1} />
                    </TrackPosition>
                    <PlaneShinyMetal />
                    <DefaultEnvironment />
                </Suspense>
            </ThreeDimensionalSceneTile>
        )
    })
    .build()

const App = () => {
    return (
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
                GCodeTileDefinition,
                TelemetryTileDefinition,
                OscillatingMoveTileDefinition,
                StaubliDanceTileDefinition,
                DemoTileDefinition
            ]}
        >
            <ExampleAppMenu title="Staubli TX40 Dance" />
            <DockLayout />
        </DockLayoutProvider>
    )
}

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp appName="staubli" configuration={config}>
            <App />
        </GlowbuzzerApp>
    </StrictMode>
)
