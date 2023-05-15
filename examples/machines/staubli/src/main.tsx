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
    GCodeTileDefinition,
    GlowbuzzerApp,
    JointDroTileDefinition,
    JointJogTileDefinition,
    PointsTileDefinition,
    TelemetryTileDefinition,
    ThreeDimensionalSceneTile,
    ThreeDimensionalSceneTileDefinition,
    ToolsTileDefinition
} from "@glowbuzzer/controls"

import {
    GCodeContextProvider,
    GCodeContextType,
    GCodeMode,
    KC_KINEMATICSCONFIGURATIONTYPE,
    useKinematicsConfiguration
} from "@glowbuzzer/store"
import { Environment } from "@react-three/drei"
import { ExampleAppMenu } from "../../../util/ExampleAppMenu"

import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { OscillatingMoveTileDefinition } from "../../../util/OscillatingMoveTile"
import { StaubliRobot } from "../../../util/StaubliRobot"
import { PlaneShinyMetal } from "../../../util/PlaneShinyMetal"
import { config } from "./config"
import { DefaultEnvironment } from "../../../util/DefaultEnvironment"

const CustomSceneTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return (
            <ThreeDimensionalSceneTile>
                <Suspense fallback={null}>
                    <StaubliRobot kinematicsConfigurationIndex={0} />
                </Suspense>

                {["red", "green", "blue"].map((colour, index) => (
                    <mesh key={colour} position={[500, (index - 1) * 200, 75]}>
                        <boxGeometry args={[150, 150, 150]} />
                        <meshStandardMaterial color={colour} />
                    </mesh>
                ))}
                <PlaneShinyMetal />
                <DefaultEnvironment />
            </ThreeDimensionalSceneTile>
        )
    })
    .build()

const App = () => {
    const kc = useKinematicsConfiguration(0)

    // depending on the type of kinematics we want to perform cartesian moves or joint space moves
    const mode: GCodeMode =
        kc.kinematicsConfigurationType === KC_KINEMATICSCONFIGURATIONTYPE.KC_NAKED
            ? GCodeMode.JOINT
            : GCodeMode.CARTESIAN

    const context: GCodeContextType = {
        mode
    }

    return (
        <GCodeContextProvider value={context}>
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
                    CustomSceneTileDefinition
                ]}
            >
                <ExampleAppMenu title="Staubli TX40" />
                <DockLayout />
            </DockLayoutProvider>
        </GCodeContextProvider>
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
