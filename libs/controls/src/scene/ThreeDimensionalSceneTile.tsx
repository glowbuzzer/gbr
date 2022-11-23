/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useRef, useState } from "react"
import { ReactReduxContext } from "react-redux"
import {
    useKinematics,
    useKinematicsExtents,
    usePrefs,
    usePreview,
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
import { TriadHelper } from "./TriadHelper"
import { DockToolbar, DockToolbarButtonGroup } from "../dock/DockToolbar"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"
import { ReactComponent as BlockIcon } from "@material-symbols/svg-400/outlined/block.svg"
import { ReactComponent as ShowChartIcon } from "@material-symbols/svg-400/outlined/show_chart.svg"
import { ReactComponent as AutoGraphIcon } from "@material-symbols/svg-400/outlined/auto_graph.svg"
import { ReactComponent as FramesIcon } from "@material-symbols/svg-400/outlined/account_tree.svg"
import { FramesDisplay } from "./FramesDisplay"

type ThreeDimensionalSceneTileProps = {
    /** The kinematics configuration to use */
    kinematicsConfigurationIndex?: number
    /** If true, trace of tool path will not be shown */
    hideTrace?: boolean
    /** If true, preview of tool path will not be shown */
    hidePreview?: boolean
    /** Optional, If true no camera will be provided in the canvas */
    noCamera?: boolean
    /** Optional, If true no controls will be provided in the canvas */
    noControls?: boolean
    /** Optional, If true no lighting will be provided in the canvas */
    noLighting?: boolean
    /** Optional, If true no gridHelper will be provided in the canvas (& axis triad) */
    noGridHelper?: boolean
    /** Optional, If true no viewCube will be provided in the canvas */
    noViewCube?: boolean
    /** Optional react-three-fiber children to render */
    children?: React.ReactNode
}

const ThreeDimensionalSceneLighting = ({ distance }) => {
    const pointLightRef = useRef()
    // useHelper(pointLightRef, PointLightHelper, 100, "magenta")

    return (
        <>
            <ambientLight color={"grey"} />
            <pointLight
                position={[0, 0, distance]}
                color={"white"}
                ref={pointLightRef}
                castShadow={true}
                distance={distance * 2}
                shadow-mapSize-height={512}
                shadow-mapSize-width={512}
                shadow-radius={10}
                shadow-bias={-0.0001}
            />
            <Plane receiveShadow position={[0, -1, 0]} args={[distance, distance]}>
                <shadowMaterial attach="material" opacity={0.1} />
            </Plane>
        </>
    )
}

/**
 * The three dimensional scene tile provides a 3d visualisation of the planned motion (if using G-code) and the actual path
 * taken while the machine is in operation.
 *
 * Any children you supply must be react-three-fibre components you want to add to the threejs scene. By default
 * a frustum is added to show the current position of the machine. You can customise the default
 * tile to add your own components, as shown in the example below. For a more complex example including an articulated
 * robot, see the [Staubli example project](https://github.com/glowbuzzer/gbr/blob/main/examples/staubli/src/main.tsx)
 */
export const ThreeDimensionalSceneTile = ({
    kinematicsConfigurationIndex = 0,
    noLighting = false,
    noCamera = false,
    noControls = false,
    noGridHelper = false,
    noViewCube = false,
    hideTrace: defaultHideTrace = undefined,
    hidePreview: defaultHidePreview = undefined,
    children = undefined
}: ThreeDimensionalSceneTileProps) => {
    const { path, reset } = useToolPath(kinematicsConfigurationIndex)
    const { frameIndex } = useKinematics(kinematicsConfigurationIndex)
    const { max: extent } = useKinematicsExtents(kinematicsConfigurationIndex)

    const { current, update } = usePrefs()

    const [hideTrace, setHideTrace] = useState(defaultHideTrace || false)
    const [hidePreview, setHidePreview] = useState(defaultHidePreview || false)

    const { segments, highlightLine, disabled } = usePreview()

    const ContextBridge = useContextBridge(ReactReduxContext)

    function toggle_preview() {
        setHidePreview(current => !current)
    }

    function toggle_trace() {
        setHideTrace(current => !current)
    }

    return (
        <>
            <Canvas shadows>
                <ContextBridge>
                    {noCamera || (
                        <PerspectiveCamera
                            makeDefault
                            position={[0, 0, 3 * extent]}
                            far={10000}
                            near={1}
                            up={[0, 0, 1]}
                        />
                    )}
                    {noControls || <OrbitControls enableDamping={false} makeDefault />}
                    {noViewCube || (
                        <GizmoHelper alignment="bottom-right" margin={[80, 80]} renderPriority={0}>
                            <GizmoViewcube
                                {...{
                                    faces: ["Right", "Left", "Back", "Front", "Top", "Bottom"]
                                }}
                            />
                        </GizmoHelper>
                    )}
                    {noLighting || <ThreeDimensionalSceneLighting distance={extent * 2} />}
                    {noGridHelper || (
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
                    {current.showFrames && <FramesDisplay />}
                    {/* Render any react-three-fiber nodes supplied */}
                    {children}
                </ContextBridge>
            </Canvas>
            <DockToolbar floating>
                <DockToolbarButtonGroup>
                    <GlowbuzzerIcon
                        name="frames"
                        Icon={FramesIcon}
                        button
                        checked={!!current.showFrames}
                        title={current.showFrames ? "Hide frames" : "Show frames"}
                        onClick={() => update("showFrames", !current.showFrames)}
                    />
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
