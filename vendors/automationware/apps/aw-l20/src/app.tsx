/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {
    CartesianDroTileDefinition,
    CartesianJogTileDefinition,
    ConnectTileDefinition,
    DockLayout,
    DockLayoutProvider,
    DockTileDefinitionBuilder,
    EmStatTileDefinition,
    FeedRateTileDefinition,
    FramesTileDefinition,
    JointDroTileDefinition,
    JointJogTileDefinition,
    PointsTileDefinition,
    TelemetryTileDefinition,
    ThreeDimensionalSceneTile,
    ThreeDimensionalSceneTileDefinition,
    ToolsTileDefinition,
    TriadHelper
} from "@glowbuzzer/controls"
import { ExampleAppMenu } from "../../../../../examples/util/ExampleAppMenu"
import { PlaneShinyMetal } from "../../../../../examples/util/PlaneShinyMetal"
import React, { Suspense } from "react"
import {
    AwTubeRobot,
    AwTubeRobotParts,
    Base,
    Clamp,
    Flange,
    Joint,
    Link,
    Monobraccio,
    Spindle
} from "../../../lib/awtube"
import { Environment } from "@react-three/drei"
import { useLoadedRobotParts } from "../../../lib/awtube/hooks"
import { AwTubeTileDefinitionBuilder } from "../../../lib/awtube/AwTubeStatusTile"

// construct the robot definition from the parts
const definition: AwTubeRobotParts = {
    b0: Base.MM219,
    j0: Joint.J32,
    c0: Clamp.J32_J32,
    j1: Joint.J32,
    f0: Flange.J32,
    l0: Link.MM127_302,
    f1: Flange.J32,
    j2: Joint.J32,
    c1: Clamp.J32_J25,
    j3: Joint.J25,
    f2: Flange.J25,
    l1: Link.MM100_283,
    f3: Flange.J25,
    j4: Joint.J25,
    m0: Monobraccio.M220,
    j5: Joint.J20,
    s0: Spindle.M112
}

const LoadedAwTubeRobot = () => {
    const parts = useLoadedRobotParts(definition)

    return (
        <AwTubeRobot parts={parts}>
            <TriadHelper size={400} />
            <mesh>
                <sphereBufferGeometry args={[10, 10, 10]} />
                <meshStandardMaterial color="red" />
            </mesh>
        </AwTubeRobot>
    )
}

const CustomSceneTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        // noinspection JSUnresolvedReference
        return (
            <ThreeDimensionalSceneTile>
                <Suspense fallback={null}>
                    <LoadedAwTubeRobot />
                    <PlaneShinyMetal />
                    <Environment files="/assets/environment/aerodynamics_workshop_1k.hdr" />
                </Suspense>
            </ThreeDimensionalSceneTile>
        )
    })
    .build()

export const App = () => {
    return (
        <DockLayoutProvider
            tiles={[
                CustomSceneTileDefinition,
                AwTubeTileDefinitionBuilder({
                    showSoftwareStop: true,
                    showToolInputs: true,
                    showToolOutputs: true
                }),
                ConnectTileDefinition,
                CartesianJogTileDefinition,
                CartesianDroTileDefinition,
                JointJogTileDefinition,
                JointDroTileDefinition,
                ToolsTileDefinition,
                PointsTileDefinition,
                FramesTileDefinition,
                FeedRateTileDefinition,
                TelemetryTileDefinition,
                EmStatTileDefinition
            ]}
        >
            <ExampleAppMenu title="AutomationWare AW-TUBE" />
            <DockLayout />
        </DockLayoutProvider>
    )
}
