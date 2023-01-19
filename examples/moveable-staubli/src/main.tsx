/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode, Suspense } from "react"
import { createRoot } from "react-dom/client"
import {
    BasicRobot,
    CartesianDroTileDefinition,
    ConfigEditTileDefinition,
    ConnectTileDefinition,
    CylindricalTool,
    DockLayout,
    DockLayoutProvider,
    DockTileDefinitionBuilder,
    FeedRateTileDefinition,
    FramesTileDefinition,
    GlowbuzzerApp,
    CartesianJogTileDefinition,
    JointJogTileDefinition,
    JointDroTileDefinition,
    PointsTileDefinition,
    RobotKinematicsChainElement,
    ThreeDimensionalSceneTile,
    ThreeDimensionalSceneTileDefinition,
    ToolsTileDefinition,
    TriadHelper
} from "@glowbuzzer/controls"

import {
    useFrame,
    useJointPositions,
    useKinematicsConfiguration,
    useToolIndex
} from "@glowbuzzer/store"

import { useMemo } from "react"
import { Vector3 } from "three"
import { useGLTF } from "@react-three/drei"
import { ExampleAppMenu } from "../../util/ExampleAppMenu"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { MoveableBasicRobot } from "./MoveableBasicRobot"

const DEG90 = Math.PI / 2

const TX40_KIN_CHAIN: RobotKinematicsChainElement[] = [
    { moveable: true },
    { rotateX: -DEG90, moveable: true, jointAngleAdjustment: -DEG90 },
    { rotateX: 0, translateX: 0.225, jointAngleAdjustment: DEG90, moveable: true },
    { rotateX: DEG90, translateZ: 0.035, moveable: true },
    { rotateX: -DEG90, translateZ: 0.225, moveable: true },
    { rotateX: DEG90, moveable: true },
    { translateZ: 0.065 }
]

const DEFAULT_POSITION = new Vector3(0, 0, 325)

const MoveableStaubliRobot = () => {
    const { frameIndex } = useKinematicsConfiguration(0)
    const { translation, rotation } = useFrame(frameIndex, false)

    const jointPositions = useJointPositions(0)
    const toolIndex = useToolIndex(0)

    // load the parts of the robot (links)
    const parts = useMemo(
        () => useGLTF([0, 1, 2, 3, 4, 5, 6].map(j => `/assets/tx40/L${j}.glb`)).map(m => m.scene),
        []
    )

    return (
        <MoveableBasicRobot
            kinematicsChain={TX40_KIN_CHAIN}
            parts={parts}
            jointPositions={jointPositions}
            translation={translation || DEFAULT_POSITION}
            rotation={rotation}
            scale={1000}
        >
            <TriadHelper size={200} />
        </MoveableBasicRobot>
    )
}

const CustomSceneTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return (
            <ThreeDimensionalSceneTile>
                <Suspense fallback={null}>
                    <MoveableStaubliRobot />
                </Suspense>

                {["red", "green", "blue"].map((colour, index) => (
                    <mesh key={colour} position={[500, (index - 1) * 200, 75]}>
                        <boxGeometry args={[150, 150, 150]} />
                        <meshStandardMaterial color={colour} />
                    </mesh>
                ))}
            </ThreeDimensionalSceneTile>
        )
    })
    .build()

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp appName="moveable-staubli">
            <DockLayoutProvider
                tiles={[
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
                    CustomSceneTileDefinition
                ]}
            >
                <ExampleAppMenu title="Moveable Staubli TX40" />
                <DockLayout />
            </DockLayoutProvider>
        </GlowbuzzerApp>
    </StrictMode>
)

//
