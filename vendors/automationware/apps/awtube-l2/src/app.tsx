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
    JointTorqueModesTileDefinition,
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
    Joint,
    Link,
    Monobraccio,
    Plate,
    Spindle
} from "@glowbuzzer/awlib"
import { Environment, Sphere } from "@react-three/drei"
import { useLoadedRobotParts } from "@glowbuzzer/awlib"
import { AwTubeStatusTileDefinitionBuilder } from "@glowbuzzer/awlib"
import { SimpleMoveTile, SimpleMoveTileDefinition } from "./SimpleMoveTile"
import { PartGrid } from "./PartGrid"
import { InterpolatedMoveTile } from "./InterpolatedMoveTile"
import { Color } from "three"
import { useThree } from "@react-three/fiber"
import { Perf } from "r3f-perf"

// construct the robot definition from the parts
const definition: AwTubeRobotParts = {
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

const LoadedAwTubeRobot = () => {
    const parts = useLoadedRobotParts(definition)

    return (
        <AwTubeRobot parts={parts}>
            <TriadHelper size={400} />
            <Sphere scale={10}>
                <meshStandardMaterial color="red" />
            </Sphere>
        </AwTubeRobot>
    )
}

function SimpleEnvironment() {
    const { scene } = useThree()

    // Set a simple color or gradient as your environment
    scene.background = new Color(0x000000) // Replace with your desired color

    return null
}

const CustomSceneTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        // noinspection JSUnresolvedReference
        return (
            <ThreeDimensionalSceneTile>
                <Suspense fallback={null}>
                    <LoadedAwTubeRobot />
                    {/*
                    <PartGrid definition={definition} />
*/}
                    <PlaneShinyMetal />
                    {/*
                    <Perf matrixUpdate deepAnalyze overClock antialias={false} />
*/}

                    <Environment files="/assets/environment/aerodynamics_workshop_1k.hdr" />
                    {/*
                    <SimpleEnvironment />
*/}
                </Suspense>
            </ThreeDimensionalSceneTile>
        )
    })
    .build()

const InterpolatedMoveTileDefinition = DockTileDefinitionBuilder()
    .id("aw-interpolated-move")
    .name("Interpolated Move")
    .render(() => <InterpolatedMoveTile />)
    .build()

export const App = () => {
    return (
        <DockLayoutProvider
            tiles={[
                CustomSceneTileDefinition,
                AwTubeStatusTileDefinitionBuilder({
                    showSoftwareStop: true,
                    showToolInputs: true,
                    showToolOutputs: true
                }),
                ConnectTileDefinition,
                CartesianJogTileDefinition,
                CartesianDroTileDefinition,
                JointJogTileDefinition,
                JointDroTileDefinition,
                JointTorqueModesTileDefinition,
                ToolsTileDefinition,
                PointsTileDefinition,
                FramesTileDefinition,
                FeedRateTileDefinition,
                TelemetryTileDefinition,
                EmStatTileDefinition,
                SimpleMoveTileDefinition,
                InterpolatedMoveTileDefinition
            ]}
        >
            <ExampleAppMenu title="AutomationWare AW-TUBE" />
            <DockLayout />
        </DockLayoutProvider>
    )
}
