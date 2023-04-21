/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode, Suspense, useEffect, useMemo, useRef } from "react"

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
    GCodeContextType,
    GCodeMode,
    KC_KINEMATICSCONFIGURATIONTYPE,
    useFrame,
    useJointPositions,
    useKinematicsConfiguration
} from "@glowbuzzer/store"
import { createRoot } from "react-dom/client"

import { ExampleAppMenu } from "../../../util/ExampleAppMenu"
import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import * as THREE from "three"
import { config } from "./config"
import { PlaneShinyMetal } from "../../../util/PlaneShinyMetal"
import { DefaultEnvironment } from "../../../util/DefaultEnvironment"

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
    const parts = useMemo(
        () => useGLTF([0, 1, 2, 3, 4, 5].map(j => `/assets/pocketnc/L${j}.glb`)).map(m => m.scene),
        []
    )

    useEffect(() => {
        G1.current.position.x = jointPositions[0] / 1000 || 0
        G2.current.position.z = jointPositions[1] / 1000 || 0
        G3.current.position.y = jointPositions[2] / 1000 - 0.1 || 0
        G4.current.rotation.x = jointPositions[3] + Math.PI || 0
        G5.current.rotation.y = jointPositions[4] / 1 || 0
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
                <PlaneShinyMetal />
                <DefaultEnvironment />
            </ThreeDimensionalSceneTile>
        )
    })
    .build()

function App() {
    const kc = useKinematicsConfiguration(0)

    // depending on the type of kinematics we want to perform cartesian moves or joint space moves
    const mode: GCodeMode =
        kc.kinematicsConfigurationType === KC_KINEMATICSCONFIGURATIONTYPE.KC_NAKED
            ? GCodeMode.JOINT
            : GCodeMode.CARTESIAN

    const context: GCodeContextType = {
        mode
    }

    function handleToolChange(
        kinematicsConfigurationIndex: number,
        current: number,
        next: number,
        api: ActivityApi
    ) {
        return [api.moveToPosition(null, null, 50), api.setToolOffset(next), api.dwell(500)]
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
                <ExampleAppMenu />
                <DockLayout />
            </DockLayoutProvider>
        </GCodeContextProvider>
    )
}

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp appName="five-axis" configuration={config}>
            <App />
        </GlowbuzzerApp>
    </StrictMode>
)
