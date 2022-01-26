import * as React from "react"
import { useMemo, useState } from "react"
import { Tile, TileSettings } from "@glowbuzzer/layout"
import { Button, Checkbox, Form, Input } from "antd"
import {
    ToolPathSettingsType,
    useConfig,
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

// TODO: give tile a min height (so it appears better in glowsite docs)
// const ToolPathArea = styled.div`
//     > div {
//         min-height: 400px;
//         height: 100%;
//     }
// `

const DEG90 = Math.PI / 2

const TX40_MODEL: RobotModel = {
    name: "tx40",
    config: [
        { alpha: -DEG90, limits: [-270, 270] },
        { alpha: 0, link_length: 0.225, teta: -DEG90, limits: [-270, 270] },
        { alpha: DEG90, offset: 0.035, teta: DEG90, limits: [-270, 270] },
        { alpha: -DEG90, offset: 0.225, limits: [-270, 270] },
        { alpha: DEG90, limits: [-270, 270] },
        { offset: 0.065, limits: [-270, 270] }
    ],
    offset: new Vector3(0, 0, 325),
    scale: 1000
}

const LD = 500

const Scene = ({ extent, path, segments, jointPositions, highlightLine }) => {
    const lighting = [
        [-LD, -LD, LD],
        [LD, -LD, LD],
        [-LD, LD, LD],
        [LD, LD, LD]
    ]

    return (
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
            <ToolPath path={path} scale={extent} model={TX40_MODEL} joints={jointPositions} />
            <PreviewPath preview={segments} scale={extent} highlightLine={highlightLine} />

            {/*
                <mesh position={[-200, 200, 500]} scale={[100, 100, 100]} castShadow>
                    <boxGeometry attach="geometry" />
                    <meshStandardMaterial attach="material" color="lightblue" />
                </mesh>
*/}
        </ToolPathAutoSize>
    )
}

export const ToolPathTile = () => {
    const { path, reset } = useToolPath(0)
    const { jointPositions } = useKinematics(0, "world")

    const { segments, highlightLine } = usePreview()
    const { settings } = useToolPathSettings()
    const config = useConfig()

    const parameters = Object.values(config.kinematicsConfiguration)[0].kinematicsParameters
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
        <Tile
            title={"Toolpath"}
            footer={<Button onClick={reset}>Reset</Button>}
            settings={<ToolPathSettings />}
        >
            <Canvas colorManagement shadowMap>
                <Scene
                    path={path}
                    extent={extent}
                    highlightLine={highlightLine}
                    jointPositions={jointPositions}
                    segments={segments}
                />
            </Canvas>
        </Tile>
    )
}
