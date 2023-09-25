/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as THREE from "three"
import { useConnection, useFrames, useJointPositions } from "@glowbuzzer/store"
import React, { useEffect, useRef, useState } from "react"
import { PivotControls } from "@react-three/drei"
import { find_configuration_tx40, fk_tx40, ik_tx40 } from "../../../util/kinematics/RobotKin"
import { staubli_tx40_dh } from "../../../util/kinematics/KinChainParams"
import { StaubliRobot } from "../../../util/StaubliRobot"

const DEFAULT_POSITION = new THREE.Vector3(0, 0, 325)
const DEFAULT_ROTATION = new THREE.Quaternion()

export const DraggableStaubliRobot = ({
    freeMovement,
    waist,
    elbow,
    wrist,
    setActiveConfiguration,
    tcpControlsActive
}) => {
    const { connected } = useConnection()

    const jointPositionsFromControl = useJointPositions(0)

    const [jointPositions, updateJointPositions] = useState([0, 0, 0, 0, 0, 0])

    // load the parts of the robot (links)
    const frames = useFrames()

    let configuration = 0

    if (waist) {
        configuration = 1
    }
    if (elbow) {
        configuration += 2
    }
    if (wrist) {
        configuration += 4
    }

    const [lastValidWorldMatrix, setLastValidWorldMatrix] = useState(new THREE.Matrix4())
    const [dragProducedInvalidPosition, setDragProducedInvalidPosition] = useState(false)

    function handleDragStart() {}

    const approximatelyEqual = (v1: number, v2: number, tolerance: number) => {
        return Math.abs(v1 - v2) < tolerance
    }

    function handleDragEnd() {
        if (dragProducedInvalidPosition) {
            pivotControlRef.current.matrix.copy(lastValidWorldMatrix)
        }
    }

    function handleDrag() {
        const controlsWorldPositionVector = new THREE.Vector3()
        const controlScaleVector = new THREE.Vector3()
        const controlsWorldRotationQuaternion = new THREE.Quaternion()
        pivotControlRef.current.matrixWorld.decompose(
            controlsWorldPositionVector,
            controlsWorldRotationQuaternion,
            controlScaleVector
        )

        const controlsInRobotFrame = {
            translation: controlsWorldPositionVector,
            rotation: controlsWorldRotationQuaternion
        }

        if (connected) {
            const robotPos = frames.convertToFrame(
                controlsInRobotFrame.translation,
                controlsInRobotFrame.rotation,
                "world",
                1
            )
            controlsInRobotFrame.translation.copy(robotPos.translation as any)
            controlsInRobotFrame.rotation.copy(robotPos.rotation as any)
        } else {
            controlsInRobotFrame.translation.sub(DEFAULT_POSITION)
            controlsInRobotFrame.rotation.multiply(DEFAULT_ROTATION)
        }

        const ik = ik_tx40(
            [
                controlsInRobotFrame.translation.x,
                controlsInRobotFrame.translation.y,
                controlsInRobotFrame.translation.z
            ],
            [
                controlsInRobotFrame.rotation.x,
                controlsInRobotFrame.rotation.y,
                controlsInRobotFrame.rotation.z,
                controlsInRobotFrame.rotation.w
            ],
            staubli_tx40_dh,
            configuration
        )

        const jointLimitsDeg = [
            [-180, 180],
            [-125, 125],
            [-138, 138],
            [-90, 75],
            [-270, 270],
            [-20, 133.5]
        ]
        ik.all.map((result, resIndex) => {
            result.map((jointAngle, jaIndex) => {
                if ((jointAngle * 180) / Math.PI < jointLimitsDeg[jaIndex][0]) {
                    ik.all.splice(resIndex, 1)
                }
                if ((jointAngle * 180) / Math.PI > jointLimitsDeg[jaIndex][1]) {
                    ik.all.splice(resIndex, 1)
                }
            })
        })

        const jointPositionsNew = freeMovement ? ik.all[0] : ik.matching

        const fk = fk_tx40(jointPositionsNew, staubli_tx40_dh)

        setActiveConfiguration(find_configuration_tx40(jointPositionsNew, staubli_tx40_dh))

        // compare fk post and orient with the position of the sphere / pivotcontrols
        //if they are not close then it is an illegal position

        if (!approximatelyEqual(controlsInRobotFrame.translation.x, fk.position[0], 0.1)) {
            //todo add in extra tests
            //             approximatelyEqual(controlsInRobotFrame.translation.y, fk.position[1], 0.1)
            //             approximatelyEqual(controlsInRobotFrame.translation.z, fk.position[2], 0.1)
            //             approximatelyEqual(controlsInRobotFrame.rotation.x, fk.orientation[0], 0.1)
            //             approximatelyEqual(controlsInRobotFrame.rotation.y, fk.orientation[2], 0.1)
            //             approximatelyEqual(controlsInRobotFrame.rotation.z, fk.orientation[3], 0.1)
            //             approximatelyEqual(controlsInRobotFrame.rotation.w, fk.orientation[4], 0.1)

            setDragProducedInvalidPosition(true)
            console.log("Invalid position!")
        } else {
            updateJointPositions(jointPositionsNew)
            setDragProducedInvalidPosition(true)
            setLastValidWorldMatrix(pivotControlRef.current.matrixWorld.clone())
        }
    }

    const pivotControlRef = useRef(null)

    const startMatrix = new THREE.Matrix4()

    useEffect(() => {
        if (pivotControlRef.current) {
            const fk = fk_tx40(jointPositions, staubli_tx40_dh)
            const tcpWorldPositionVector = new THREE.Vector3(
                fk.position[0],
                fk.position[1],
                fk.position[2]
            )
            const tcpScaleVector = new THREE.Vector3(1, 1, 1)
            const tcpWorldRotationQuaternion = new THREE.Quaternion(
                fk.orientation[0],
                fk.orientation[1],
                fk.orientation[2],
                fk.orientation[3]
            )

            //original
            // tcpWorldPositionVector.add(DEFAULT_POSITION)

            if (connected) {
                const robotPos = frames.convertToFrame(
                    tcpWorldPositionVector,
                    tcpWorldRotationQuaternion,
                    1,
                    "world"
                )
                tcpWorldPositionVector.copy(robotPos.translation as any)
                tcpWorldRotationQuaternion.copy(robotPos.rotation as any)
            } else {
                tcpWorldPositionVector.add(DEFAULT_POSITION)
                tcpWorldRotationQuaternion.multiply(DEFAULT_ROTATION)
            }

            startMatrix.compose(tcpWorldPositionVector, tcpWorldRotationQuaternion, tcpScaleVector)

            pivotControlRef.current.matrix.copy(startMatrix)
        }
    }, [tcpControlsActive])

    return (
        <>
            <StaubliRobot
                kinematicsConfigurationIndex={0}
                jointPositions={
                    connected && !tcpControlsActive ? jointPositionsFromControl : jointPositions
                }
            />
            {tcpControlsActive && (
                <PivotControls
                    ref={pivotControlRef}
                    scale={100}
                    // matrix={startMatrix}
                    onDrag={handleDrag}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                />
            )}
        </>
    )
}
