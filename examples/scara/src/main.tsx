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
import { fk_RrprScara, ik_RrprScara } from "../../kinematics/RrprScaraKin"
import { staubli_ts2_40_dh, staubli_tx40_dh } from "../../kinematics/KinChainParams"
import { fk_tx40, ik_tx40 } from "../../kinematics/RobotKin"

const DEFAULT_POSITION = new THREE.Vector3(0, 0, 0)
const DEG90 = Math.PI / 2

const TS2_40_KIN_CHAIN: RobotKinematicsChainElement[] = [
    { rotateY: Math.PI },
    { rotateX: -DEG90, moveable: true, jointAngleAdjustment: -DEG90 },
    {}
]

const ScaraRobot = ({ children = null }) => {
    const jointPositions = useJointPositions(0)
    // const {frameIndex} = useKinematicsConfiguration(0)

    const { frameIndex } = useKinematicsConfiguration(0)
    const { parentFrameIndex } = useFrame(frameIndex, true)
    const { translation, rotation } = useFrame(parentFrameIndex, true)

    // const {translation, rotation} = useFrame(frameIndex, false)

    // load the parts of the robot (links)
    const parts = useGLTF([0, 1, 2, 3].map(j => `/assets/ts2_40/L${j}.glb`)).map(m => m.scene)

    fk_tx40([0, 0, 0, 0, 0, 0], staubli_tx40_dh)

    // const fk = fk_RrprScara(0, 0, 0, 0)

    // const fk = fk_RrprScara(
    //     (-31.04 * Math.PI) / 180,
    //     (59.25 * Math.PI) / 180,
    //     0,
    //     (70 * Math.PI) / 180
    // )

    const fk = fk_RrprScara(
        (-31.04 * Math.PI) / 180,
        (59.25 * Math.PI) / 180,
        150,
        (70 * Math.PI) / 180,
        staubli_ts2_40_dh
    )

    const fkq = new THREE.Quaternion(
        fk.orientation[0],
        fk.orientation[1],
        fk.orientation[2],
        fk.orientation[3]
    )

    const fke = new THREE.Euler().setFromQuaternion(fkq)

    console.log("fk position", fk.position[0], fk.position[1], fk.position[2])
    console.log(
        "fk orientation",
        (fke.x * 180) / Math.PI,
        (fke.y * 180) / Math.PI,
        (fke.z * 180) / Math.PI
    )

    const ik = ik_RrprScara(
        [fk.position[0], fk.position[1], fk.position[2]],
        [fk.orientation[0], fk.orientation[1], fk.orientation[2], fk.orientation[3]],
        staubli_ts2_40_dh
    )

    console.log(
        "ik",
        ik.map(outer => outer.map(inner => (inner * 180) / Math.PI))
    )

    // <BasicRobot
    // kinematicsChain={TS2_40_KIN_CHAIN}
    // parts={parts}
    // jointPositions={jointPositions}
    // translation={translation || DEFAULT_POSITION}
    // rotation={rotation}
    // scale={1000}
    //     >
    //     <CylindricalTool toolIndex={toolIndex} />
    // </BasicRobot>

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
        <GlowbuzzerApp appName="scara robot">
            <App />
        </GlowbuzzerApp>
    </StrictMode>
)
