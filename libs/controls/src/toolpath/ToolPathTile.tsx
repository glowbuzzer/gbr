/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useMemo, useRef, useState } from "react"
import {
    useConfig,
    useFrames,
    useKinematics,
    usePreview,
    useToolConfig,
    useToolIndex,
    useToolPath,
    useToolPathSettings
} from "@glowbuzzer/store"
import { ToolPath } from "./ToolPath"
import { Canvas } from "@react-three/fiber"
import { Euler, Vector3 } from "three"
import { WorkspaceDimensions } from "./WorkspaceDimension"
import { ToolPathAutoSize } from "./ToolPathAutoSize"
import { PreviewPath } from "./PreviewPath"
import { RobotModel } from "./robots"
import { TcpRobot } from "./TcpRobot"
import { TcpFulcrum } from "./TcpFulcrum"
import { TriadHelper } from "./TriadHelper"
import { ToolpathShowFramesButton } from "./ToolpathShowFramesButton"
import { DockToolbar, DockToolbarButtonGroup } from "../dock/DockToolbar"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"
import { ReactComponent as BlockIcon } from "@material-symbols/svg-400/outlined/block.svg"
import { ReactComponent as ShowChartIcon } from "@material-symbols/svg-400/outlined/show_chart.svg"
import { ReactComponent as AutoGraphIcon } from "@material-symbols/svg-400/outlined/auto_graph.svg"

export const ToolPathTileHelp = () => (
    <div>
        <h4>Toolpath Tile</h4>
        <p>The Toolpath Tile performs a number of functions. These are:</p>
        <ol>
            <li>
                Shows the current position of the tool in 3D space which updates as the tool is
                moved by programs
            </li>
            <li>
                Shows the future position of the toolpath (if say a gcode program has been loaded)
            </li>
            <li>Shows past path the tool has followed</li>
            <li>Shows a 3D model of the machine (if available)</li>
            <li>Shows objects the machine may interact with</li>
        </ol>
        <p>
            The view has a set controls allowing the view to be panned, rotated and zoomed with the
            mouse.{" "}
        </p>
        <p>
            The view also shows the extents of the machine (its envelope) these can be overridden by
            using the top-right config button.
        </p>
    </div>
)

const LD = 1000

const lighting = [
    [0, -LD, LD],
    [LD, -LD, LD],
    [-LD, LD, LD]
    // [LD, LD, -LD / 2]
]

type ToolPathTileProps = {
    /** Optional robot model information */
    model?: RobotModel
    /** If true, trace of tool path will not be shown */
    hideTrace?: boolean
    /** If true, preview of tool path will not be shown */
    hidePreview?: boolean
    /** Optional react-three-fiber children to render */
    children?: React.ReactNode
}

/**
 * The tool path tile provides a 3d visualisation of the planned motion (from G-code) and the actual path
 * taken while the machine is running.
 *
 * The `model` property allows you to provide the location of model files for your machine and information
 * about the joints in the model. The joints in the model will be adjusted according to the actual position of the
 * physical joints on the machine. For an example of this in practice, refer to the
 * [Staubli example project](https://github.com/glowbuzzer/gbr/blob/main/examples/staubli/src/main.tsx)
 */
export const ToolPathTile = ({
    model,
    hideTrace: defaultHideTrace,
    hidePreview: defaultHidePreview,
    children
}: ToolPathTileProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [hideTrace, setHideTrace] = useState(defaultHideTrace || false)
    const [hidePreview, setHidePreview] = useState(defaultHidePreview || false)

    const { path, reset } = useToolPath(0)
    const toolIndex = useToolIndex(0)
    const toolConfig = useToolConfig(toolIndex)

    const { jointPositions, translation, rotation, frameIndex } = useKinematics(0)
    const { convertToFrame } = useFrames()

    const { translation: world_translation } = convertToFrame(
        translation,
        rotation,
        frameIndex,
        "world"
    )

    const { segments, highlightLine, disabled } = usePreview()
    const { settings } = useToolPathSettings()
    const config = useConfig()

    const parameters = Object.values(config.kinematicsConfiguration)[0]
    const { extentsX, extentsY, extentsZ } = parameters
    const extent = useMemo(() => {
        if (settings.overrideWorkspace) {
            return settings.extent
        }
        // just return the max of the abs of our cartesian limits
        return (
            Math.max.apply(
                Math.max,
                [extentsX, extentsY, extentsZ].flat().map(v => Math.abs(v))
            ) || 1000
        )
    }, [extentsX, extentsY, extentsZ, settings])

    function toggle_preview() {
        setHidePreview(current => !current)
    }

    function toggle_trace() {
        setHideTrace(current => !current)
    }

    return (
        <>
            <Canvas ref={canvasRef}>
                <ToolPathAutoSize extent={extent}>
                    <ambientLight color={"grey"} />
                    {lighting.map((position, index) => (
                        <pointLight
                            key={index}
                            position={position as unknown as Vector3}
                            intensity={0.1}
                            distance={10000}
                        />
                    ))}
                    <gridHelper
                        args={[2 * extent, 20, undefined, 0xd0d0d0]}
                        rotation={new Euler(Math.PI / 2)}
                    />
                    <group position={new Vector3((-extent * 11) / 10, -extent / 5, 0)}>
                        <TriadHelper size={extent / 4} />
                    </group>

                    {hidePreview ? null : <WorkspaceDimensions extent={extent} />}

                    {hideTrace ? null : <ToolPath path={path} />}

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
                        <TcpFulcrum scale={extent} position={world_translation} />
                    )}

                    {/* Render any react-three-fiber nodes supplied */}
                    {children}
                </ToolPathAutoSize>
            </Canvas>
            <DockToolbar floating>
                <DockToolbarButtonGroup>
                    <ToolpathShowFramesButton />
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
