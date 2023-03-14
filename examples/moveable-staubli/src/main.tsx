/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode, Suspense } from "react"
import { createRoot } from "react-dom/client"
import { useRef } from "react"
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
import { useGLTF, Environment } from "@react-three/drei"
import { ExampleAppMenu } from "../../util/ExampleAppMenu"

import * as THREE from "three"

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
    const basejoints = useJointPositions(1)
    const toolIndex = useToolIndex(0)

    // load the parts of the robot (links)
    const parts = useMemo(
        () => useGLTF([0, 1, 2, 3, 4, 5, 6].map(j => `/assets/tx40/L${j}.glb`)).map(m => m.scene),
        []
    )

    const baseRef = useRef()

    const trackModel = useMemo(() => useGLTF("/assets/moveable_track.glb"), [])
    const baseModel = useMemo(() => useGLTF("/assets/moveable_base.glb"), [])

    return (
        <>
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

            <primitive
                scale={[500, 500, 500]}
                rotation={[0, Math.PI, Math.PI / 2]}
                position={[-2000, 0, 0]}
                object={trackModel.scene}
            />
            <primitive
                ref={baseRef}
                scale={[500, 500, 500]}
                rotation={[0, Math.PI, Math.PI / 2]}
                position={[jointPositions[6] * 10 || 0, 0, 400]}
                object={baseModel.scene}
            />
        </>
    )
}

const extent = 3000

const CustomSceneTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return (
            <ThreeDimensionalSceneTile noGridHelper={true}>
                <Suspense fallback={null}>
                    <MoveableStaubliRobot />
                    <>
                        <gridHelper
                            args={[2 * extent, 20, undefined, 0xd0d0d0]}
                            rotation={new THREE.Euler(Math.PI / 2)}
                        />

                        <group position={new Vector3((-extent * 11) / 10, -extent / 5, 0)}>
                            <TriadHelper size={extent / 4} />
                        </group>
                    </>
                </Suspense>
                <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr" />

                {/*{["red", "green", "blue"].map((colour, index) => (*/}
                {/*    <mesh key={colour} position={[500, (index - 1) * 200, 75]}>*/}
                {/*        <boxGeometry args={[150, 150, 150]} />*/}
                {/*        <meshStandardMaterial color={colour} />*/}
                {/*    </mesh>*/}
                {/*))}*/}
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
