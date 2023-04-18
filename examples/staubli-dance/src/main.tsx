/*
 * Copyright (c) 2022-2023. Glowbuzzer. All rights reserved
 */

import React, { StrictMode, Suspense, useMemo } from "react"
import { createRoot } from "react-dom/client"
import {
    BasicRobot,
    CartesianDroTileDefinition,
    CartesianJogTileDefinition,
    ConfigEditTileDefinition,
    ConnectTileDefinition,
    CylindricalTool,
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
    RobotKinematicsChainElement,
    TelemetryTileDefinition,
    ThreeDimensionalSceneTile,
    ThreeDimensionalSceneTileDefinition,
    ToolsTileDefinition,
    Trace,
    TrackPosition
} from "@glowbuzzer/controls"

import { useFrame, useJointPositions, useKinematicsConfiguration } from "@glowbuzzer/store"

import { Vector3 } from "three"
import { useGLTF } from "@react-three/drei"
import { ExampleAppMenu } from "../../util/ExampleAppMenu"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { OscillatingMoveTileDefinition } from "../../util/OscillatingMoveTile"
import { ConnTest } from "../../util/ConnTest"
import { TraceLabel } from "./TraceLabel"
import { DemoTileDefinition } from "./tiles"
import { StaubliRobot } from "../../util/staubli"

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
            <ExampleAppMenu title="Staubli TX40" />
            <ConnTest />
            <DockLayout />
        </DockLayoutProvider>
    )
}

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp appName="staubli">
            <App />
        </GlowbuzzerApp>
    </StrictMode>
)
