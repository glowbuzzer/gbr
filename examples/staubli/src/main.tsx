/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode, Suspense } from "react"
import { createRoot } from "react-dom/client"
import {
    BasicRobot,
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
    GlowbuzzerApp,
    JointDroTileDefinition,
    JointJogTileDefinition,
    PointsTileDefinition,
    RobotKinematicsChainElement,
    ThreeDimensionalSceneTile,
    ThreeDimensionalSceneTileDefinition,
    ToolsTileDefinition,
    TriadHelper
} from "@glowbuzzer/controls"

import {
    GCodeContextProvider,
    GCodeContextType,
    GCodeMode,
    KC_KINEMATICSCONFIGURATIONTYPE,
    useFrame,
    useJointPositions,
    useKinematicsConfiguration,
    useToolIndex
} from "@glowbuzzer/store"

import { Vector3 } from "three"
import { useGLTF } from "@react-three/drei"
import { ExampleAppMenu } from "../../util/ExampleAppMenu"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"

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

const StaubliRobot = () => {
    const { frameIndex } = useKinematicsConfiguration(0)
    const { translation, rotation } = useFrame(frameIndex, false)

    const jointPositions = useJointPositions(0)
    const toolIndex = useToolIndex(0)

    // load the parts of the robot (links)
    const parts = useGLTF([0, 1, 2, 3, 4, 5, 6].map(j => `/assets/tx40/L${j}.glb`)).map(
        m => m.scene
    )

    return (
        <BasicRobot
            kinematicsChain={TX40_KIN_CHAIN}
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

const CustomSceneTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return (
            <ThreeDimensionalSceneTile>
                <Suspense fallback={null}>
                    <StaubliRobot />
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

const App = () => {
    const kc = useKinematicsConfiguration(0)

    // depending on the type of kinematics we want to perform cartesian moves or joint space moves
    const mode: GCodeMode =
        kc.kinematicsConfigurationType === KC_KINEMATICSCONFIGURATIONTYPE.KC_NAKED
            ? GCodeMode.JOINT
            : GCodeMode.CARTESIAN

    const context: GCodeContextType = {
        mode
    }

    return (
        <GCodeContextProvider value={context}>
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
                    GCodeTileDefinition,
                    CustomSceneTileDefinition
                ]}
            >
                <ExampleAppMenu title="Staubli TX40" />
                <DockLayout />
            </DockLayoutProvider>
        </GCodeContextProvider>
    )
}

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp appName="staubli">
            <App />
        </GlowbuzzerApp>
    </StrictMode>
)
