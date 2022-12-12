/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode, Suspense } from "react"

import {
    BasicRobot, BasicCartesian, CartesianDroTileDefinition, CartesianJogTileDefinition, ConfigEditTileDefinition, ConnectTileDefinition,
    CylindricalTool,
    DockLayout,
    DockLayoutProvider,
    DockTileDefinitionBuilder, FeedRateTileDefinition, FramesTileDefinition,
    GlowbuzzerApp,
    GlowbuzzerTileDefinitionList, JointDroTileDefinition, JointJogTileDefinition, PointsTileDefinition,
    RobotKinematicsChainElement,
    ThreeDimensionalSceneTile,
    ThreeDimensionalSceneTileDefinition, ToolsTileDefinition
} from "@glowbuzzer/controls"

import { useGLTF, Environment } from "@react-three/drei"

import {
    GCodeContextProvider,
    SoloActivityApi,
    useFrame,
    useJointPositions,
    useKinematicsConfiguration, useToolIndex
} from "@glowbuzzer/store"
import { createRoot } from "react-dom/client"

import { ExampleAppMenu } from "../../util/ExampleAppMenu"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import * as THREE from 'three'

const DEG90 = Math.PI / 2
const DEG180 = Math.PI

//things that baffled me:
// must have empty last row or your last joint vanishes
//rotateZ doesnt work on movable joints


// { rotateX: 0, rotateY: 0, rotateZ: 0, translateX:0, translateY:0, translateZ:0.053, moveable: true, prismatic: true },
// { rotateX: 0, rotateY: 0, rotateZ: Math.PI, translateX:-0.015, translateY:0, translateZ:0.35, moveable: true, jointAngleAdjustment: 0, prismatic:true },
// { rotateX: 0, rotateY: 0, rotateZ: 0, translateX:-0.05, translateY:-0.13, translateZ:-0.1, moveable: true, jointAngleAdjustment: 0, prismatic:true },


const ROUTER_KIN_CHAIN: RobotKinematicsChainElement[] = [
    { rotateX: DEG90, rotateY: 0, rotateZ: 0, translateX:0, translateY:0, translateZ:0.053, moveable: true},
    { rotateX: -DEG90, rotateY: 0, rotateZ: Math.PI, translateX:-0.015, translateY:0, translateZ:0.35, moveable: true, jointAngleAdjustment: 0},
    { rotateX: DEG90, rotateY: DEG180, rotateZ: 0, translateX:0.05, translateY:0.13, translateZ:-0.1, moveable: true, jointAngleAdjustment: 0},
    {}
]
const DEFAULT_POSITION = new THREE.Vector3(0, 0, 0)
const DEFAULT_ROTATION = new THREE.Quaternion( 0.7071068, 0, 0,  0.7071068)
// const DEFAULT_ROTATION = new THREE.Quaternion( 0, 0, 0,  1)


const CncRouter = () => {
    const { frameIndex } = useKinematicsConfiguration(0)
    const { translation, rotation } = useFrame(frameIndex, false)

    const jointPositions = useJointPositions(0)
    const toolIndex = useToolIndex(0)

    // load the parts of the robot (links)
    const parts = useGLTF([0, 1,2,3 ].map(j => `/assets/router/L${j}.glb`)).map(
        m => m.scene
    )

    return (
        <BasicCartesian
            kinematicsChain={ROUTER_KIN_CHAIN}
            parts={parts}
            jointPositions={jointPositions}
            translation={ translation || DEFAULT_POSITION}
            rotation={rotation || DEFAULT_ROTATION}
            scale={100}
        >
            {/*<CylindricalTool toolIndex={toolIndex} />*/}
        </BasicCartesian>
    )
}

const CustomSceneTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return (
            <ThreeDimensionalSceneTile>
                <Suspense fallback={null}>
                    <CncRouter />
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
                appName="cartesian"
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
