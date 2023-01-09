/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useState } from "react"
import { ReactReduxContext } from "react-redux"
import { useKinematicsConfiguration, usePrefs, usePreview, useToolPath } from "@glowbuzzer/store"
import { ToolPath } from "./ToolPath"
import { Canvas } from "@react-three/fiber"
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
import { FramesDisplay } from "./FramesDisplay"
import { DefaultPerspectiveCamera } from "./DefaultPerspectiveCamera"
import { DefaultGridHelper } from "./DefaultGridHelper"
import { ScaleProvider } from "./ScaleProvider"
import { DefaultViewCube } from "./DefaultViewCube"
import { DefaultLighting } from "./DefaultLighting"
import { PointsDisplay } from "./PointsDisplay"

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
    const { frameIndex } = useKinematicsConfiguration(kinematicsConfigurationIndex)

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
                    <ScaleProvider>
                        {noCamera || <DefaultPerspectiveCamera />}
                        {noControls || <OrbitControls enableDamping={false} makeDefault />}
                        {noViewCube || <DefaultViewCube />}
                        {noLighting || <DefaultLighting />}
                        {noGridHelper || <DefaultGridHelper />}
                        {hidePreview ? null : <WorkspaceDimensions />}
                        {hideTrace ? null : <ToolPath frameIndex={frameIndex} path={path} />}
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
                        Icon={PointsIcon}
                        button
                        checked={!!current.showPoints}
                        title={current.showPoints ? "Hide points" : "Show points"}
                        onClick={() => update("showPoints", !current.showPoints)}
                    />
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
                    <GlowbuzzerIcon
                        Icon={AutoGraphIcon}
                        button
                        title="Toggle Trace"
                        onClick={toggle_trace}
                        checked={!hideTrace}
                    />
                    <GlowbuzzerIcon Icon={BlockIcon} button title="Clear Trace" onClick={reset} />
                </DockToolbarButtonGroup>
            </DockToolbar>
        </>
    )
}
