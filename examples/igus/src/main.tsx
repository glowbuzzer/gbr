/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode } from "react"

import { Euler, Vector3 } from "three"
import { createRoot } from "react-dom/client"
import { DemoMoveTile, HIGH_BLOCK_Z } from "./DemoMoveTile"
import {
    BasicRobot,
    CartesianDroTileDefinition,
    ConnectTileDefinition,
    DockLayout,
    DockLayoutProvider,
    DockTileDefinition,
    DockTileDefinitionBuilder,
    FeedRateTileDefinition,
    GlowbuzzerApp,
    CartesianJogTileDefinition,
    JointJogTileDefinition,
    JointDroTileDefinition,
    RobotKinematicsChainElement,
    ThreeDimensionalSceneTile,
    ThreeDimensionalSceneTileDefinition
} from "@glowbuzzer/controls"

import { ExampleAppMenu } from "../../util/ExampleAppMenu"
import { useFrame, useJointPositions, useKinematicsConfiguration } from "@glowbuzzer/store"
import { useGLTF } from "@react-three/drei"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { TriadHelper } from "@glowbuzzer/controls"

const DEG90 = Math.PI / 2
const DEG180 = Math.PI

const IGUS_KIN_CHAIN: RobotKinematicsChainElement[] = [
    { moveable: true },
    { rotateX: -DEG90, jointAngleAdjustment: -DEG90, moveable: true },
    { rotateX: -DEG90, translateX: 0.35 },
    { rotateX: DEG90, translateZ: 0.0119, moveable: true },
    { rotateX: DEG90, translateX: 0.27 },
    { rotateX: -DEG90, translateZ: -0.0165, moveable: true },
    { rotateX: -DEG90, rotateY: DEG90, translateX: 0.17 },
    { jointAngleAdjustment: -DEG180, moveable: true },
    {
        /* tool will be placed here */
    }
]

const DEFAULT_POSITION = new Vector3(0, 0, 275)

const IgusRobot = () => {
    const { frameIndex } = useKinematicsConfiguration(0)
    const { translation, rotation } = useFrame(frameIndex, false)

    const jointPositions = useJointPositions(0)

    // load the parts of the robot (links)
    const parts = useGLTF([0, 1, 2, 3, 4, 5].map(j => `/assets/igus/L${j}.glb`)).map(m => m.scene)

    return (
        <BasicRobot
            kinematicsChain={IGUS_KIN_CHAIN}
            parts={parts}
            jointPositions={jointPositions}
            translation={translation || DEFAULT_POSITION}
            rotation={rotation}
            scale={1000}
        >
            <TriadHelper size={200} />
        </BasicRobot>
    )
}

const Custom3dSceneTile = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return (
            <ThreeDimensionalSceneTile hideTrace hidePreview>
                <IgusRobot />

                {["red", "green", "blue"].map((colour, index) => (
                    <mesh key={colour} position={[500, (index - 1) * 200, 75]}>
                        <boxGeometry args={[150, 150, 150]} />
                        <meshStandardMaterial color={colour} />
                    </mesh>
                ))}
                <mesh position={[600, 0, HIGH_BLOCK_Z]}>
                    <boxGeometry args={[150, 150, 150]} />
                    <meshStandardMaterial color={"hotpink"} />
                </mesh>
                <mesh position={[500, 500, HIGH_BLOCK_Z]} rotation={new Euler(0, 0, Math.PI / 4)}>
                    <boxGeometry args={[150, 150, 150]} />
                    <meshStandardMaterial color={"yellow"} />
                </mesh>
            </ThreeDimensionalSceneTile>
        )
    })
    .build()

const demoMoveTile: DockTileDefinition = DockTileDefinitionBuilder()
    .id("demo-move")
    .name("Demo Move")
    .render(() => <DemoMoveTile />)
    .placement(0, 1)
    .build()

export function App() {
    return (
        <DockLayoutProvider
            tiles={[
                ConnectTileDefinition,
                FeedRateTileDefinition,
                JointJogTileDefinition,
                JointDroTileDefinition,
                CartesianJogTileDefinition,
                CartesianDroTileDefinition,
                demoMoveTile,
                Custom3dSceneTile
            ]}
        >
            <ExampleAppMenu />
            <DockLayout />
        </DockLayoutProvider>
    )
}

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp appName={"igus"}>
            <App />
        </GlowbuzzerApp>
    </StrictMode>
)
