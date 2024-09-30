/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { Suspense, useEffect, useRef } from "react"

import {
    CartesianDroTileDefinition,
    CartesianJogTileDefinition,
    ConfigEditTileDefinition,
    DockLayout,
    DockLayoutProvider,
    DockTileDefinitionBuilder,
    FeedRateTileDefinition,
    FlowEditorTileDefinition,
    FlowRuntimeTileDefinition,
    GlowbuzzerApp,
    JointDroTileDefinition,
    JointJogTileDefinition,
    PointsTileDefinition,
    ThreeDimensionalSceneTile,
    ThreeDimensionalSceneTileDefinition,
    ToolsTileDefinition
} from "@glowbuzzer/controls"

import { useGLTF } from "@react-three/drei"

import { useJointPositions } from "@glowbuzzer/store"
import { createRoot } from "react-dom/client"

import { ExampleAppMenu } from "../../../util/ExampleAppMenu"
import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { config } from "./config"
import { DefaultEnvironment } from "../../../util/DefaultEnvironment"

console.log("config", config)

const ScaraRobot = () => {
    const jointPositions = useJointPositions(0)

    // load the parts of the robot (links)
    const parts = useGLTF([0, 1, 2, 3].map(j => `/assets/ts2_40/L${j}.glb`)).map(m => m.scene)

    useEffect(() => {
        if (G0.current && G1.current && G2.current) {
            G2.current.rotation.z = jointPositions[0] || 0
            G3.current.rotation.z = jointPositions[1] || 0
            G4.current.position.z = jointPositions[2] / 1000 || 0
            G4.current.rotation.z = jointPositions[3] || 0
        }
    }, [jointPositions])

    const G0 = useRef(null)
    const G1 = useRef(null)
    const G2 = useRef(null)
    const G3 = useRef(null)
    const G4 = useRef(null)

    const scale = 1000
    return (
        <group scale={[scale, scale, scale]} position={[0, 0, 400]} ref={G0}>
            <group ref={G1}>
                <primitive rotation={[0, Math.PI, 0]} object={parts[0]} position={[0, 0, 0]} />
                <group ref={G2}>
                    <primitive rotation={[0, Math.PI, 0]} object={parts[1]} position={[0, 0, 0]} />
                    <group ref={G3} position={[-0.22, 0, 0]}>
                        <primitive rotation={[Math.PI / 2, Math.PI, 0]} object={parts[2]} />
                        <group ref={G4} position={[-0.24, 0, 0]}>
                            <primitive
                                rotation={[Math.PI / 2, 0, 0]}
                                position={[0, 0, -0.289]}
                                object={parts[3]}
                            />
                        </group>
                    </group>
                </group>
            </group>
        </group>
    )
}

const CustomSceneTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return (
            <ThreeDimensionalSceneTile>
                <Suspense fallback={null}>
                    <ScaraRobot />
                </Suspense>
                <DefaultEnvironment />
            </ThreeDimensionalSceneTile>
        )
    })
    .build()

function App() {
    return (
        <DockLayoutProvider
            tiles={[
                CustomSceneTileDefinition,
                FlowEditorTileDefinition,
                FlowRuntimeTileDefinition,
                CartesianJogTileDefinition,
                CartesianDroTileDefinition,
                JointJogTileDefinition,
                JointDroTileDefinition,
                ToolsTileDefinition,
                PointsTileDefinition,
                // FramesTileDefinition,
                ConfigEditTileDefinition,
                FeedRateTileDefinition
            ]}
        >
            <ExampleAppMenu />
            <DockLayout />
        </DockLayoutProvider>
    )
}

const root = createRoot(document.getElementById("root"))
root.render(
    <GlowbuzzerApp appName="scara" configuration={config} autoOpEnabled>
        <App />
    </GlowbuzzerApp>
)
