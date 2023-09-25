/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode, Suspense, useEffect, useMemo, useRef } from "react";

/*
offset in scene / groups - frames
spiro gcode
trig  calc
120 magic numb

 */
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

import { useGLTF } from "@react-three/drei";

import { OscillatingMoveTileDefinition } from "../../../util/OscillatingMoveTile";

import {
    ActivityApi,
    GCodeContextProvider,
    useFrame,
    useJointPositions,
    useKinematicsConfiguration
} from "@glowbuzzer/store";
import { createRoot } from "react-dom/client";

import { ExampleAppMenu } from "../../../util/ExampleAppMenu";
import "antd/dist/reset.css";
import "dseg/css/dseg.css";
import "flexlayout-react/style/light.css";
import * as THREE from "three";
import { AngledLinearDeltaFk } from "../../../util/kinematics/AngledLinearDeltaKin";
import { DLE_DR_0001 } from "../../../util/kinematics/KinChainParams";
import { EffectorPoints } from "./effectorPoints";
import { config } from "./config";
import { PlaneShinyMetal } from "../../../util/PlaneShinyMetal";
import { DefaultEnvironment } from "../../../util/DefaultEnvironment";

const AngledLinearDeltaRobot = ({children = null}) => {
    const jointPositions = useJointPositions(0)

    const frameModel = useMemo(() => useGLTF("/assets/dle_dr_0001/IGUS_Delta_Frame.glb"), [])

    const carriageModel1 = useMemo(() => useGLTF("/assets/dle_dr_0001/IGUS_Delta_Carriage.glb"), [])
    const carriageModel2 = useMemo(() => carriageModel1.scene.clone(), [carriageModel1])
    const carriageModel3 = useMemo(() => carriageModel1.scene.clone(), [carriageModel1])

    const rod1Model = useMemo(() => useGLTF("/assets/dle_dr_0001/IGUS_Delta_Rod_Y.glb"), [])
    const rod2Model = useMemo(() => rod1Model.scene.clone(), [rod1Model])
    const rod3Model = useMemo(() => rod1Model.scene.clone(), [rod1Model])
    const rod4Model = useMemo(() => rod1Model.scene.clone(), [rod1Model])
    const rod5Model = useMemo(() => rod1Model.scene.clone(), [rod1Model])
    const rod6Model = useMemo(() => rod1Model.scene.clone(), [rod1Model])

    const effectorModel = useMemo(() => useGLTF("/assets/dle_dr_0001/IGUS_Delta_Effector.glb"), [])

    const worldAxisZ = new THREE.Vector3(0, 0, 1)

    const carriagePivotAdjustments: THREE.Vector3[] = useMemo(() => {
        const offsetRod1 = new THREE.Vector3(
            DLE_DR_0001.carriagePivotOffsetY,
            DLE_DR_0001.carriagePivotOffsetX,
            DLE_DR_0001.carriagePivotOffsetZ
        )
        const offsetRod2 = new THREE.Vector3(
            DLE_DR_0001.carriagePivotOffsetY,
            -DLE_DR_0001.carriagePivotOffsetX,
            DLE_DR_0001.carriagePivotOffsetZ
        )

        const tempAdjustments: THREE.Vector3[] = [
            offsetRod1,
            offsetRod2,
            offsetRod1.clone().applyAxisAngle(worldAxisZ, (-120 * Math.PI) / 180),
            offsetRod2.clone().applyAxisAngle(worldAxisZ, (-120 * Math.PI) / 180),
            offsetRod1.clone().applyAxisAngle(worldAxisZ, (120 * Math.PI) / 180),
            offsetRod2.clone().applyAxisAngle(worldAxisZ, (120 * Math.PI) / 180)
        ]
        return tempAdjustments
    }, [])

    //todo 120??
    const startOffset =
        Math.sqrt(Math.pow(DLE_DR_0001.distanceZ1, 2) + Math.pow(DLE_DR_0001.distanceZ1, 2)) - 120

    console.log("startOffset", startOffset)
    const effectiveTcpRadius = Math.sqrt(3) * DLE_DR_0001.tcpRadius
    const effectiveBaseRadius = Math.sqrt(3) * (DLE_DR_0001.radius1 + DLE_DR_0001.distanceZ1)

    const sliderMovementLength = 146.8 //can calculate this with trig

    const d1 = effectiveBaseRadius - effectiveTcpRadius
    const d2 = DLE_DR_0001.jointLength

    const armTheta = DLE_DR_0001.sliderAngle
    const sqr3 = Math.sqrt(3)
    const cang = Math.cos(armTheta)
    const sang = Math.sin(armTheta)

    const xaStart = (-sqr3 / 3) * d1 + startOffset * cang
    const yaStart = 0
    const zaStart = -startOffset * sang

    const xbStart = (sqr3 / 6) * d1 - 0.5 * startOffset * cang
    const ybStart = 0.5 * (-d1 + sqr3 * startOffset * cang)
    const zbStart = -startOffset * sang

    const xcStart = (sqr3 / 6) * d1 - 0.5 * startOffset * cang
    const ycStart = 0.5 * (d1 - sqr3 * startOffset * cang)
    const zcStart = -startOffset * sang

    const xaEnd = (-sqr3 / 3) * d1 + (startOffset + sliderMovementLength) * cang
    const yaEnd = 0
    const zaEnd = -(startOffset + sliderMovementLength) * sang

    const xbEnd = (sqr3 / 6) * d1 - 0.5 * (startOffset + sliderMovementLength) * cang
    const ybEnd = 0.5 * (-d1 + sqr3 * (startOffset + sliderMovementLength) * cang)
    const zbEnd = (-startOffset - sliderMovementLength) * sang

    const xcEnd = (sqr3 / 6) * d1 - 0.5 * (startOffset + sliderMovementLength) * cang
    const ycEnd = 0.5 * (d1 - sqr3 * (startOffset + sliderMovementLength) * cang)
    const zcEnd = (-startOffset - sliderMovementLength) * sang

    //lines that represent the path the carriages follow
    const line1 = [
        new THREE.Vector3(xaStart, yaStart, zaStart),
        new THREE.Vector3(xaEnd, yaEnd, zaEnd)
    ]
    const line2 = [
        new THREE.Vector3(xbStart, ybStart, zbStart),
        new THREE.Vector3(xbEnd, ybEnd, zbEnd)
    ]
    const line3 = [
        new THREE.Vector3(xcStart, ycStart, zcStart),
        new THREE.Vector3(xcEnd, ycEnd, zcEnd)
    ]

    const ePoints = useMemo(
        () =>
            EffectorPoints(DLE_DR_0001.effectorShaftLength, DLE_DR_0001.effectorInnerCircleRadius),
        []
    )

    const carriage1Ref = useRef(null)
    const carriage2Ref = useRef(null)
    const carriage3Ref = useRef(null)
    const effectorRef = useRef(null)
    const rod1Ref = useRef(null)
    const rod2Ref = useRef(null)
    const rod3Ref = useRef(null)
    const rod4Ref = useRef(null)
    const rod5Ref = useRef(null)
    const rod6Ref = useRef(null)
    const groupRef = useRef(null)

    const {frameIndex} = useKinematicsConfiguration(0)
    const {translation, rotation} = useFrame(frameIndex, true)
    // const { translation, rotation } = useFrame(parentFrameIndex, true)

    console.log("translation", translation)

    const rotationQ = new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)
    const rotationE = new THREE.Euler().setFromQuaternion(rotationQ)

    // const { frameIndex } = useKinematicsConfiguration(0)
    // const machineFrame = useFrame(frameIndex, true)
    // console.log("machineFrame", machineFrame)

    useEffect(() => {
        carriage1Ref.current.rotateOnWorldAxis(worldAxisZ, (90 * Math.PI) / 180)
        carriage2Ref.current.rotateOnWorldAxis(worldAxisZ, (210 * Math.PI) / 180)
        carriage3Ref.current.rotateOnWorldAxis(worldAxisZ, (-210 * Math.PI) / 180)
    }, [])

    useEffect(() => {
        if (
            carriage1Ref.current &&
            carriage2Ref.current &&
            carriage3Ref.current &&
            effectorRef.current &&
            groupRef.current
        ) {
            const carriage1Dir = line1[1].clone().sub(line1[0])
            const carriage2Dir = line2[1].clone().sub(line2[0])
            const carriage3Dir = line3[1].clone().sub(line3[0])

            const carriage1Pos = carriage1Dir.multiplyScalar(
                jointPositions[0] / sliderMovementLength || 0
            )
            const carriage2Pos = carriage2Dir.multiplyScalar(
                jointPositions[1] / sliderMovementLength || 0
            )
            const carriage3Pos = carriage3Dir.multiplyScalar(
                jointPositions[2] / sliderMovementLength || 0
            )

            carriage1Ref.current.position.x = line1[0].x + carriage1Pos.x
            carriage1Ref.current.position.y = line1[0].y + carriage1Pos.y
            carriage1Ref.current.position.z = line1[0].z + carriage1Pos.z

            carriage2Ref.current.position.x = line2[0].x + carriage2Pos.x
            carriage2Ref.current.position.y = line2[0].y + carriage2Pos.y
            carriage2Ref.current.position.z = line2[0].z + carriage2Pos.z

            carriage3Ref.current.position.x = line3[0].x + carriage3Pos.x
            carriage3Ref.current.position.y = line3[0].y + carriage3Pos.y
            carriage3Ref.current.position.z = line3[0].z + carriage3Pos.z

            const fk = AngledLinearDeltaFk(
                [jointPositions[0] || 0, jointPositions[1] || 0, jointPositions[2] || 0],
                DLE_DR_0001
            )
            // const ik = AngledLinearDeltaFk(
            //     [fk.position[0], fk.position[1], fk.position[2]],
            //     DLE_DR_0001
            // )

            //need to update the matrix4 on the object3d before rerading it
            groupRef.current.updateMatrix()
            const fkVecLocal = new THREE.Vector3(fk.position[0], fk.position[1], fk.position[2])

            //apply the position and orientation of the group to the fk result
            const fkVecWorld = new THREE.Vector3(
                fk.position[0],
                fk.position[1],
                fk.position[2]
            ).applyMatrix4(groupRef.current.matrix)

            //set the poisition of the effector mesh
            effectorRef.current.position.x = fkVecLocal.x
            effectorRef.current.position.y = fkVecLocal.y
            effectorRef.current.position.z = fkVecLocal.z

            console.log("adjustments", carriagePivotAdjustments)

            //set the position of the upper pivot point the rod meshes
            const rod1UpperPosition = new THREE.Vector3(
                line1[0].x + carriage1Pos.x + carriagePivotAdjustments[0].x,
                line1[0].y + carriage1Pos.y + carriagePivotAdjustments[0].y,
                line1[0].z + carriage1Pos.z - carriagePivotAdjustments[0].z
            )
            const rod2UpperPosition = new THREE.Vector3(
                line1[0].x + carriage1Pos.x + carriagePivotAdjustments[1].x,
                line1[0].y + carriage1Pos.y + carriagePivotAdjustments[1].y,
                line1[0].z + carriage1Pos.z - carriagePivotAdjustments[1].z
            )

            rod1Ref.current.position.x = rod1UpperPosition.x
            rod1Ref.current.position.y = rod1UpperPosition.y
            rod1Ref.current.position.z = rod1UpperPosition.z

            rod2Ref.current.position.x = rod2UpperPosition.x
            rod2Ref.current.position.y = rod2UpperPosition.y
            rod2Ref.current.position.z = rod2UpperPosition.z

            rod1Ref.current.lookAt(
                fkVecWorld.x + ePoints[5].y,
                fkVecWorld.y + ePoints[5].x,
                fkVecWorld.z + ePoints[5].z
            )

            rod1Ref.current.rotation.z = Math.PI / 2

            rod2Ref.current.lookAt(
                fkVecWorld.x + ePoints[4].y,
                fkVecWorld.y + ePoints[4].x,
                fkVecWorld.z + ePoints[4].z
            )

            rod2Ref.current.rotation.z = Math.PI / 2

            ///note flipped x and y here?
            const rod3UpperPosition = new THREE.Vector3(
                line2[0].x + carriage2Pos.x + carriagePivotAdjustments[2].y,
                line2[0].y + carriage2Pos.y + carriagePivotAdjustments[2].x,
                line2[0].z + carriage2Pos.z - carriagePivotAdjustments[2].z
            )
            const rod4UpperPosition = new THREE.Vector3(
                line2[0].x + carriage2Pos.x - carriagePivotAdjustments[3].y,
                line2[0].y + carriage2Pos.y - carriagePivotAdjustments[3].x,
                line2[0].z + carriage2Pos.z - carriagePivotAdjustments[3].z
            )

            rod3Ref.current.position.x = rod3UpperPosition.x
            rod3Ref.current.position.y = rod3UpperPosition.y
            rod3Ref.current.position.z = rod3UpperPosition.z

            rod4Ref.current.position.x = rod4UpperPosition.x
            rod4Ref.current.position.y = rod4UpperPosition.y
            rod4Ref.current.position.z = rod4UpperPosition.z

            rod3Ref.current.lookAt(
                fkVecWorld.x + ePoints[3].y,
                fkVecWorld.y + ePoints[3].x,
                fkVecWorld.z + ePoints[3].z
            )

            rod3Ref.current.rotation.z = (-210 * Math.PI) / 180

            rod4Ref.current.lookAt(
                fkVecWorld.x + ePoints[2].y,
                fkVecWorld.y + ePoints[2].x,
                fkVecWorld.z + ePoints[2].z
            )

            rod4Ref.current.rotation.z = (-210 * Math.PI) / 180

            const rod5UpperPosition = new THREE.Vector3(
                line3[0].x + carriage3Pos.x + carriagePivotAdjustments[4].y,
                line3[0].y + carriage3Pos.y + carriagePivotAdjustments[4].x,
                line3[0].z + carriage3Pos.z - carriagePivotAdjustments[4].z
            )
            const rod6UpperPosition = new THREE.Vector3(
                line3[0].x + carriage3Pos.x - carriagePivotAdjustments[5].y,
                line3[0].y + carriage3Pos.y - carriagePivotAdjustments[5].x,
                line3[0].z + carriage3Pos.z - carriagePivotAdjustments[5].z
            )

            rod5Ref.current.position.x = rod5UpperPosition.x
            rod5Ref.current.position.y = rod5UpperPosition.y
            rod5Ref.current.position.z = rod5UpperPosition.z

            rod6Ref.current.position.x = rod6UpperPosition.x
            rod6Ref.current.position.y = rod6UpperPosition.y
            rod6Ref.current.position.z = rod6UpperPosition.z

            rod5Ref.current.lookAt(
                fkVecWorld.x + ePoints[1].y,
                fkVecWorld.y + ePoints[1].x,
                fkVecWorld.z + ePoints[1].z
            )

            rod5Ref.current.rotation.z = (210 * Math.PI) / 180

            rod6Ref.current.lookAt(
                fkVecWorld.x + ePoints[0].y,
                fkVecWorld.y + ePoints[0].x,
                fkVecWorld.z + ePoints[0].z
            )

            rod6Ref.current.rotation.z = (210 * Math.PI) / 180
        }
    }, [jointPositions])

    return (
        <>
            <group
                ref={groupRef}
                position={[translation.x, translation.y, translation.z]}
                rotation={[rotationE.x, rotationE.y, rotationE.z]}
            >
                <primitive
                    // visible={false}
                    rotation={[0, 0, Math.PI / 2]}
                    scale={[1000, 1000, 1000]}
                    object={frameModel.scene}
                />

                <primitive
                    ref={carriage1Ref}
                    scale={[1000, 1000, 1000]}
                    rotation={[Math.PI / 4, 0, Math.PI]}
                    object={carriageModel1.scene}
                />

                <primitive
                    ref={carriage2Ref}
                    scale={[1000, 1000, 1000]}
                    rotation={[Math.PI / 4, 0, Math.PI]}
                    object={carriageModel2}
                />

                <primitive
                    ref={carriage3Ref}
                    scale={[1000, 1000, 1000]}
                    rotation={[-Math.PI / 4, 0, 0]}
                    object={carriageModel3}
                />

                <primitive
                    ref={rod1Ref}
                    position={[0, 0, 0]}
                    scale={[1000, 1000, 1000]}
                    object={rod1Model.scene}
                />
                <primitive
                    ref={rod2Ref}
                    position={[0, 0, 0]}
                    scale={[1000, 1000, 1000]}
                    object={rod2Model}
                />

                <primitive
                    ref={rod3Ref}
                    position={[0, 0, 0]}
                    scale={[1000, 1000, 1000]}
                    object={rod3Model}
                />
                <primitive
                    ref={rod4Ref}
                    position={[0, 0, 0]}
                    scale={[1000, 1000, 1000]}
                    object={rod4Model}
                />

                <primitive
                    ref={rod5Ref}
                    position={[0, 0, 0]}
                    scale={[1000, 1000, 1000]}
                    object={rod5Model}
                />

                <primitive
                    ref={rod6Ref}
                    position={[0, 0, 0]}
                    scale={[1000, 1000, 1000]}
                    object={rod6Model}
                />

                <primitive
                    ref={effectorRef}
                    scale={[1000, 1000, 1000]}
                    object={effectorModel.scene}
                    rotation={[0, 0, Math.PI / 2]}
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
                    <AngledLinearDeltaRobot/>
                </Suspense>
                <PlaneShinyMetal/>
                <DefaultEnvironment/>
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
        <GCodeContextProvider value={{handleToolChange}}>
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
                    CustomSceneTileDefinition,
                    OscillatingMoveTileDefinition
                ]}
            >
                <ExampleAppMenu/>
                <DockLayout/>
            </DockLayoutProvider>
        </GCodeContextProvider>
    )
}

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp appName="angled-linear-delta" configuration={config}>
            <App/>
        </GlowbuzzerApp>
    </StrictMode>
)
