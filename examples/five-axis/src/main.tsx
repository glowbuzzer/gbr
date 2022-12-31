/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode, Suspense, useEffect, useMemo, useRef } from "react"

import {
    BasicRobot,
    CartesianDroTileDefinition,
    CartesianJogTileDefinition,
    ConfigEditTileDefinition,
    ConnectTileDefinition,
    CylindricalTool,
    DockLayout,
    DockLayoutProvider,
    DockTileDefinitionBuilder,
    FeedRateTileDefinition,
    FramesTileDefinition,
    GlowbuzzerApp,
    GlowbuzzerTileDefinitionList,
    JointDroTileDefinition,
    JointJogTileDefinition,
    PointsTileDefinition,
    RobotKinematicsChainElement,
    ThreeDimensionalSceneTile,
    ThreeDimensionalSceneTileDefinition,
    ToolsTileDefinition
} from "@glowbuzzer/controls"

import { useGLTF, Environment, Cylinder } from "@react-three/drei"

import {
    GCodeContextProvider,
    SoloActivityApi,
    useKinematics,
    useFrame,
    useJointPositions,
    useKinematicsConfiguration,
    useToolIndex
} from "@glowbuzzer/store"
import { createRoot } from "react-dom/client"

import { ExampleAppMenu } from "../../util/ExampleAppMenu"
import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import * as THREE from "three"
import { puma_560_params } from "../../kinematics/KinChainParams"
import { fk_puma, ik_puma } from "../../kinematics/PumaKin"

const DEG90 = Math.PI / 2
const DEG180 = Math.PI
const DEFAULT_POSITION = new THREE.Vector3(0, 0, 0)
const DEFAULT_ROTATION = new THREE.Quaternion(1, 0, 0, 0)

const FiveAxis = ({ children = null }) => {
    const { frameIndex } = useKinematicsConfiguration(0)

    const jointPositions = useJointPositions(0)

    const { translation, rotation } = useFrame(frameIndex, false)

    const worldAxisZ = new THREE.Vector3(0, 0, 1)

    // load the parts of the robot (links)
    const parts = useGLTF([0, 1, 2, 3, 4, 5].map(j => `/assets/pocketnc/L${j}.glb`)).map(
        m => m.scene
    )

    useEffect(() => {
        G1.current.position.x = jointPositions[0] / 1000
        G2.current.position.z = jointPositions[1] / 1000
        G3.current.position.y = jointPositions[2] / 1000 - 0.1
        G4.current.rotation.x = jointPositions[3] + Math.PI
        G5.current.rotation.y = jointPositions[4] / 1
    }, [jointPositions])

    // // const fk = fk_puma([0, 0, 0, 0, 0, 0], puma_560_dh)
    //
    // const fk = fk_puma(
    //     [
    //         jointPositions[0],
    //         jointPositions[1],
    //         jointPositions[2],
    //         jointPositions[3],
    //         jointPositions[4],
    //         jointPositions[5]
    //     ],
    //     puma_560_params
    // )
    // console.log("fk", fk.position)
    // const ik = ik_puma(0, fk.position, fk.orientation, puma_560_params)
    // console.log("ik", ik)

    const scene = useRef(null)
    const G0 = useRef(null)
    const G1 = useRef(null)
    const G2 = useRef(null)
    const G3 = useRef(null)
    const G4 = useRef(null)
    const G5 = useRef(null)

    return (
        <group rotation={[Math.PI / 2, 0, 0]} ref={scene} scale={[1000, 1000, 1000]}>
            <group ref={G0}>
                //base
                <primitive rotation={[0, 0, 0]} object={parts[0]} position={[0, 0, 0]} />
                <group ref={G1}>
                    <primitive rotation={[0, 0, 0]} object={parts[1]} position={[0, 0, 0]} />
                    <group ref={G2} position={[0, 0, 0]}>
                        <primitive rotation={[0, 0, 0]} object={parts[2]} position={[0, 0, 0]} />
                    </group>
                </group>
                <group ref={G3} position={[0, 0, 0]}>
                    <primitive rotation={[0, 0, 0]} object={parts[3]} />
                    <group ref={G4} position={[0.083860292, 0.165351067, -0.174280342]}>
                        <primitive rotation={[0, Math.PI / 2, 0]} object={parts[4]} />
                        <group ref={G5} position={[-0.1, 0.02, 0]}>
                            <primitive
                                rotation={[-Math.PI / 2, 0, 0]}
                                object={parts[5]}
                                position={[0, 0, 0]}
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
                    <FiveAxis />
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
        api: SoloActivityApi
    ) {
        return [api.moveToPosition(null, null, 50), api.setToolOffset(next), api.dwell(500)]
    }

    return (
        <GCodeContextProvider value={{ handleToolChange }}>
            <DockLayoutProvider
                appName="five axis"
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
        <GlowbuzzerApp>
            <App />
        </GlowbuzzerApp>
    </StrictMode>
)
