/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {
    GCodeContextProvider,
    GCodeContextType,
    GCodeMode,
    KC_KINEMATICSCONFIGURATIONTYPE,
    useKinematicsConfiguration
} from "@glowbuzzer/store"
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
    JointDroTileDefinition,
    JointJogTileDefinition,
    PointsTileDefinition,
    TelemetryTileDefinition,
    ThreeDimensionalSceneTile,
    ThreeDimensionalSceneTileDefinition,
    ToolsTileDefinition,
    TriadHelper
} from "@glowbuzzer/controls"
import { OscillatingMoveTileDefinition } from "../../../../../examples/util/OscillatingMoveTile"
import { ExampleAppMenu } from "../../../../../examples/util/ExampleAppMenu"
import React, { Suspense, useMemo } from "react"
import { PlaneShinyMetal } from "../../../../../examples/util/PlaneShinyMetal"
import { DefaultEnvironment } from "../../../../../examples/util/DefaultEnvironment"
import { Sphere, useGLTF } from "@react-three/drei"
import { AwTubeRobot } from "./AwTubeRobot"
import { LinkLengthTile } from "./LinkLengthTile"

const CustomSceneTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return (
            <ThreeDimensionalSceneTile>
                <Suspense fallback={null}>
                    <AwTubeRobot>
                        <TriadHelper size={400} />
                        <Sphere scale={10}>
                            <meshStandardMaterial color="red" />
                        </Sphere>
                    </AwTubeRobot>
                </Suspense>

                <PlaneShinyMetal />
                <DefaultEnvironment />
            </ThreeDimensionalSceneTile>
        )
    })
    .build()

const LinkLengthTileDefinition = DockTileDefinitionBuilder()
    .id("link-lengths")
    .name("Link Lengths")
    .render(() => {
        return <LinkLengthTile />
    })
    .enableWithoutConnection()
    .build()

export const App = () => {
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
                    CustomSceneTileDefinition,
                    LinkLengthTileDefinition,
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
                    OscillatingMoveTileDefinition
                ]}
            >
                <ExampleAppMenu title="AutomationWare AW-TUBE" />
                <DockLayout />
            </DockLayoutProvider>
        </GCodeContextProvider>
    )
}
