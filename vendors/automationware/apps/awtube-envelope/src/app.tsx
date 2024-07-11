/*
 * Copyright (c) 2023-2024. Glowbuzzer. All rights reserved
 */

import {
    CartesianDroTileDefinition,
    CartesianJogTileDefinition,
    ConnectTileDefinition,
    DockLayout,
    DockLayoutProvider,
    DockTileDefinitionBuilder,
    DiagnosticsTileDefinition,
    FeedRateTileDefinition,
    FlowTileDefinition,
    FramesTileDefinition,
    JointDroTileDefinition,
    JointJogTileDefinition,
    JointTorqueModesTileDefinition,
    MonitorTileDefinition,
    PayloadTileDefinition,
    PointsTileDefinition,
    SerialCommunicationsTileDefinition,
    TelemetryTileDefinition,
    ThreeDimensionalSceneTile,
    ThreeDimensionalSceneTileDefinition,
    ToolsTileDefinition,
    TriadHelper
} from "@glowbuzzer/controls"
import React, { Suspense } from "react"
import {
    AwTubeRobot,
    AwTubeRobotParts,
    Base,
    Clamp,
    Joint,
    Link,
    Monobraccio,
    Plate,
    Spindle,
    useLoadedRobotParts
} from "@glowbuzzer/awlib"
import { Environment, Sphere } from "@react-three/drei"
import { ExampleAppMenu } from "../../../../../examples/util/ExampleAppMenu"
import { EnvelopeProvider } from "./provider"
import { EnvelopeTileDefinition } from "./EnvelopeTile"
import { EnvelopePoints } from "./EnvelopePoints"
import { ReachabilityViz } from "./ReachabilityViz"

// construct the robot definition from the parts
const definition_l2: AwTubeRobotParts = {
    b0: Base.MM219,
    j0: Joint.J40LP,
    p0: Plate.J40,
    c0: Clamp.J40_J40,
    j1: Joint.J40HP,
    l0: Link.L125_314,
    j2: Joint.J32,
    c1: Clamp.J32_J25,
    j3: Joint.J25,
    p1: Plate.J25,
    l1: Link.L100_294,
    j4: Joint.J25,
    p2: Plate.J25,
    m0: Monobraccio.M220,
    j5: Joint.J20,
    s0: Spindle.M112
}

const definition_l: AwTubeRobotParts = {
    b0: Base.MM219_27,
    j0: Joint.J40LP,
    p0: Plate.J40,
    c0: Clamp.J40_J40,
    j1: Joint.J40HP,
    l0: Link.L125_514,
    j2: Joint.J32,
    c1: Clamp.J32_J25,
    j3: Joint.J25,
    p1: Plate.J25,
    l1: Link.L100_494,
    j4: Joint.J25,
    p2: Plate.J25,
    m0: Monobraccio.M250,
    j5: Joint.J20,
    s0: Spindle.M112
}

const LoadedAwTubeRobot = () => {
    const parts = useLoadedRobotParts(definition_l)

    return (
        <AwTubeRobot parts={parts}>
            <TriadHelper size={400} />
            <Sphere scale={10}>
                <meshStandardMaterial color="red" />
            </Sphere>
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
                    {/*
                    <PlaneShinyMetal />
*/}
                    <group position={[0, 0, -117 * 2]}>
                        <ReachabilityViz />
                    </group>
                    <Environment files="/assets/environment/aerodynamics_workshop_1k.hdr" />
                </Suspense>
            </ThreeDimensionalSceneTile>
        )
    })
    .build()

export const App = () => {
    return (
        <EnvelopeProvider>
            <DockLayoutProvider
                tiles={[
                    CustomSceneTileDefinition,
                    ConnectTileDefinition,
                    CartesianJogTileDefinition,
                    CartesianDroTileDefinition,
                    JointJogTileDefinition,
                    JointDroTileDefinition,
                    EnvelopeTileDefinition,
                    FeedRateTileDefinition,
                    PointsTileDefinition,
                    FramesTileDefinition
                ]}
            >
                <ExampleAppMenu />
                <DockLayout />
            </DockLayoutProvider>
        </EnvelopeProvider>
    )
}
