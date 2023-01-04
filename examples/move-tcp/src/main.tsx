/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

//frames/connected not connected
//enable/disable mode
//tools

import React, { StrictMode, Suspense, useRef, useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
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
    ToolsTileDefinition
} from "@glowbuzzer/controls"

import type { RadioChangeEvent } from "antd"
import { Radio, Switch, Space } from "antd"
import {
    useConnection,
    useFrame,
    useFrames,
    useJointPositions,
    useKinematicsConfiguration,
    useToolIndex
} from "@glowbuzzer/store"

import * as THREE from "three"
import { useGLTF } from "@react-three/drei"
import { ExampleAppMenu } from "../../util/ExampleAppMenu"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import "./styles.css"
import {
    Trail,
    Float,
    Line,
    Sphere,
    PivotControls,
    Stars,
    Svg,
    OrbitControls,
    PerspectiveCamera,
    useTexture,
    Box
} from "@react-three/drei"
import { useFrame as useFrameR3f } from "@react-three/fiber"
import { fk_tx40, ik_tx40, find_configuration_tx40 } from "../../kinematics/RobotKin"
import { staubli_tx40_dh } from "../../kinematics/KinChainParams"

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

const DEFAULT_POSITION = new THREE.Vector3(0, 0, 325)
const DEFAULT_ROTATION = new THREE.Quaternion()
const StaubliRobot = ({
    freeMovement,
    setFreeMovement,
    waist,
    setWaist,
    elbow,
    setElbow,
    wrist,
    setWrist,
    activeConfiguration,
    setActiveConfiguration,
    tcpControlsActive,
    setTcpControlsActive
}) => {
    const { frameIndex } = useKinematicsConfiguration(0)
    const { translation, rotation } = useFrame(frameIndex, false)

    const { connected } = useConnection()

    const jointPositionsFromControl = useJointPositions(0)

    const [jointPositions, updateJointPositions] = useState([0, 0, 0, 0, 0, 0])

    const toolIndex = useToolIndex(0)

    // load the parts of the robot (links)
    const parts = useGLTF([0, 1, 2, 3, 4, 5, 6].map(j => `/assets/tx40/L${j}.glb`)).map(
        m => m.scene
    )
    const frames = useFrames()

    var configuration = 0

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

    const approximatelyEqual = (v1, v2, tolerance) => {
        return Math.abs(v1 - v2) < tolerance
    }

    function handleDragEnd() {
        if (dragProducedInvalidPosition) {
            console.log("last:matrix4", lastValidWorldMatrix)

            pivotControlRef.current.matrix.copy(lastValidWorldMatrix)
        }
    }

    function handleDrag() {
        // console.log(pivotControlRef.current)
        const controlsWorldPositionVector = new THREE.Vector3()
        const controlScaleVector = new THREE.Vector3()
        const controlsWorldRotationQuaternion = new THREE.Quaternion()
        pivotControlRef.current.matrixWorld.decompose(
            controlsWorldPositionVector,
            controlsWorldRotationQuaternion,
            controlScaleVector
        )

        console.log("worldPositionVector", controlsWorldPositionVector)

        const controlsInRobotFrame = {
            translation: controlsWorldPositionVector,
            rotation: controlsWorldRotationQuaternion
        }

        console.log("controlsInRobotFrame", controlsInRobotFrame)

        console.log("configuration", configuration)

        if (connected) {
            const robotPos = frames.convertToFrame(
                controlsInRobotFrame.translation,
                controlsInRobotFrame.rotation,
                "world",
                1
            )
            controlsInRobotFrame.translation.copy(robotPos.translation)
            controlsInRobotFrame.rotation.copy(robotPos.rotation)
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
        console.log("ik all", ik.all)
        console.log("ik matching", ik.matching)

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

        const jointPositionsNew = freeMovement
            ? ik.all[0].map((angle, index) => angle)
            : ik.matching.map((angle, index) => angle)

        console.log("jointPositionsNew", jointPositionsNew)
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
                tcpWorldPositionVector.copy(robotPos.translation)
                tcpWorldRotationQuaternion.copy(robotPos.rotation)
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
            <BasicRobot
                kinematicsChain={TX40_KIN_CHAIN}
                parts={parts}
                jointPositions={
                    connected && !tcpControlsActive ? jointPositionsFromControl : jointPositions
                }
                translation={translation || DEFAULT_POSITION}
                rotation={rotation || DEFAULT_ROTATION}
                scale={1000}
            ></BasicRobot>
            {tcpControlsActive && (
                <PivotControls
                    ref={pivotControlRef}
                    scale={100}
                    // matrix={startMatrix}
                    onDrag={handleDrag}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    {/*<Sphere ref={sphereRef} args={[10, 10, 10]}>*/}
                    {/*    <meshBasicMaterial color={"red"}/>*/}
                    {/*</Sphere>*/}
                </PivotControls>
            )}
        </>
    )
}

const ControlsPanel = ({
    freeMovement,
    setFreeMovement,
    waist,
    setWaist,
    elbow,
    setElbow,
    wrist,
    setWrist,
    activeConfiguration,
    setActiveConfiguration,
    tcpControlsActive,
    setTcpControlsActive
}) => {
    return (
        <Controls
            controls={{
                freeMovement,
                setFreeMovement,
                waist,
                setWaist,
                elbow,
                setElbow,
                wrist,
                setWrist,
                activeConfiguration,
                setActiveConfiguration,
                tcpControlsActive,
                setTcpControlsActive
            }}
        />
    )
}

const Parent = () => {
    const [freeMovement, setFreeMovement] = useState(true)
    const [waist, setWaist] = useState(0)
    const [elbow, setElbow] = useState(0)
    const [wrist, setWrist] = useState(0)
    const [activeConfiguration, setActiveConfiguration] = useState(0)
    const [tcpControlsActive, setTcpControlsActive] = useState(false)
    return (
        <>
            <ThreeDimensionalSceneTile>
                <Suspense fallback={null}>
                    <StaubliRobot
                        freeMovement={freeMovement}
                        setFreeMovement={setFreeMovement}
                        waist={waist}
                        setWaist={setWaist}
                        elbow={elbow}
                        setElbow={setElbow}
                        wrist={wrist}
                        setWrist={setWrist}
                        activeConfiguration={activeConfiguration}
                        setActiveConfiguration={setActiveConfiguration}
                        tcpControlsActive={tcpControlsActive}
                        setTcpControlsActive={setTcpControlsActive}
                    />
                </Suspense>

                {["red", "green", "blue"].map((colour, index) => (
                    <mesh position={[500, (index - 1) * 200, 75]}>
                        <boxGeometry args={[150, 150, 150]} />
                        <meshStandardMaterial color={colour} />
                    </mesh>
                ))}
            </ThreeDimensionalSceneTile>
            <ControlsPanel
                freeMovement={freeMovement}
                setFreeMovement={setFreeMovement}
                waist={waist}
                setWaist={setWaist}
                elbow={elbow}
                setElbow={setElbow}
                wrist={wrist}
                setWrist={setWrist}
                activeConfiguration={activeConfiguration}
                setActiveConfiguration={setActiveConfiguration}
                tcpControlsActive={tcpControlsActive}
                setTcpControlsActive={setTcpControlsActive}
            />
        </>
    )
}

const CustomSceneTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return <Parent />
    })
    .build()

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp>
            <DockLayoutProvider
                appName={"move tcp"}
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
                <ExampleAppMenu title="Move TCP" />
                <DockLayout />
            </DockLayoutProvider>
        </GlowbuzzerApp>
    </StrictMode>
)

function Controls({ controls }) {
    const {
        freeMovement,
        setFreeMovement,
        waist,
        setWaist,
        elbow,
        setElbow,
        wrist,
        setWrist,
        activeConfiguration,
        setActiveConfiguration,
        tcpControlsActive,
        setTcpControlsActive
    } = controls

    const onChangeWaist = ({ target: { value } }: RadioChangeEvent) => {
        setWaist(value)
    }

    const onChangeElbow = ({ target: { value } }: RadioChangeEvent) => {
        setElbow(value)
    }

    const onChangeWrist = ({ target: { value } }: RadioChangeEvent) => {
        setWrist(value)
    }

    const waistConfigurationName = ["Waist L", "Waist R"]
    const elbowConfigurationName = ["Elbow U", "Elbow D"]
    const wristConfigurationName = ["Wrist U", "Wrist D"]

    const waistConfiguration =
        activeConfiguration == 1 ||
        activeConfiguration == 2 ||
        activeConfiguration == 4 ||
        activeConfiguration == 6
            ? 0
            : 1
    const elbowConfiguration =
        activeConfiguration == 2 ||
        activeConfiguration == 3 ||
        activeConfiguration == 6 ||
        activeConfiguration == 7
            ? 0
            : 1
    const wristConfiguration =
        activeConfiguration == 4 ||
        activeConfiguration == 5 ||
        activeConfiguration == 6 ||
        activeConfiguration == 7
            ? 0
            : 1

    return (
        <div className="tcpControls">
            <h2>TCP controls</h2>
            <h4>Enable TCP controls</h4>
            <div className="tcpSwitch">
                <Space>
                    <Switch onChange={setTcpControlsActive} checked={tcpControlsActive} />
                </Space>
            </div>
            <h4>Free or locked to configuration</h4>
            <div className="tcpSwitch">
                <Space>
                    Locked
                    <Switch
                        disabled={!tcpControlsActive}
                        onChange={setFreeMovement}
                        checked={freeMovement}
                    />
                    Free
                </Space>
            </div>
            <h4>Waist</h4>
            <Radio.Group
                onChange={onChangeWaist}
                disabled={freeMovement || !tcpControlsActive}
                value={waist}
            >
                <Radio value={0}>Waist Left</Radio>
                <Radio value={1}>Waist Right</Radio>
            </Radio.Group>
            <h4>Elbow</h4>
            <Radio.Group
                onChange={onChangeElbow}
                disabled={freeMovement || !tcpControlsActive}
                value={elbow}
            >
                <Radio value={0}>Elbow Up</Radio>
                <Radio value={1}>Elbow Down</Radio>
            </Radio.Group>
            <h4>Wrist</h4>
            <Radio.Group
                onChange={onChangeWrist}
                disabled={freeMovement || !tcpControlsActive}
                value={wrist}
            >
                <Radio value={0}>Wrist Up</Radio>
                <Radio value={1}>Wrist Down</Radio>
            </Radio.Group>
            <h4>Configuration</h4>
            <p>{waistConfigurationName[waistConfiguration]}</p>
            <p>{elbowConfigurationName[elbowConfiguration]}</p>
            <p>{wristConfigurationName[wristConfiguration]}</p>
        </div>
    )
}
