import * as React from "react"
import { useMemo, useState } from "react"
import { Tile, TileSettings } from "@glowbuzzer/layout"
import { Button, Checkbox, Col, Form, Input } from "antd"
import { ToolPathSettingsType, useConfig, usePreview, useToolPath, useToolPathSettings } from "@glowbuzzer/store"
import { PreviewPath, ToolPath, ToolPathAutoSize } from "./ToolPathFiber"
import { Canvas } from "react-three-fiber"
import { Euler, Vector3 } from "three"
import { WorkspaceDimensions } from "./WorkspaceDimension"

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
        <TileSettings title="Tool Path Settings" onConfirm={save} onReset={() => saveSettings(initialSettings)}>
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

export const ToolPathTile = () => {
    const { path, reset } = useToolPath(0)
    const { settings } = useToolPathSettings()
    const { segments } = usePreview()
    const config = useConfig()

    const parameters = config.kinematicsConfiguration.default.kinematicsParameters.cartesianParameters
    const { xExtents, yExtents, zExtents } = parameters
    const extent = useMemo(() => {
        if (settings.overrideWorkspace) {
            return settings.extent
        }
        // just return the max of the abs of any of our cartesian limits
        return Math.max.apply(
            Math.max,
            [xExtents, yExtents, zExtents].flat().map(v => Math.abs(v))
        )
    }, [xExtents, yExtents, zExtents, settings])

    // noinspection RequiredAttributes
    return (
        <Tile title={"Toolpath"} footer={<Button onClick={reset}>Reset</Button>} settings={<ToolPathSettings />}>
            <Canvas>
                <ToolPathAutoSize extent={extent}>
                    <ambientLight />
                    <pointLight position={[10, 10, 10]} />
                    <gridHelper args={[2 * extent, 20, undefined, 0xc0c0c0]} rotation={new Euler(Math.PI / 2)} />
                    <axesHelper args={[30]} position={new Vector3(-180, -20, 0)} />

                    <WorkspaceDimensions xExtent={xExtents} yExtent={yExtents} zExtent={zExtents} />
                    <ToolPath path={path} />
                    <PreviewPath preview={segments} />
                </ToolPathAutoSize>
            </Canvas>

            {/*
            <ToolPathDisplay width={1000} height={800} extent={200} path={path} segments={segments} />
*/}
        </Tile>
    )
}
