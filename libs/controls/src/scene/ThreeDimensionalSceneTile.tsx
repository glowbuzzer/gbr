/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useMemo, useRef, useState, useContext } from "react"
import { ReactReduxContext } from "react-redux"
import {
    useConfig,
    useFrames,
    useKinematics,
    usePreview,
    useToolConfig,
    useToolIndex,
    useToolPath
} from "@glowbuzzer/store"
import { ToolPath } from "./ToolPath"
import { Canvas } from "@react-three/fiber"
import {
    GizmoHelper,
    GizmoViewcube,
    OrbitControls,
    PerspectiveCamera,
    Plane,
    useContextBridge
} from "@react-three/drei"
import { Euler, Vector3 } from "three"
import { WorkspaceDimensions } from "./WorkspaceDimension"
import { PreviewPath } from "./PreviewPath"
import { RobotModel } from "./robots"
import { TcpRobot } from "./TcpRobot"
import { TcpFrustum } from "./TcpFrustum"
import { TriadHelper } from "./TriadHelper"
import { ThreeDimensionalSceneShowFramesButton } from "./ThreeDimensionalSceneShowFramesButton"
import { DockToolbar, DockToolbarButtonGroup } from "../dock/DockToolbar"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"
import { ReactComponent as BlockIcon } from "@material-symbols/svg-400/outlined/block.svg"
import { ReactComponent as ShowChartIcon } from "@material-symbols/svg-400/outlined/show_chart.svg"
import { ReactComponent as AutoGraphIcon } from "@material-symbols/svg-400/outlined/auto_graph.svg"

// const LD = 1000
//
// const lighting = [
//     [0, -LD, LD],
//     [LD, -LD, LD],
//     [-LD, LD, LD]
//     // [LD, LD, -LD / 2]
// ]

type ThreeDimensionalSceneTileProps = {
    /** Optional robot model information */
    model?: RobotModel
    /** If true, trace of tool path will not be shown */
    hideTrace?: boolean
    /** If true, preview of tool path will not be shown */
    hidePreview?: boolean
    /**Optional, If true no camera will be provided in the canvas*/
    noCamera?: boolean
    /**Optional, If true no controls will be provided in the canvas*/
    noControls?: boolean
    /**Optional, If true no lighting will be provided in the canvas*/
    noLighting?: boolean
    /**Optional, If true no gridHelper will be provided in the canvas (& axis triad)*/
    noGridHelper?: boolean
    /**Optional, If true no viewCube will be provided in the canvas*/
    noViewCube?: boolean
    /** Function to return the maximum extent of the view */
    getExtent?: (maxExtent: number) => void
    /** Optional react-three-fiber children to render */
    children?: React.ReactNode
}

const ThreeDimensionalSceneLighting = props => {
    const pointLightRef = useRef()
    // useHelper(pointLightRef, PointLightHelper, 100, "magenta")

    return (
        <>
            <ambientLight color={"grey"} />
            <pointLight
                position={[0, 0, props.distance]}
                color={"white"}
                ref={pointLightRef}
                castShadow={true}
                distance={props.distance * 2}
                shadow-mapSize-height={512}
                shadow-mapSize-width={512}
                shadow-radius={10}
                shadow-bias={-0.0001}
            />
        </>
    )
}

const defaultGetExtentFunc = () => {}

/**
 * The tool path tile provides a 3d visualisation of the planned motion (from G-code) and the actual path
 * taken while the machine is running.
 *
 * The `model` property allows you to provide the location of model files for your machine and information
 * about the joints in the model. The joints in the model will be adjusted according to the actual position of the
 * physical joints on the machine. For an example of this in practice, refer to the
 * [Staubli example project](https://github.com/glowbuzzer/gbr/blob/main/examples/staubli/src/main.tsx)
 */
export const ThreeDimensionalSceneTile = ({
    model = undefined,
    noLighting = false,
    noCamera = false,
    noControls = false,
    noGridHelper = false,
    noViewCube = false,
    getExtent = defaultGetExtentFunc,
    hideTrace: defaultHideTrace = undefined,
    hidePreview: defaultHidePreview = undefined,
    children = undefined
}: ThreeDimensionalSceneTileProps) => {
    const { path, reset } = useToolPath(0)
    const toolIndex = useToolIndex(0)
    const toolConfig = useToolConfig(toolIndex)

    const [hideTrace, setHideTrace] = useState(defaultHideTrace || false)
    const [hidePreview, setHidePreview] = useState(defaultHidePreview || false)

    const { jointPositions, translation, rotation, frameIndex } = useKinematics(0)
    const { convertToFrame } = useFrames()

    const { translation: world_translation } = convertToFrame(
        translation,
        rotation,
        frameIndex,
        "world"
    )

    const { segments, highlightLine, disabled } = usePreview()
    const config = useConfig()

    const ContextBridge = useContextBridge(ReactReduxContext)

    const parameters = Object.values(config.kinematicsConfiguration)[0]
    const { extentsX, extentsY, extentsZ } = parameters
    const extent = useMemo(() => {
        // just return the max of the abs of our cartesian limits
        return (
            Math.max.apply(
                Math.max,
                [extentsX, extentsY, extentsZ].flat().map(v => Math.abs(v))
            ) || 1000
        )
    }, [extentsX, extentsY, extentsZ])

    function toggle_preview() {
        setHidePreview(current => !current)
    }

    function toggle_trace() {
        setHideTrace(current => !current)
    }

    getExtent(extent)

    return (
        <>
            <Canvas shadows>
                <ContextBridge>
                {!noCamera && (
                    <PerspectiveCamera
                        makeDefault
                        position={[0, 0, 3 * extent]}
                        far={10000}
                        near={1}
                        up={[0, 0, 1]}
                    />
                )}
                {!noControls && <OrbitControls enableDamping={false} makeDefault />}
                {!noViewCube && (
                    <GizmoHelper alignment="bottom-right" margin={[80, 80]} renderPriority={0}>
                        <GizmoViewcube
                            {...{
                                faces: ["Right", "Left", "Back", "Front", "Top", "Bottom"]
                            }}
                        />
                    </GizmoHelper>
                )}
                {!noLighting && (
                    <>
                        <ThreeDimensionalSceneLighting distance={extent * 2} />
                        <Plane receiveShadow position={[0, -1, 0]} args={[2 * extent, 2 * extent]}>
                            <shadowMaterial attach="material" opacity={0.1} />
                        </Plane>
                    </>
                )}
                {!noGridHelper && (
                    <>
                        <gridHelper
                            args={[2 * extent, 20, undefined, 0xd0d0d0]}
                            rotation={new Euler(Math.PI / 2)}
                        />

                            <group position={new Vector3((-extent * 11) / 10, -extent / 5, 0)}>
                                <TriadHelper size={extent / 4} />
                            </group>
                        </>
                    )}
                    {hidePreview ? null : <WorkspaceDimensions extent={extent} />}
                    {hideTrace ? null : <ToolPath frameIndex={frameIndex} path={path} />}
                    {disabled || hidePreview ? null : (
                        <PreviewPath
                            preview={segments}
                            scale={extent}
                            highlightLine={highlightLine}
                        />
                    )}
                    {model ? (
                        <TcpRobot model={model} joints={jointPositions} toolConfig={toolConfig} />
                    ) : (
                        <TcpFrustum scale={extent} position={world_translation} />
                    )}
                    {/* Render any react-three-fiber nodes supplied */}
                    {children}
                </ContextBridge>
            </Canvas>
            <DockToolbar floating>
                <DockToolbarButtonGroup>
                    <ThreeDimensionalSceneShowFramesButton />
                </DockToolbarButtonGroup>
                <DockToolbarButtonGroup>
                    <GlowbuzzerIcon
                        Icon={ShowChartIcon}
                        button
                        title="Show/hide Preview"
                        onClick={toggle_preview}
                        checked={!hidePreview}
                    />
                </DockToolbarButtonGroup>
                <DockToolbarButtonGroup>
                    <GlowbuzzerIcon Icon={BlockIcon} button title="Clear Trace" onClick={reset} />
                    <GlowbuzzerIcon
                        Icon={AutoGraphIcon}
                        button
                        title="Toggle Trace"
                        onClick={toggle_trace}
                        checked={!hideTrace}
                    />
                </DockToolbarButtonGroup>
            </DockToolbar>
        </>
    )
}
