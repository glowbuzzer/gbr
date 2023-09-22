/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode, Suspense, useEffect, useMemo, useRef } from "react"

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
    TelemetryTileDefinition,
    ThreeDimensionalSceneTile,
    ThreeDimensionalSceneTileDefinition,
    ToolsTileDefinition
} from "@glowbuzzer/controls"

import { Environment, useGLTF } from "@react-three/drei"

import {
    ActivityApi,
    GCodeContextProvider,
    useFrame,
    useJointPositions,
    useKinematicsConfiguration,
    useToolIndex
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

const DEG90 = Math.PI / 2
const DEG180 = Math.PI

//things that baffled me:
// must have empty last row or your last joint vanishes
//rotateZ doesnt work on movable joints

// { rotateX: 0, rotateY: 0, rotateZ: 0, translateX:0, translateY:0, translateZ:0.053, moveable: true, prismatic: true },
// { rotateX: 0, rotateY: 0, rotateZ: Math.PI, translateX:-0.015, translateY:0, translateZ:0.35, moveable: true, jointAngleAdjustment: 0, prismatic:true },
// { rotateX: 0, rotateY: 0, rotateZ: 0, translateX:-0.05, translateY:-0.13, translateZ:-0.1, moveable: true, jointAngleAdjustment: 0, prismatic:true },

const ROUTER_KIN_CHAIN: RobotKinematicsChainElement[] = [
    {
        rotateX: DEG90,
        rotateY: 0,
        rotateZ: 0,
        translateX: 0,
        translateY: 0,
        translateZ: 0.053,
        moveable: true
    },
    {
        rotateX: -DEG90,
        rotateY: 0,
        rotateZ: Math.PI,
        translateX: -0.015,
        translateY: 0,
        translateZ: 0.35,
        moveable: true,
        jointAngleAdjustment: 0
    },
    {
        rotateX: DEG90,
        rotateY: DEG180,
        rotateZ: 0,
        translateX: 0.05,
        translateY: 0.13,
        translateZ: -0.1,
        moveable: true,
        jointAngleAdjustment: 0
    },
    {}
]
const DEFAULT_POSITION = new THREE.Vector3(0, 0, 0)
const DEFAULT_ROTATION = new THREE.Quaternion(0.7071068, 0, 0, 0.7071068)
// const DEFAULT_ROTATION = new THREE.Quaternion( 0, 0, 0,  1)

const BasicCartesianSimple = ({
    kinematicsChain,
    parts,
    jointPositions,
    translation = { x: 0, y: 0, z: 0 },
    rotation = { x: 0, y: 0, z: 0, w: 1 },
    scale = 1,
    children = null
}: BasicRobotProps) => {
    useEffect(() => {
        if (G1.current && G2.current && G3.current) {
            G1.current.position.x = jointPositions[0] / 1000 || 0
            G2.current.position.y = jointPositions[1] / 1000 || 0
            G3.current.position.z = jointPositions[2] / 1000 || 0
        }
    }, [jointPositions])

    const G0 = useRef(null)
    const G1 = useRef(null)
    const G2 = useRef(null)
    const G3 = useRef(null)

    return (
        <group
            scale={[scale, scale, scale]}
            // position={[translation.x, translation.y, translation.z]}
            ref={G0}
        >
            <primitive rotation={[Math.PI / 2, 0, 0]} object={parts[0]} />
            <group ref={G1}>
                <primitive
                    rotation={[Math.PI / 2, 0, 0]}
                    object={parts[1]}
                    position={[0, 0, 0.053]}
                />
                <group ref={G2}>
                    <primitive
                        rotation={[Math.PI / 2, Math.PI, 0]}
                        object={parts[2]}
                        position={[-0.015, 0, 0.41]}
                    />
                    <group ref={G3}>
                        <primitive
                            rotation={[Math.PI / 2, Math.PI, 0]}
                            object={parts[3]}
                            position={[0.05, 0.13, 0.3]}
                        />
                    </group>
                </group>
            </group>
        </group>
    )
}

const CncRouter = () => {
    // const { frameIndex } = useKinematicsConfiguration(0)
    // const { translation, rotation } = useFrame(frameIndex, false)

    const jointPositions = useJointPositions(0)
    const toolIndex = useToolIndex(0)

    //use parent frame for tranlsation and rotation?
    const { frameIndex } = useKinematicsConfiguration(0)
    const { parentFrameIndex } = useFrame(frameIndex, false)
    const { translation, rotation } = useFrame(parentFrameIndex, false)

    // load the parts of the robot (links)

    const parts = useMemo(
        () => useGLTF([0, 1, 2, 3].map(j => `/assets/router/L${j}.glb`)).map(m => m.scene),
        []
    )

    return (
        <BasicCartesianSimple
            kinematicsChain={ROUTER_KIN_CHAIN}
            parts={parts}
            jointPositions={jointPositions}
            translation={translation || DEFAULT_POSITION}
            rotation={rotation || DEFAULT_ROTATION}
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
                    <CncRouter />
                </Suspense>
                <PlaneShinyMetal />
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
                    TelemetryTileDefinition,
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
        <GlowbuzzerApp appName="cartesian" configuration={config}>
            <App />
        </GlowbuzzerApp>
    </StrictMode>
)

const BasicCartesian = ({
    kinematicsChain,
    parts,
    jointPositions,
    translation = { x: 0, y: 0, z: 0 },
    rotation = { x: 0, y: 0, z: 0, w: 1 },
    scale = 1,
    children = null
}: BasicRobotProps) => {
    const elements = useMemo(() => {
        const chain: (RobotKinematicsChainElement & { base?: boolean })[] = [
            { base: true, moveable: false }, // force the first element to include the base
            ...kinematicsChain
        ]

        console.log("chain", chain)

        let link_index = 0
        const elements = chain.map((element, index) => {
            const group = new THREE.Group()
            group.name = `G${index}`

            if (parts[index]) {
                parts[index].rotation.set(
                    element.rotateX || 0,
                    element.rotateY || 0,
                    element.rotateZ || 0
                )
            }

            if (element.base || element.moveable) {
                group.name += `L${link_index}`
                parts[index].name = `L${link_index}`
                const link = parts[link_index++]
                link.traverse(function (child) {
                    child.castShadow = true
                })
                group.add(link)
                console.log("group", group)
            }
            const { translateX, translateY, translateZ, rotateX, rotateY, rotateZ } = element

            group.position.set(translateX || 0, translateY || 0, translateZ || 0)

            return {
                group,
                config: element
            } as BasicRobotElement
        })

        console.log("elements", elements)

        const basePart = parts[0]
        basePart.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w)
        const base = elements[0].group
        base.position.set(translation.x, translation.y, translation.z)
        base.scale.setScalar(scale)

        const last = elements[elements.length - 1].group
        last.scale.setScalar(1 / scale)

        return elements
    }, [kinematicsChain, parts, scale]) //why on earth is this firing so much?

    useEffect(() => {
        elements
            .filter(e => e.config.moveable)
            .forEach((e, index) => {
                if (index == 0) {
                    console.log("index 0 e", e)
                    e.group.position.x =
                        (jointPositions[index] / 1000 || 0) + (e.config.translateX || 0)
                }
                if (index == 1) {
                    console.log("index 1 e", e)
                    e.group.position.y =
                        (jointPositions[index] / 1000 || 0) + (e.config.translateY || 0)
                }
                if (index == 2) {
                    console.log("index 2 e", e)
                    e.group.position.z =
                        (jointPositions[index] / 1000 || 0) + (e.config.translateZ || 0)
                }
            })
    }, [elements, jointPositions])

    return (
        elements
            .slice()
            .reverse()
            .reduce((child, parent, index) => {
                return (
                    <primitive key={index} object={parent.group}>
                        {child}
                    </primitive>
                )
            }, <>{children}</>) || (
            /**
             * This is only here to keep react-docgen happy, it will never be rendered
             */ <></>
        )
    )
}
