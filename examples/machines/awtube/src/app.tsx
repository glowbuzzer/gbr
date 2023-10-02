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
import { OscillatingMoveTileDefinition } from "../../../util/OscillatingMoveTile"
import { ExampleAppMenu } from "../../../util/ExampleAppMenu"
import React, { Suspense, useMemo } from "react"
import { PlaneShinyMetal } from "../../../util/PlaneShinyMetal"
import { DefaultEnvironment } from "../../../util/DefaultEnvironment"
import { useGLTF } from "@react-three/drei"
import { AwTubeRobot } from "./AwTubeRobot"
import { LinkLengthTile } from "./LinkLengthTile"
import { AwTubeRobot2 } from "./AwTubeRobot2"
import { AwTubeRobot3 } from "./AwTubeRobot3"
import { AwTubeRobot4 } from "./AwTubeRobot4"

const CustomSceneTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return (
            <ThreeDimensionalSceneTile>
                <Suspense fallback={null}>
                    <AwTubeRobot4>
                        <TriadHelper size={400} />
                        <mesh>
                            <sphereBufferGeometry args={[10, 10, 10]} />
                            <meshStandardMaterial color="red" />
                        </mesh>
                    </AwTubeRobot4>
                    <group position={[1000, 0, 0]}>
                        <AwTubeRobot>{null}</AwTubeRobot>
                    </group>
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
