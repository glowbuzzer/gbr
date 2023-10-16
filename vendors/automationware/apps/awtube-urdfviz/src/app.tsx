/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

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
import { ExampleAppMenu } from "../../../../../examples/util/ExampleAppMenu"
import { PlaneShinyMetal } from "../../../../../examples/util/PlaneShinyMetal"
import React, { Suspense } from "react"
import { AwTubeRobot, AwTubeRobotParts } from "@automationware/awtube"
import { Base, Clamp, Flange, Joint, Link, Monobraccio, Spindle } from "@automationware/awtube"
import { Environment } from "@react-three/drei"
import { UrdfFrames } from "./UrdfFrames"
import { useLoadedRobotParts } from "../../../lib/awtube/hooks"
import { Group, Material, Mesh } from "three"
import { UrdfTile } from "./UrdfTile"
import { UrdfContextProvider, useUrdfContext } from "./UrdfContextProvider"
import { CentreOfMassIndicator } from "./CentreOfMassIndicator"

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

function makeMeshesTransparent(group: Group, opacity: number = 0.5): void {
    group.traverse(object => {
        if (object instanceof Mesh) {
            if (object.material instanceof Material) {
                object.material.transparent = true
                object.material.opacity = opacity
            } else if (Array.isArray(object.material)) {
                object.material.forEach(mat => {
                    mat.transparent = true
                    mat.opacity = opacity
                })
            }
        }
    })
}

const LoadedAwTubeRobot = () => {
    const { opacity } = useUrdfContext()
    const parts = useLoadedRobotParts(definition)
    Object.values(parts).forEach(part => makeMeshesTransparent(part.object, opacity))

    return (
        <>
            <AwTubeRobot parts={parts}>
                <mesh>
                    <sphereBufferGeometry args={[10, 10, 10]} />
                    <meshStandardMaterial color="red" />
                </mesh>
            </AwTubeRobot>
        </>
    )
}

const CustomSceneTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return (
            <ThreeDimensionalSceneTile>
                <Suspense fallback={null}>
                    <LoadedAwTubeRobot />
                    <UrdfFrames />
                </Suspense>

                <PlaneShinyMetal />
                <Environment files="/assets/environment/aerodynamics_workshop_1k.hdr" />
            </ThreeDimensionalSceneTile>
        )
    })
    .build()

const UrdfTileDefinition = DockTileDefinitionBuilder()
    .id("urdf")
    .name("URDF")
    .render(() => {
        return <UrdfTile />
    })
    .enableWithoutConnection()
    .build()

export const App = () => {
    return (
        <UrdfContextProvider>
            <DockLayoutProvider
                tiles={[
                    CustomSceneTileDefinition,
                    UrdfTileDefinition,
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
                    TelemetryTileDefinition
                ]}
            >
                <ExampleAppMenu title="AwTube URDF Visualizer" />
                <DockLayout />
            </DockLayoutProvider>
        </UrdfContextProvider>
    )
}
