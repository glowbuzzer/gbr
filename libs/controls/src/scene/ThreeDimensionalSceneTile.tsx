/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useState, useRef } from "react"
import { ReactReduxContext } from "react-redux"
import { usePrefs, usePreview, useTrace } from "@glowbuzzer/store"
import { Trace } from "./Trace"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, useContextBridge } from "@react-three/drei"
import { WorkspaceDimensions } from "./WorkspaceDimension"
import { PreviewPath } from "./PreviewPath"
import { DockToolbar, DockToolbarButtonGroup } from "../dock/DockToolbar"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"
import { ReactComponent as BlockIcon } from "@material-symbols/svg-400/outlined/block.svg"
import { ReactComponent as ShowChartIcon } from "@material-symbols/svg-400/outlined/show_chart.svg"
import { ReactComponent as AutoGraphIcon } from "@material-symbols/svg-400/outlined/auto_graph.svg"
import { ReactComponent as FramesIcon } from "@material-symbols/svg-400/outlined/account_tree.svg"
import { ReactComponent as PointsIcon } from "@material-symbols/svg-400/outlined/pin_drop.svg"
import { ReactComponent as DownloadIcon } from "@material-symbols/svg-400/outlined/download.svg"
import { FramesDisplay } from "./FramesDisplay"
import { DefaultPerspectiveCamera } from "./DefaultPerspectiveCamera"
import { DefaultGridHelper } from "./DefaultGridHelper"
import { ScaleProvider, useScale } from "./ScaleProvider"
import { DefaultViewCube } from "./DefaultViewCube"
import { DefaultLighting } from "./DefaultLighting"
import { PointsDisplay } from "./PointsDisplay"
import { Vector3 } from "three"
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter"

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
    /** Optional, initial camera position */
    initialCameraPosition?: Vector3
    /** Optional react-three-fiber children to render */
    children?: React.ReactNode
}

const SceneExporter = ({ sceneRef }) => {
    const { scene } = useThree()
    React.useEffect(() => {
        sceneRef.current = scene
    }, [scene])
    return null
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
    initialCameraPosition,
    children = undefined
}: ThreeDimensionalSceneTileProps) => {
    const { reset } = useTrace(kinematicsConfigurationIndex)
    const { current, update } = usePrefs()
    const [hideTrace, setHideTrace] = useState(defaultHideTrace || false)
    const [hidePreview, setHidePreview] = useState(defaultHidePreview || false)
    const { segments, highlightLine, disabled } = usePreview()
    const ContextBridge = useContextBridge(ReactReduxContext)
    const sceneRef = useRef<THREE.Scene | null>(null)

    function toggle_preview() {
        setHidePreview(current => !current)
    }

    function toggle_trace() {
        setHideTrace(current => !current)
    }

    function downloadGLTF() {
        if (!sceneRef.current) return

        const exporter = new GLTFExporter()
        exporter.parse(
            sceneRef.current,
            function (result) {
                const output = JSON.stringify(result, null, 2)
                const blob = new Blob([output], { type: "application/json" })
                const url = URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.href = url
                link.download = "scene.gltf"
                link.click()
            },
            error => {
                console.error("An error happened during GLTF export", error)
            }
        )
    }

    return (
        <>
            <Canvas shadows frameloop="demand">
                <SceneExporter sceneRef={sceneRef} />
                <ContextBridge>
                    <ScaleProvider>
                        {noCamera || <DefaultPerspectiveCamera position={initialCameraPosition} />}
                        {noControls || <OrbitControls enableDamping={false} makeDefault />}
                        {noViewCube || <DefaultViewCube />}
                        {noLighting || <DefaultLighting />}
                        {noGridHelper || <DefaultGridHelper />}
                        {/*{hidePreview ? null : <WorkspaceDimensions />}*/}
                        {hideTrace ? null : (
                            <Trace
                                kinematicsConfigurationIndex={kinematicsConfigurationIndex}
                                color="red"
                            />
                        )}
                        {disabled || hidePreview ? null : (
                            <PreviewPath preview={segments} highlightLine={highlightLine} />
                        )}
                        {current.showFrames && <FramesDisplay />}
                        {current.showPoints && <PointsDisplay />}
                        {/* Render any react-three-fiber nodes supplied */}
                        {children}
                    </ScaleProvider>
                </ContextBridge>
            </Canvas>
            <DockToolbar floating>
                <DockToolbarButtonGroup>
                    <GlowbuzzerIcon
                        name="points"
                        useFill={true}
                        Icon={PointsIcon}
                        button
                        checked={!!current.showPoints}
                        title={current.showPoints ? "Hide points" : "Show points"}
                        onClick={() => update("showPoints", !current.showPoints)}
                    />
                    <GlowbuzzerIcon
                        name="frames"
                        useFill={true}
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
                        useFill={true}
                        button
                        title={hidePreview ? "Show Preview" : "Hide Preview"}
                        onClick={toggle_preview}
                        checked={!hidePreview}
                    />
                </DockToolbarButtonGroup>
                <DockToolbarButtonGroup>
                    <GlowbuzzerIcon
                        Icon={AutoGraphIcon}
                        useFill={true}
                        button
                        title={hideTrace ? "Show Trace" : "Hide Trace"}
                        onClick={toggle_trace}
                        checked={!hideTrace}
                    />
                    <GlowbuzzerIcon
                        useFill={true}
                        Icon={BlockIcon}
                        button
                        title="Clear Trace"
                        onClick={reset}
                    />
                </DockToolbarButtonGroup>
                <DockToolbarButtonGroup>
                    <GlowbuzzerIcon
                        name="download"
                        useFill={true}
                        Icon={DownloadIcon}
                        button
                        // checked={!!current.showFrames}
                        title={"Download 3D scene GLTF"}
                        onClick={downloadGLTF}
                    />
                </DockToolbarButtonGroup>
            </DockToolbar>
        </>
    )
}
