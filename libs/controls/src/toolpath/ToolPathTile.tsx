/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import {useMemo, useState, useRef} from "react"
import {Tile, TileSettings} from "../tiles"
import {Button, Checkbox, Form, Input} from "antd"
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
import {ToolPath} from "./ToolPath"
import {Canvas} from "@react-three/fiber"
import {Plane, useHelper} from "@react-three/drei"
import {Euler, Vector3, PointLightHelper} from "three"
import {WorkspaceDimensions} from "./WorkspaceDimension"
import {ToolPathAutoSize} from "./ToolPathAutoSize"
import {PreviewPath} from "./PreviewPath"
import {RobotModel} from "./robots"
import {TcpRobot} from "./TcpRobot"
import {TcpFulcrum} from "./TcpFulcrum"
import {TriadHelper} from "./TriadHelper"

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
    const {settings: initialSettings, setSettings} = useToolPathSettings()
    const [settings, saveSettings] = useState(initialSettings)

    function save() {
        setSettings(settings)
    }

    function onChange(change: Partial<ToolPathSettingsType>) {
        saveSettings(settings => ({...settings, ...change}))
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
                            onChange({overrideWorkspace: event.target.checked})
                        }}
                    />
                </Form.Item>
                <Form.Item label="Extent">
                    <Input
                        value={settings.extent}
                        onChange={event => {
                            onChange({extent: Number(event.target.value) || 100})
                        }}
                    />
                </Form.Item>
            </Form>
        </TileSettings>
    )
}

// const LD = 1000
//
// const lighting = [
//     [0, -LD, LD],
//     [LD, -LD, LD],
//     [-LD, LD, LD]
//     // [LD, LD, -LD / 2]
// ]

type ToolPathTileProps = {
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

const ToolPathLighting = (props) => {

    const pointLightRef = useRef()
    // useHelper(pointLightRef, PointLightHelper, 100, "magenta")

    return (
        <>
            <ambientLight color={"grey"}/>
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

const defaultGetExtentFunc = (val) => {
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
                                 hideTrace,
                                 hidePreview,
                                 noLighting = false,
                                 noCamera = false,
                                 noControls = false,
                                 noGridHelper = false,
                                 noViewCube = false,
                                 getExtent = defaultGetExtentFunc,
                                 children
                             }: ToolPathTileProps) => {
    const {path, reset} = useToolPath(0)
    const toolIndex = useToolIndex(0)
    const toolConfig = useToolConfig(toolIndex)


    const {jointPositions, translation, rotation, frameIndex} = useKinematics(0)
    const {convertToFrame} = useFrames()

    const {translation: world_translation} = convertToFrame(
        translation,
        rotation,
        frameIndex,
        "world"
    )

    const {segments, highlightLine, disabled} = usePreview()
    const {settings} = useToolPathSettings()
    const config = useConfig()

    const parameters = Object.values(config.kinematicsConfiguration)[0]
    const {extentsX, extentsY, extentsZ} = parameters
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

    getExtent(extent)


    return (
        <Tile
            title={"Toolpath"}
            help={help}
            footer={hideTrace ? null : <Button onClick={reset}>Clear Trace</Button>}
            settings={<ToolPathSettings/>}
        >
            <Canvas shadows>

                <ToolPathAutoSize extent={extent} noControls={noControls} noCamera={noCamera} noViewCube={noViewCube}>

                    {!noLighting &&
                        <>
                            <ToolPathLighting distance={extent * 2}/>
                            /* Add a plane to receive shadows */
                            <Plane
                                receiveShadow
                                position={[0, -1, 0]}
                                args={[2 * extent, 2 * extent]}
                            >
                                <shadowMaterial attach="material" opacity={0.1}/>
                            </Plane>
                        </>
                    }
                    {!noGridHelper &&
                        <>
                            <gridHelper
                                args={[2 * extent, 20, undefined, 0xd0d0d0]}
                                rotation={new Euler(Math.PI / 2)}
                            />

                            <group position={new Vector3((-extent * 11) / 10, -extent / 5, 0)}>
                                <TriadHelper size={extent / 4}/>
                            </group>
                        </>
                    }
                    {hidePreview ? null : <WorkspaceDimensions extent={extent}/>}

                    {hideTrace ? null : <ToolPath path={path}/>}

                    {disabled || hidePreview ? null : (
                        <PreviewPath
                            preview={segments}
                            scale={extent}
                            highlightLine={highlightLine}
                        />
                    )}

                    {model ? (
                        <TcpRobot model={model} joints={jointPositions} toolConfig={toolConfig}/>
                    ) : (
                        <TcpFulcrum scale={extent} position={world_translation}/>
                    )}

                    {/* Render any react-three-fiber nodes supplied */}
                    {children}
                </ToolPathAutoSize>
            </Canvas>
        </Tile>
    )
}
