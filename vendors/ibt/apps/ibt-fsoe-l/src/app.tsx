/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {
    CartesianDroTileDefinition,
    CartesianJogTileDefinition,
    ConfigEditTileDefinition,
    DiagnosticsTileDefinition,
    DigitalInputsTileDefinition,
    DigitalOutputsTileDefinition,
    DockLayout,
    DockLayoutProvider,
    DockTileDefinitionBuilder,
    FeedRateTileDefinition,
    FlowEditorTileDefinition,
    FlowRuntimeTileDefinition,
    FramesTileDefinition,
    JointDroTileDefinition,
    JointJogTileDefinition,
    JointTorqueModesTileDefinition,
    MonitorTileDefinition,
    PayloadTileDefinition,
    PointsTileDefinition,
    SafetyDigitalInputsTileDefinition,
    SafetyDigitalOutputsTileDefinition,
    SerialCommunicationsTileDefinition,
    TelemetryTileDefinition,
    ThreeDimensionalSceneTile,
    ThreeDimensionalSceneTileDefinition,
    ToolsTileDefinition,
    TriadHelper
} from "@glowbuzzer/controls"
import { PlaneShinyMetal } from "../../../../../examples/util/PlaneShinyMetal"
import React, { Suspense } from "react"
import {
    AwTubeRobot,
    AwTubeRobotParts,
    Base,
    Clamp,
    InnoboticsFlowTileWrapper,
    InnoboticsJogTileWrapper,
    InnoboticsModeProvider,
    Joint,
    Link,
    Monobraccio,
    Plate,
    Spindle,
    useLoadedRobotParts
} from "@glowbuzzer/awlib"
import { Environment, Sphere } from "@react-three/drei"

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
            <ThreeDimensionalSceneTile hidePreview hideTrace>
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
        <InnoboticsModeProvider>
            <DockLayoutProvider
                tiles={[
                    CustomSceneTileDefinition,
                    SerialCommunicationsTileDefinition,
                    ConfigEditTileDefinition,
                    DockTileDefinitionBuilder(CartesianJogTileDefinition)
                        .wrap(InnoboticsJogTileWrapper)
                        .build(),
                    DockTileDefinitionBuilder(JointJogTileDefinition)
                        .wrap(InnoboticsJogTileWrapper)
                        .build(),
                    FlowEditorTileDefinition,
                    DockTileDefinitionBuilder(FlowRuntimeTileDefinition)
                        .wrap(InnoboticsFlowTileWrapper)
                        .build(),
                    CartesianDroTileDefinition,
                    JointDroTileDefinition,
                    JointTorqueModesTileDefinition,
                    ToolsTileDefinition,
                    PointsTileDefinition,
                    FramesTileDefinition,
                    FeedRateTileDefinition,
                    TelemetryTileDefinition,
                    DiagnosticsTileDefinition,
                    MonitorTileDefinition,
                    PayloadTileDefinition,
                    DigitalInputsTileDefinition,
                    SafetyDigitalInputsTileDefinition,
                    DigitalOutputsTileDefinition,
                    SafetyDigitalOutputsTileDefinition
                ]}
            >
                <DockLayout />
            </DockLayoutProvider>
        </InnoboticsModeProvider>
    )
}
