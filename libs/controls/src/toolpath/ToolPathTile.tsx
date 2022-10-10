/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useContext, useMemo, useRef, useState } from "react"
import { Tile, TileSettings } from "../tiles"
import { Button, Checkbox, Form, Input } from "antd"
import {
    ToolPathSettingsType,
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
import { DockContextType, TabData } from "rc-dock"

const help = (
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

const ToolPathSettings = () => {
    const { settings: initialSettings, setSettings } = useToolPathSettings()
    const [settings, saveSettings] = useState(initialSettings)

    function save() {
        setSettings(settings)
    }

    function onChange(change: Partial<ToolPathSettingsType>) {
        saveSettings(settings => ({ ...settings, ...change }))
    }

    return (
        <TileSettings
            title="Tool Path Settings"
            onConfirm={save}
            onReset={() => saveSettings(initialSettings)}
        >
            <Form>
                <Form.Item label="Override Configuration">
                    <Checkbox
                        checked={settings.overrideWorkspace}
                        onChange={event => {
                            onChange({ overrideWorkspace: event.target.checked })
                        }}
                    />
                </Form.Item>
                <Form.Item label="Extent">
                    <Input
                        value={settings.extent}
                        onChange={event => {
                            onChange({ extent: Number(event.target.value) || 100 })
                        }}
                    />
                </Form.Item>
            </Form>
        </TileSettings>
    )
}

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
export const ToolPathTile = ({ model, hideTrace, hidePreview, children }: ToolPathTileProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [showFrames, setShowFrames] = useState(false)

    const { path, reset } = useToolPath(0)
    const toolIndex = useToolIndex(0)
    const toolConfig = useToolConfig(toolIndex)

    const dockContext = useContext(DockContextType)

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

    return (
        <Tile
            title={"Toolpath"}
            help={help}
            footer={hideTrace ? null : <Button onClick={reset}>Clear Trace</Button>}
            settings={<ToolPathSettings />}
        >
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
        </Tile>
    )
}
