/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode, Suspense, useEffect } from "react"

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
    GlowbuzzerApp,
    JointDroTileDefinition,
    JointJogTileDefinition,
    PointsTileDefinition,
    RobotKinematicsChainElement,
    ThreeDimensionalSceneTile,
    ThreeDimensionalSceneTileDefinition,
    ToolsTileDefinition
} from "@glowbuzzer/controls"

import { Environment, useGLTF } from "@react-three/drei"

import {
    ActivityApi,
    GCodeContextProvider,
    useFrame,
    useJointPositions,
    useKinematicsConfiguration
} from "@glowbuzzer/store"
import { createRoot } from "react-dom/client"

import { ExampleAppMenu } from "../../../util/ExampleAppMenu"
import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import * as THREE from "three"
import { puma_560_params } from "../../../util/kinematics/KinChainParams"
import { fk_puma, ik_puma } from "../../../util/kinematics/PumaKin"
import { config } from "./config"
import { DefaultEnvironment } from "../../../util/DefaultEnvironment"

const DEG90 = Math.PI / 2
const DEG180 = Math.PI
const DEFAULT_POSITION = new THREE.Vector3(0, 0, 0)
const DEFAULT_ROTATION = new THREE.Quaternion(1, 0, 0, 0)

const PUMA_560_KIN_CHAIN: RobotKinematicsChainElement[] = [
    {
        moveable: true,
        translateZ: -0.62357,
        rotateX: Math.PI,
        rotateY: 0,
        jointAngleAdjustment: -DEG90
    },
    {
        rotateY: DEG90,
        rotateX: Math.PI,
        translateX: -0.16764,
        moveable: true,
        jointAngleAdjustment: DEG180
    },
    {
        rotateX: 0,
        translateY: 0.4318,
        translateZ: 0.0762,
        jointAngleAdjustment: DEG180,
        moveable: true
    },
    {
        rotateY: DEG90,
        translateX: 0.37211,
        translateZ: -0.0381,
        jointAngleAdjustment: 0,
        moveable: true
    },
    { rotateX: DEG90, translateZ: 0.05994, jointAngleAdjustment: Math.PI, moveable: true },
    { translateZ: 0.065 }
]

const Puma560 = ({ children = null }) => {
    const { frameIndex } = useKinematicsConfiguration(0)

    const jointPositions = useJointPositions(0)

    const { translation, rotation } = useFrame(frameIndex, false)

    const worldAxisZ = new THREE.Vector3(0, 0, 1)

    // load the parts of the robot (links)
    const parts = useGLTF([0, 1, 2, 3, 4, 5].map(j => `/assets/puma_560/L${j}.glb`)).map(
        m => m.scene
    )

    useEffect(() => {
        const pos = new THREE.Vector3()
        parts[5].localToWorld(pos)

        console.log(pos)
    }, [jointPositions])

    // const fk = fk_puma([0, 0, 0, 0, 0, 0], puma_560_dh)

    const fk = fk_puma(
        [
            jointPositions[0],
            jointPositions[1],
            jointPositions[2],
            jointPositions[3],
            jointPositions[4],
            jointPositions[5]
        ],
        puma_560_params
    )
    console.log("fk", fk.position)
    const ik = ik_puma(0, fk.position, fk.orientation, puma_560_params)
    console.log("ik", ik)
    return (
        <BasicRobot
            kinematicsChain={PUMA_560_KIN_CHAIN}
            parts={parts}
            jointPositions={jointPositions}
            translation={translation || DEFAULT_POSITION}
            rotation={rotation || DEFAULT_ROTATION}
            scale={1000}
        ></BasicRobot>
    )
}

const CustomSceneTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return (
            <ThreeDimensionalSceneTile>
                <Suspense fallback={null}>
                    <Puma560 />
                </Suspense>
                <DefaultEnvironment />
            </ThreeDimensionalSceneTile>
        )
    })
    .build()

function App() {
    function handleToolChange(
        kinematicsConfigurationIndex: number,
        current: number,
        next: number,
        api: ActivityApi
    ) {
        return [api.moveToPosition(null, null, 50), api.setToolOffset(next), api.dwell(500)]
    }

    return (
        <GCodeContextProvider value={{ handleToolChange }}>
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
                <ExampleAppMenu />
                <DockLayout />
            </DockLayoutProvider>
        </GCodeContextProvider>
    )
}

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp appName="puma560" configuration={config}>
            <App />
        </GlowbuzzerApp>
    </StrictMode>
)
