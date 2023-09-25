/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode, Suspense, useEffect, useMemo, useRef } from "react";
import { createRoot } from "react-dom/client";
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
} from "@glowbuzzer/controls";

import { useFrame, useJointPositions, useKinematicsConfiguration, useToolIndex } from "@glowbuzzer/store";

import * as THREE from "three";

import { useGLTF } from "@react-three/drei";
import { ExampleAppMenu } from "../../../util/ExampleAppMenu";

import "antd/dist/reset.css";
import "dseg/css/dseg.css";
import "flexlayout-react/style/light.css";
import { baseCoordinates, fk_Stewart, ik_Stewart } from "../../../util/kinematics/PrismaticStewartKin";
import { config } from "./config";
import { PlaneShinyMetal } from "../../../util/PlaneShinyMetal";
import { DefaultEnvironment } from "../../../util/DefaultEnvironment";

const DEFAULT_POSITION = new THREE.Vector3(0, 0, 325)

const StewartPlatform = () => {
    const { frameIndex } = useKinematicsConfiguration(0)
    const { translation, rotation } = useFrame(frameIndex, false)

    const jointPositions = useJointPositions(0)
    const toolIndex = useToolIndex(0)

    const base = useMemo(() => useGLTF("/assets/platform/L0.glb"), [])
    const platform = useMemo(() => useGLTF("/assets/platform/L1.glb"), [])
    const bottomRod = useMemo(() => useGLTF("/assets/platform/L2.glb"), [])
    const bottomRod_1 = useMemo(() => bottomRod.scene.clone(), [bottomRod])
    const bottomRod_2 = useMemo(() => bottomRod.scene.clone(), [bottomRod])
    const bottomRod_3 = useMemo(() => bottomRod.scene.clone(), [bottomRod])
    const bottomRod_4 = useMemo(() => bottomRod.scene.clone(), [bottomRod])
    const bottomRod_5 = useMemo(() => bottomRod.scene.clone(), [bottomRod])
    const bottomRod_6 = useMemo(() => bottomRod.scene.clone(), [bottomRod])

    const bottomRods = [
        bottomRod_1,
        bottomRod_2,
        bottomRod_3,
        bottomRod_4,
        bottomRod_5,
        bottomRod_6
    ]

    const topRod = useMemo(() => useGLTF("/assets/platform/L3.glb"), [])
    const topRod_1 = useMemo(() => topRod.scene.clone(), [topRod])
    const topRod_2 = useMemo(() => topRod.scene.clone(), [topRod])
    const topRod_3 = useMemo(() => topRod.scene.clone(), [topRod])
    const topRod_4 = useMemo(() => topRod.scene.clone(), [topRod])
    const topRod_5 = useMemo(() => topRod.scene.clone(), [topRod])
    const topRod_6 = useMemo(() => topRod.scene.clone(), [topRod])

    const topRods = [topRod_1, topRod_2, topRod_3, topRod_4, topRod_5, topRod_6]

    // const ik = ik_Stewart([0, 0, 300], [0, 0, 0, 1])
    // console.log("original ik", ik)
    //
    // // const ikclone = Array.from(ik)
    // const fk = fk_Stewart(ik.jointPositions, [0, 0, 300], [0, 0, 0, 1])
    // console.log("original fk", fk)

    // [
    // 303.422941311299, 313.466094019752, 310.2774915296628, 313.46613246987704,
    //     303.42301735631395, 300.0000000030167
    // ],

    const gOverall = useRef(null)
    const gBase = useRef(null)
    const gPlatform = useRef(null)

    const gTopRod = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null)
    ]
    const gBottomRod = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null)
    ]

    const defaultPosition = new THREE.Vector3(0, 0, 305)
    const defaultOrientation = new THREE.Quaternion(0, 0, 0, 1)

    const currentPosition = useRef(defaultPosition)
    const currentOrientation = useRef(defaultOrientation)

    var zAxis = new THREE.Vector3(0, 0, 1)

    useEffect(() => {
        if (currentPosition.current) {
            // jointPositions.map((element, index) => {
            //     element + 300
            // })
            //
            //
            if (jointPositions[0] == undefined) {
                for (let i = 0; i < 6; i++) {
                    jointPositions[i] = 0
                }
            }

            console.log("first joints poisitions", jointPositions)
            var tmpJointPositions = [...jointPositions]

            if (tmpJointPositions.length == 0) {
                tmpJointPositions = Array.from({ length: 6 }, () => 305)
            } else {
                for (let i = 0; i < 6; i++) {
                    tmpJointPositions[i] += 305
                }
                // tmpJointPositions.map((element, index) => {
                //     element = element + 300
                // })
            }
            //
            // console.log("jointPositions", jointPositions)
            console.log("tmpJpintPositions", tmpJointPositions)

            // const tmpJointPositions: number[] = [
            //     303.422941311299, 303.422941311299, 303.4229659006384, 303.42288588231526,
            //     303.42288588231526, 303.42282069498333
            // ]

            // const tmpJointPositions: number[] = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1]

            //set the position and orientation of the platform object itself
            gPlatform.current.position.x = currentPosition.current.x / 1000
            gPlatform.current.position.y = currentPosition.current.y / 1000
            gPlatform.current.position.z = currentPosition.current.z / 1000
            gPlatform.current.setRotationFromQuaternion(currentOrientation.current)

            //run ik to get the joint lengths and upper rod positions
            const ik = ik_Stewart(
                [currentPosition.current.x, currentPosition.current.y, currentPosition.current.z],
                [
                    currentOrientation.current.x,
                    currentOrientation.current.y,
                    currentOrientation.current.z,
                    currentOrientation.current.w
                ]
            )

            console.log("rodPositions", ik.rodPositions, "rodLengths", ik.jointPositions)

            // const clonedBaseCoordinates = Array.from(baseCoordinates)
            const clonedBaseCoordinates: THREE.Vector3[] = []

            for (let i = 0; i < 6; i++) {
                clonedBaseCoordinates[i] = new THREE.Vector3(
                    baseCoordinates[i].x,
                    baseCoordinates[i].y,
                    baseCoordinates[i].z
                )
            }

            ik.rodPositions.map((item, i) => {
                gTopRod[i].current.position.x = item.x / 1000
                gTopRod[i].current.position.y = item.y / 1000
                gTopRod[i].current.position.z = item.z / 1000

                //todo
                //vip
                clonedBaseCoordinates[i].applyAxisAngle(zAxis, (60 * Math.PI) / 180)
                // gTopRod[i].current.lookAt(
                //     baseCoordinates[i].x,
                //     baseCoordinates[i].y,
                //     baseCoordinates[i].z
                // )
                //
                // gBottomRod[i].current.lookAt(item.x, item.y, item.z)
            })

            // arr.splice(toIndex, 0, arr.splice(fromIndex, 1)[0]);

            // gBottomRod[0].current.lookAt(
            //     ik.rodPositions[1].x,
            //     ik.rodPositions[1].y,
            //     ik.rodPositions[1].z
            // )
            // gBottomRod[1].current.lookAt(
            //     ik.rodPositions[0].x,
            //     ik.rodPositions[0].y,
            //     ik.rodPositions[0].z
            // )
            // gBottomRod[2].current.lookAt(
            //     ik.rodPositions[5].x,
            //     ik.rodPositions[5].y,
            //     ik.rodPositions[5].z
            // )
            // gBottomRod[3].current.lookAt(
            //     ik.rodPositions[4].x,
            //     ik.rodPositions[4].y,
            //     ik.rodPositions[4].z
            // )
            // gBottomRod[4].current.lookAt(
            //     ik.rodPositions[3].x,
            //     ik.rodPositions[3].y,
            //     ik.rodPositions[3].z
            // )
            // gBottomRod[5].current.lookAt(
            //     ik.rodPositions[2].x,
            //     ik.rodPositions[2].y,
            //     ik.rodPositions[2].z
            // )
            //
            // gTopRod[0].current.lookAt(
            //     clonedBaseCoordinates[1].x,
            //     clonedBaseCoordinates[1].y,
            //     clonedBaseCoordinates[1].z
            // )
            // gTopRod[1].current.lookAt(
            //     clonedBaseCoordinates[0].x,
            //     clonedBaseCoordinates[0].y,
            //     clonedBaseCoordinates[0].z
            // )
            // gTopRod[2].current.lookAt(
            //     clonedBaseCoordinates[5].x,
            //     clonedBaseCoordinates[5].y,
            //     clonedBaseCoordinates[5].z
            // )
            // gTopRod[3].current.lookAt(
            //     clonedBaseCoordinates[4].x,
            //     clonedBaseCoordinates[4].y,
            //     clonedBaseCoordinates[4].z
            // )
            //
            // gTopRod[4].current.lookAt(
            //     clonedBaseCoordinates[3].x,
            //     clonedBaseCoordinates[3].y,
            //     clonedBaseCoordinates[3].z
            // )
            // gTopRod[5].current.lookAt(
            //     clonedBaseCoordinates[2].x,
            //     clonedBaseCoordinates[2].y,
            //     clonedBaseCoordinates[2].z
            // )

            gBottomRod[0].current.lookAt(
                ik.rodPositions[1].x,
                ik.rodPositions[1].y,
                ik.rodPositions[1].z
            )
            gBottomRod[1].current.lookAt(
                ik.rodPositions[2].x,
                ik.rodPositions[2].y,
                ik.rodPositions[2].z
            )
            gBottomRod[2].current.lookAt(
                ik.rodPositions[3].x,
                ik.rodPositions[3].y,
                ik.rodPositions[3].z
            )
            gBottomRod[3].current.lookAt(
                ik.rodPositions[4].x,
                ik.rodPositions[4].y,
                ik.rodPositions[4].z
            )
            gBottomRod[4].current.lookAt(
                ik.rodPositions[5].x,
                ik.rodPositions[5].y,
                ik.rodPositions[5].z
            )
            gBottomRod[5].current.lookAt(
                ik.rodPositions[0].x,
                ik.rodPositions[0].y,
                ik.rodPositions[0].z
            )

            gTopRod[0].current.lookAt(
                clonedBaseCoordinates[5].x,
                clonedBaseCoordinates[5].y,
                clonedBaseCoordinates[5].z
            )
            gTopRod[1].current.lookAt(
                clonedBaseCoordinates[0].x,
                clonedBaseCoordinates[0].y,
                clonedBaseCoordinates[0].z
            )
            gTopRod[2].current.lookAt(
                clonedBaseCoordinates[1].x,
                clonedBaseCoordinates[1].y,
                clonedBaseCoordinates[1].z
            )
            gTopRod[3].current.lookAt(
                clonedBaseCoordinates[2].x,
                clonedBaseCoordinates[2].y,
                clonedBaseCoordinates[2].z
            )

            gTopRod[4].current.lookAt(
                clonedBaseCoordinates[3].x,
                clonedBaseCoordinates[3].y,
                clonedBaseCoordinates[3].z
            )
            gTopRod[5].current.lookAt(
                clonedBaseCoordinates[4].x,
                clonedBaseCoordinates[4].y,
                clonedBaseCoordinates[4].z
            )

            //run fk

            const fk = fk_Stewart(
                tmpJointPositions,
                [currentPosition.current.x, currentPosition.current.y, currentPosition.current.z],
                [
                    currentOrientation.current.x,
                    currentOrientation.current.y,
                    currentOrientation.current.z,
                    currentOrientation.current.w
                ]
            )

            //update the state of currentPosition and currentOrientation with vals calculate with fk from actual joint lengths
            currentPosition.current.x = fk.position[0]
            currentPosition.current.y = fk.position[1]
            currentPosition.current.z = fk.position[2]

            currentOrientation.current.x = fk.orientation[0]
            currentOrientation.current.y = fk.orientation[1]
            currentOrientation.current.z = fk.orientation[2]
            currentOrientation.current.w = fk.orientation[3]
        }
    }, [jointPositions])

    const scale: number = 1000

    return (
        <group ref={gOverall} scale={[scale, scale, scale]}>
            <group ref={gBase}>
                <primitive rotation={[Math.PI, 0, 0]} object={base.scene} position={[0, 0, 0]} />
            </group>
            <group ref={gPlatform}>
                <primitive
                    rotation={[Math.PI, 0, 0]}
                    object={platform.scene}
                    position={[0, 0, 0]}
                />
            </group>
            <group rotation={[0, 0, (60 * Math.PI) / 180]}>
                {baseCoordinates.map((item, i) => (
                    <group
                        key={i}
                        ref={gBottomRod[i]}
                        position={[
                            baseCoordinates[i].x / 1000,
                            baseCoordinates[i].y / 1000,
                            baseCoordinates[i].z / 1000
                        ]}
                    >
                        <primitive
                            rotation={[0, Math.PI, 0]}
                            object={bottomRods[i]}
                            position={[0, 0, 0]}
                        />
                    </group>
                ))}
            </group>

            <group rotation={[0, 0, 0]}>
                {baseCoordinates.map((item, i) => (
                    <group key={i} ref={gTopRod[i]}>
                        <primitive rotation={[0, 0, 0]} object={topRods[i]} position={[0, 0, 0]} />
                    </group>
                ))}
            </group>
        </group>
    )
}

const CustomSceneTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return (
            <ThreeDimensionalSceneTile>
                <Suspense fallback={null}>
                    <StewartPlatform />
                </Suspense>
                <PlaneShinyMetal />
                <DefaultEnvironment />
            </ThreeDimensionalSceneTile>
        )
    })
    .build()

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp appName="stewart_platform" configuration={config}>
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
                <ExampleAppMenu title="Stewart Platform" />
                <DockLayout />
            </DockLayoutProvider>
        </GlowbuzzerApp>
    </StrictMode>
)
