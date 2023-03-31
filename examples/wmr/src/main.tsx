/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode, Suspense, useEffect, useRef } from "react"

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
    GlowbuzzerApp,
    JointDroTileDefinition,
    JointJogTileDefinition,
    PointsTileDefinition,
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
    useKinematicsCartesianPosition,
    useKinematicsConfiguration
} from "@glowbuzzer/store"
import { createRoot } from "react-dom/client"

import { ExampleAppMenu } from "../../util/ExampleAppMenu"
import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import * as THREE from "three"

const DEG90 = Math.PI / 2
const DEG180 = Math.PI
const DEFAULT_POSITION = new THREE.Vector3(0, 0, 0)
const DEFAULT_ROTATION = new THREE.Quaternion(1, 0, 0, 0)

const Wmr = ({ children = null }) => {
    const { frameIndex } = useKinematicsConfiguration(0)

    const jointPositions = useJointPositions(0)
    const cartesianPosition = useKinematicsCartesianPosition(0)
    const { translation, rotation } = useFrame(frameIndex, false)

    const worldAxisZ = new THREE.Vector3(0, 0, 1)

    // load the parts of the robot (links)
    const parts = useGLTF([0, 1, 2].map(j => `/assets/bot/L${j}.glb`)).map(m => m.scene)

    useEffect(() => {
        if (baseRef.current && leftWheeelRef.current && rightWheelRef) {
            baseRef.current.position.x = cartesianPosition.position.translation.x / 1000
            baseRef.current.position.y = cartesianPosition.position.translation.y / 1000

            // const q = new THREE.Quaternion(cartesianPosition.position.rotation.x,)
            baseRef.current.quaternion.set(
                cartesianPosition.position.rotation.x,
                cartesianPosition.position.rotation.y,
                cartesianPosition.position.rotation.z,
                cartesianPosition.position.rotation.w
            )
            console.log(jointPositions[0])
            console.log(cartesianPosition.position.translation.x)
            leftWheeelRef.current.rotation.y = jointPositions[0] || 0
            rightWheelRef.current.rotation.y = jointPositions[1] || 0
        }
    }, [jointPositions])

    const sceneRef = useRef(null)
    const baseRef = useRef(null)
    const leftWheeelRef = useRef(null)
    const rightWheelRef = useRef(null)

    return (
        <group rotation={[Math.PI, 0, 0]} ref={sceneRef} scale={[1000, 1000, 1000]}>
            <group ref={baseRef}>
                <primitive rotation={[0, 0, 0]} object={parts[0]} position={[0, 0, 0]} />
                <group position={[0, -0.07735, -0.03045]}>
                    <primitive
                        ref={leftWheeelRef}
                        rotation={[0, 0, Math.PI / 2]}
                        object={parts[1]}
                    />
                </group>
                <group position={[0, 0.07735, -0.03045]}>
                    <primitive
                        ref={rightWheelRef}
                        rotation={[0, 0, -Math.PI / 2]}
                        object={parts[2]}
                    />
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
                    <Wmr />
                </Suspense>
                <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr" />
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
        <GlowbuzzerApp appName="wmr">
            <App />
        </GlowbuzzerApp>
    </StrictMode>
)
