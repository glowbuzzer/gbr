import * as React from "react"
import { useMemo, useState } from "react"
import { Tile, TileSettings } from "@glowbuzzer/layout"
import { Button, Checkbox, Form, Input } from "antd"
import {
    ToolPathSettingsType,
    useConfig,
    useFrames,
    useKinematics,
    usePreview,
    useToolPath,
    useToolPathSettings
} from "@glowbuzzer/store"
import { ToolPath } from "./ToolPathFiber"
import { Canvas } from "react-three-fiber"
import { Euler, Vector3 } from "three"
import { WorkspaceDimensions } from "./WorkspaceDimension"
import { ToolPathAutoSize } from "./ToolPathAutoSize"
import { PreviewPath } from "./PreviewPath"
import { RobotModel } from "./robots"
import { TcpRobot } from "./TcpRobot"
import { TcpFulcrum } from "./TcpFulcrum"

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

const LD = 500

const lighting = [
    [-LD, -LD, LD],
    [LD, -LD, LD],
    [-LD, LD, LD],
    [LD, LD, LD]
]

type ToolPathTileProps = {
    model?: RobotModel
}

export const ToolPathTile = ({ model }: ToolPathTileProps) => {
    const { path, reset } = useToolPath(0)
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

    const parameters = Object.values(config.kinematicsConfiguration)[0].kinematicsParameters
    const { xExtents, yExtents, zExtents } = parameters
    const extent = useMemo(() => {
        if (settings.overrideWorkspace) {
            return settings.extent
        }
        // just return the max of the abs of our cartesian limits
        return Math.max.apply(
            Math.max,
            [xExtents, yExtents, zExtents].flat().map(v => Math.abs(v))
        )
    }, [xExtents, yExtents, zExtents, settings])

    // noinspection RequiredAttributes
    return (
        <Tile
            title={"Toolpath"}
            footer={<Button onClick={reset}>Reset</Button>}
            settings={<ToolPathSettings />}
        >
            <Canvas colorManagement shadowMap>
                <ToolPathAutoSize extent={extent}>
                    {lighting.map((position, index) => (
                        <pointLight
                            key={index}
                            position={position as unknown as Vector3}
                            intensity={1}
                            distance={1000}
                            color={"yellow"}
                        />
                    ))}
                    <gridHelper
                        args={[2 * extent, 20, undefined, 0xd0d0d0]}
                        rotation={new Euler(Math.PI / 2)}
                    />
                    <axesHelper
                        args={[extent / 4]}
                        position={new Vector3((-extent * 11) / 10, -extent / 10, 0)}
                    />

                    <WorkspaceDimensions extent={extent} />

                    <ToolPath path={path} />
                    {disabled ? null : (
                        <PreviewPath
                            preview={segments}
                            scale={extent}
                            highlightLine={highlightLine}
                        />
                    )}

                    {model ? (
                        <TcpRobot model={model} joints={jointPositions} />
                    ) : (
                        <TcpFulcrum scale={extent} position={world_translation} />
                    )}
                </ToolPathAutoSize>
            </Canvas>
        </Tile>
    )
}
