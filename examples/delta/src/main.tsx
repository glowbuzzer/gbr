/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode, Suspense, useEffect, useMemo, useRef } from "react"

import {
    BasicRobot,
    BasicCartesian,
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
import {
    RevoluteDeltaFk,
    RevoluteDeltaIk,
    revoluteDeltaRobot
} from "../../kinematics/RevoluteDeltaKin"
import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import * as THREE from "three"

const DEG90 = Math.PI / 2

type TriangleExtrudedProps = {
    vertices: THREE.Vector3[]
    depth: number
    position: number[]
    color: string
}

const TriangleExtruded = ({ vertices, depth, position, color }: TriangleExtrudedProps) => {
    const shape = new THREE.Shape()
    shape.moveTo(vertices[0].x, vertices[0].y)
    shape.lineTo(vertices[1].x, vertices[1].y)
    shape.lineTo(vertices[2].x, vertices[2].y)
    shape.lineTo(vertices[0].x, vertices[0].y)

    const extrudeSettings = {
        steps: 2,
        depth: depth,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 1
    }

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)

    return (
        <mesh position={[position[0], position[1], position[2]]} geometry={geometry}>
            <meshStandardMaterial
                attach="material"
                color={color}
                wireframe={false}
                side={THREE.DoubleSide}
            />
        </mesh>
    )
}

const basicDelta: revoluteDeltaRobot = {
    effectorTriangleSideLength: 150,
    baseTriangleSideLength: 207.85,
    lowerJointLength: 200,
    upperJointLength: 100
}

type threeDimensionDeltaModel = {
    meshEffectorTriangleSideLength: number
    meshBaseTriangleSideLength: number
    meshUpperLinkDiameter: number
}

const basicDeltaModel: threeDimensionDeltaModel = {
    meshEffectorTriangleSideLength: 150,
    meshBaseTriangleSideLength: 207.85,
    meshUpperLinkDiameter: 3
}

const DeltaRobot = ({ children = null }) => {
    const baseZ = 250
    // const baseTriangleLength = 207.85
    // const effectorTriangleLength = 150
    // const upperLinkLength = 100
    // const lowerLinkLength = 200
    // const upperLinkDiameter = 3

    // const e = 150.0;     // end effector
    // const  f = 207.85;     // base
    // const  re = 200.0;
    // const  rf = 100.0;

    const baseVertices = [
        new THREE.Vector3(0, (Math.sqrt(3) * basicDeltaModel.meshBaseTriangleSideLength) / 3, 0),
        new THREE.Vector3(
            -basicDeltaModel.meshBaseTriangleSideLength / 2,
            (-Math.sqrt(3) * basicDeltaModel.meshBaseTriangleSideLength) / 6,
            0
        ),
        new THREE.Vector3(
            basicDeltaModel.meshBaseTriangleSideLength / 2,
            (-Math.sqrt(3) * basicDeltaModel.meshBaseTriangleSideLength) / 6,
            0
        )
    ]
    const baseAttachPoints = [
        new THREE.Vector3(0, (-Math.sqrt(3) * baseTriangleLength) / 6, 0),
        new THREE.Vector3(baseTriangleLength / 4, (Math.sqrt(3) * baseTriangleLength) / 12, 0),
        new THREE.Vector3(-baseTriangleLength / 4, (Math.sqrt(3) * baseTriangleLength) / 12, 0)
    ]

    const effectorVertices = [
        new THREE.Vector3(0, (Math.sqrt(3) * effectorTriangleLength) / 3, 0),
        new THREE.Vector3(
            -effectorTriangleLength / 2,
            (-Math.sqrt(3) * effectorTriangleLength) / 6,
            0
        ),
        new THREE.Vector3(
            effectorTriangleLength / 2,
            (-Math.sqrt(3) * effectorTriangleLength) / 6,
            0
        )
    ]

    const { jointPositions } = useKinematics(0)

    const rotAxis1 = new THREE.Vector3(1, 0, 0).normalize()

    const rotAxis2 = new THREE.Vector3(-0.5, Math.sqrt(3) / 2, 0).normalize()

    const rotAxis3 = new THREE.Vector3(0.5, Math.sqrt(3) / 2, 0).normalize()

    useEffect(() => {
        link1Ref.current.setRotationFromAxisAngle(rotAxis1, jointPositions[0] || 0)
        link2Ref.current.setRotationFromAxisAngle(rotAxis2, jointPositions[1] + Math.PI || +Math.PI)
        link3Ref.current.setRotationFromAxisAngle(rotAxis3, Math.PI - jointPositions[2] || Math.PI)

        const fk = RevoluteDeltaFk(
            [jointPositions[0] || 0, jointPositions[1] || 0, jointPositions[2] || 0],
            basicDelta
        )
        const ik = RevoluteDeltaIk(
            [fk.position[0], fk.position[1], fk.position[2]],
            [0, 0, 0, 1],
            basicDelta
        )

        effectorRef.current.position.x = fk.position[0]
        effectorRef.current.position.y = fk.position[1]
        effectorRef.current.position.z = fk.position[2]

        console.log("fk", fk.position[0], fk.position[1], fk.position[2])
        console.log("ik", (ik[0] * 180) / Math.PI, (ik[1] * 180) / Math.PI, (ik[2] * 180) / Math.PI)
    }, [jointPositions])

    const robotRef = useRef(null)
    const effectorRef = useRef(null)
    const link1Ref = useRef(null)
    const link2Ref = useRef(null)
    const link3Ref = useRef(null)

    const ref1 = useRef(null)
    const ref2 = useRef(null)
    const ref3 = useRef(null)

    return (
        // <group ref={robotRef}>
        <>
            <TriangleExtruded
                vertices={baseVertices}
                position={[0, 0, baseZ]}
                color={"grey"}
                depth={3}
            />

            <group ref={effectorRef} rotation={[0, 0, 0]}>
                <TriangleExtruded
                    vertices={effectorVertices}
                    position={[0, 0, 0]}
                    color={"grey"}
                    depth={3}
                />
            </group>

            <group ref={link1Ref} position={[baseAttachPoints[0].x, baseAttachPoints[0].y, baseZ]}>
                <Cylinder
                    ref={ref1}
                    args={[
                        basicDeltaModel.meshUpperLinkDiameter,
                        basicDeltaModel.meshUpperLinkDiameter,
                        basicDeltaModel.meshUpperLinkDiameter
                    ]}
                    position={[0, -(upperLinkLength / 2), 0]}
                />
            </group>

            <group ref={link2Ref} position={[baseAttachPoints[1].x, baseAttachPoints[1].y, baseZ]}>
                <Cylinder
                    ref={ref2}
                    args={[
                        basicDeltaModel.meshUpperLinkDiameter,
                        basicDeltaModel.meshUpperLinkDiameter,
                        basicDeltaModel.meshUpperLinkDiameter
                    ]}
                    position={[(-upperLinkLength * Math.sqrt(3)) / 4, -upperLinkLength / 4, 0]}
                    rotation={[0, 0, (-60 * Math.PI) / 180]}
                />
            </group>

            <group ref={link3Ref} position={[baseAttachPoints[2].x, baseAttachPoints[2].y, baseZ]}>
                <Cylinder
                    ref={ref3}
                    args={[
                        basicDeltaModel.meshUpperLinkDiameter,
                        basicDeltaModel.meshUpperLinkDiameter,
                        basicDeltaModel.meshUpperLinkDiameter
                    ]}
                    position={[(upperLinkLength * Math.sqrt(3)) / 4, -upperLinkLength / 4, 0]}
                    rotation={[0, 0, (-120 * Math.PI) / 180]}
                />
            </group>
        </>
    )
}

const CustomSceneTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return (
            <ThreeDimensionalSceneTile>
                <Suspense fallback={null}>
                    <DeltaRobot />
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
        <GCodeContextProvider value={{ handleToolChange }} appName="delta">
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
        <GlowbuzzerApp>
            <App />
        </GlowbuzzerApp>
    </StrictMode>
)
