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
import { PlaneShinyMetal } from "../../../../../examples/util/PlaneShinyMetal"
import React, { Suspense, useEffect } from "react"
import { AwTubeRobot } from "@automationware/awtube"
import { Environment, Sphere } from "@react-three/drei"
import { UrdfFrames } from "./UrdfFrames"
import { useLoadedRobotParts } from "../../../lib/awtube/hooks"
import { Group, Material, Mesh } from "three"
import { UrdfTile } from "./UrdfTile"
import { UrdfContextProvider, useUrdfContext } from "./UrdfContextProvider"
import { WorldPosition } from "./WorldPosition"
import { AppMenu } from "./AppMenu"
import { useAwTubeModel } from "./model/ModelProvider"
import { Perf } from "r3f-perf"

function makeMeshesTransparent(group: Group, opacity: number = 0.5): void {
    group.traverse(object => {
        const transparent = opacity < 1
        if (object instanceof Mesh) {
            const materials = [object.material].flat()
            materials.forEach(mat => {
                mat.transparent = transparent
                mat.opacity = transparent ? opacity : 1
                mat.needsUpdate = true
            })
        }
    })
}

const LoadedAwTubeRobot = () => {
    const { options } = useUrdfContext()
    const { parts: definition } = useAwTubeModel()
    const parts = useLoadedRobotParts(definition)

    Object.values(parts).forEach(part => makeMeshesTransparent(part.object, options.modelOpacity))

    return (
        <>
            <AwTubeRobot parts={parts} showFrames={options.showFramesDH}>
                <Sphere scale={10}>
                    <meshStandardMaterial color="red" />
                </Sphere>
                <TriadHelper size={50} />
                {options.showWorldPositionDH && <WorldPosition title="DH World" position="left" />}
            </AwTubeRobot>
        </>
    )
}

const CustomSceneTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return (
            <ThreeDimensionalSceneTile hideTrace hidePreview>
                <Suspense fallback={null}>
                    {/*
                    <PartGrid definition={definition} />
*/}
                    <LoadedAwTubeRobot />
                    <UrdfFrames />
                    {/*
                    <Perf matrixUpdate deepAnalyze overClock antialias={false} />
*/}
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
                <AppMenu />
                <DockLayout />
            </DockLayoutProvider>
        </UrdfContextProvider>
    )
}
