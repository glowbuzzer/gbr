/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import React from "react"

import "./App.css"
import { DefaultEnvironment } from "../../../util/DefaultEnvironment"
import {
    CartesianDroTileDefinition,
    CartesianJogTileDefinition,
    ConnectTileDefinition,
    DockLayout,
    DockLayoutProvider,
    DockTileDefinitionBuilder,
    FramesTileDefinition,
    GCodeTileDefinition,
    JointDroTileDefinition,
    JointJogTileDefinition,
    PointsTileDefinition,
    ThreeDimensionalSceneTile,
    ThreeDimensionalSceneTileDefinition,
    ToolsTileDefinition,
    Trace
} from "@glowbuzzer/controls"
import { ExampleAppMenu } from "../../../util/ExampleAppMenu"
import { CutterSimulation } from "./CutterSimulation"
import { distance } from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements"

export const App = () => {
    const CustomThreeDimensionalSceneTileDefinition = DockTileDefinitionBuilder(
        ThreeDimensionalSceneTileDefinition
    )
        .render(() => {
            return (
                <ThreeDimensionalSceneTile>
                    <CutterSimulation />
                </ThreeDimensionalSceneTile>
            )
        })
        .build()

    return (
        <DockLayoutProvider
            tiles={[
                CartesianDroTileDefinition,
                JointDroTileDefinition,
                CartesianJogTileDefinition,
                JointJogTileDefinition,
                ConnectTileDefinition,
                CustomThreeDimensionalSceneTileDefinition,
                GCodeTileDefinition,
                FramesTileDefinition,
                PointsTileDefinition,
                ToolsTileDefinition
            ]}
        >
            <ExampleAppMenu />
            <DockLayout />
        </DockLayoutProvider>
    )

    return (
        <Canvas style={{ height: "100%" }}>
            <ambientLight />
            <OrbitControls />
            <CutterSimulation />
            <DefaultEnvironment />
        </Canvas>
    )
}
