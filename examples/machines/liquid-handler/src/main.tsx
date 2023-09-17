/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode, Suspense, useEffect, useMemo, useRef, useState } from "react"

import {
    BasicRobotElement,
    BasicRobotProps,
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
    GCodeTileDefinition,
    GlowbuzzerApp,
    JointDroTileDefinition,
    JointJogTileDefinition,
    PointsTileDefinition,
    RobotKinematicsChainElement,
    ThreeDimensionalSceneTile,
    ThreeDimensionalSceneTileDefinition,
    ToolsTileDefinition
} from "@glowbuzzer/controls"

import { Environment, useGLTF, Box } from "@react-three/drei"

import { useFrame, useThree } from "@react-three/fiber"

import {
    ActivityApi,
    GCodeContextProvider,
    // useFrame,
    useJointPositions,
    useKinematicsConfiguration,
    useToolIndex,
    useKinematicsCartesianPosition,
    useConnection
} from "@glowbuzzer/store"
import { createRoot } from "react-dom/client"

import { ExampleAppMenu } from "../../../util/ExampleAppMenu"

import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import * as THREE from "three"
import { config } from "./config"
import { PlaneShinyMetal } from "../../../util/PlaneShinyMetal"
import { DefaultEnvironment } from "../../../util/DefaultEnvironment"
import { DemoTileDefinition } from "./tiles"
import { appReducers, useAppState } from "./store"
import { BlueLiquid } from "./BlueLiquid"

const DEG90 = Math.PI / 2
const DEG180 = Math.PI

const DEFAULT_POSITION = new THREE.Vector3(0, 0, 0)
const DEFAULT_ROTATION = new THREE.Quaternion(0.7071068, 0, 0, 0.7071068)
// const DEFAULT_ROTATION = new THREE.Quaternion( 0, 0, 0,  1)

const BasicCartesianSimple = ({
    parts,
    jointPositions,
    translation = { x: 0, y: 0, z: 0 },
    rotation = { x: 0, y: 0, z: 0, w: 1 },
    scale = 1,
    children = null
}: BasicRobotProps) => {
    useEffect(() => {
        if (G1.current && G2.current && G3.current) {
            G1.current.position.y = jointPositions[1] / 1000 || 0
            G2.current.position.x = jointPositions[0] / 1000 || 0
            G3.current.position.z = jointPositions[2] / 1000 || 0
        }
    }, [jointPositions])

    const { tipPickUp, setTipPickUp } = useAppState()
    const { firstSuck, setFirstSuck } = useAppState()
    const G0 = useRef(null)
    const G1 = useRef(null)
    const G2 = useRef(null)
    const G3 = useRef(null)

    const tcpPosition = useKinematicsCartesianPosition(0).position.translation

    /*
L0 = base with all tips
L1 = base with row of tips missing
L2 = frame
L3 = xaxis
L4 = yaxis
L5 = pipette
L6 = pipette with tip
 */

    const myref = useRef(4)
    const { invalidate } = useThree()

    const [level, setLevel] = useState(4)

    // useFrame((_, delta) => {
    useFrame(({ invalidate }) => {
        // ref.current.rotation.x += 1 * delta
        // ref.current.rotation.y += 0.5 * delta
        console.log(firstSuck)
        console.log(tipPickUp)
        // if (firstSuck && myref.current > 2) {
        if (firstSuck && level > 2) {
            // myref.current = myref.current - 0.1
            setLevel(level - 0.1)
            console.log(myref.current)
            invalidate()
        }
    })

    return (
        <group
            scale={[scale, scale, scale]}
            // position={[translation.x, translation.y, translation.z]}
            ref={G0}
        >
            {/*<BlueLiquid level={myref.current} />*/}
            <BlueLiquid level={level} />

            <primitive visible={!tipPickUp} rotation={[0, DEG90, 0]} object={parts[0]} />
            <primitive visible={tipPickUp} rotation={[0, DEG90, 0]} object={parts[1]} />
            <primitive rotation={[DEG180, 0, 0]} object={parts[2]} />
            <group ref={G1}>
                //x-axis (beam)
                <primitive
                    rotation={[DEG180, 0, 0]}
                    object={parts[3]}
                    position={[-0.035, 0.1, 0.5]}
                />
                <group ref={G2}>
                    //y-axis (holds pipette)
                    <primitive
                        rotation={[0, DEG90, 0]}
                        object={parts[4]}
                        position={[0.1, 0.2, 0.4]}
                    />
                    <group ref={G3}>
                        //pipette
                        <primitive
                            visible={!tipPickUp}
                            rotation={[0, DEG180, 0]}
                            object={parts[5]}
                            position={[-0.02, 0.06, 0.38]}
                        />
                        <primitive
                            visible={tipPickUp}
                            rotation={[0, DEG180, 0]}
                            object={parts[6]}
                            position={[-0.02, 0.06, 0.38]}
                        />
                    </group>
                </group>
            </group>
        </group>
    )
}

const LiquidHandler = () => {
    // const { frameIndex } = useKinematicsConfiguration(0)
    // const { translation, rotation } = useFrame(frameIndex, false)

    const jointPositions = useJointPositions(0)
    const toolIndex = useToolIndex(0)

    //use parent frame for tranlsation and rotation?
    const { frameIndex } = useKinematicsConfiguration(0)
    // const { parentFrameIndex } = useFrame(frameIndex, false)
    // const { translation, rotation } = useFrame(parentFrameIndex, false)

    // load the parts of the robot (links)

    const parts = useMemo(
        () => useGLTF([0, 1, 2, 3, 4, 5, 6].map(j => `/assets/L${j}.glb`)).map(m => m.scene),
        []
    )

    /*
    L0 = base with all tips
    L1 = base with row of tips missing
    L2 = frame
    L3 = xaxis
    L4 = yaxis
    L5 = pipette
    L6 = pipette with tip
     */

    return (
        <BasicCartesianSimple
            parts={parts}
            jointPositions={jointPositions}
            // translation={translation || DEFAULT_POSITION}
            // rotation={rotation || DEFAULT_ROTATION}

            translation={DEFAULT_POSITION}
            rotation={DEFAULT_ROTATION}
            scale={1000}
        >
            <CylindricalTool toolIndex={toolIndex} />
        </BasicCartesianSimple>
    )
}

const CustomSceneTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return (
            <ThreeDimensionalSceneTile>
                <Suspense fallback={null}>
                    <LiquidHandler />
                </Suspense>
                {/*<PlaneShinyMetal />*/}
                <DefaultEnvironment />
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
                    GCodeTileDefinition,
                    CustomSceneTileDefinition,
                    DemoTileDefinition
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
    // <StrictMode>
    <GlowbuzzerApp appName="liquid-handler" configuration={config} additionalReducers={appReducers}>
        <App />
    </GlowbuzzerApp>
    // </StrictMode>
)

/*

need another contained half hieght
suck up the liquid from first conatiner
move to second container
dispense liquid into second container

 */
