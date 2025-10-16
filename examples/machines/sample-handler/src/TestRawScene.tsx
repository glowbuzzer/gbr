import { Canvas } from "@react-three/fiber"
import { SampleHandlerModel } from "./SampleHandler"
import { Environment, OrbitControls } from "@react-three/drei"
import { useCallback, useState } from "react"
import { Checkbox } from "antd"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import styled from "styled-components"
import { CustomSpotLighting } from "./CustomSpotLighting"
import { TriadHelper } from "@glowbuzzer/controls"
import { CustomPointLighting } from "./CustomPointLighting"

const StyledDiv = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.9);

    .settings {
        background: rgba(0, 0, 0, 0.1);

        display: flex;
        color: white;

        .setting {
            padding: 10px;
            display: flex;
            gap: 5px;
            align-items: center;
        }
    }

    .scene {
        flex-grow: 1;
        background: #111;
    }
`

const DEFAULT_SETTINGS = {
    grid: true,
    environment: true,
    ambientLight: true,
    pointLight: true,
    spotLight: true,
    shadows: true,
    deMetal: false
}

type SceneSettings = {
    [K in keyof typeof DEFAULT_SETTINGS]: boolean
}

function get_settings(): SceneSettings {
    const settings = localStorage.getItem("sample-handler-settings")
    return settings ? { ...DEFAULT_SETTINGS, ...JSON.parse(settings) } : DEFAULT_SETTINGS
}

export const TestRawScene = () => {
    const [settings, setSettings] = useState<SceneSettings>(get_settings())

    const update_setting = useCallback(
        (e: CheckboxChangeEvent) => {
            setSettings(s => {
                const updated = { ...s, [e.target.name]: e.target.checked }
                localStorage.setItem("sample-handler-settings", JSON.stringify(updated))
                return updated
            })
        },
        [setSettings]
    )

    const { grid, environment, shadows, pointLight, spotLight, ambientLight, deMetal } = settings

    return (
        <StyledDiv>
            <div className="settings">
                {Object.entries(settings).map(([key, value]) => {
                    return (
                        <div key={key} className="setting">
                            <label>{key}</label>
                            <Checkbox
                                name={key}
                                checked={value}
                                onChange={update_setting}
                            ></Checkbox>
                        </div>
                    )
                })}
            </div>
            <div className="scene">
                <Canvas shadows={shadows} frameloop="always">
                    <TriadHelper size={2} />
                    <OrbitControls enableDamping={false} />

                    {ambientLight && <ambientLight intensity={0.5} />}
                    {spotLight && (
                        <CustomSpotLighting position={[1, 1, 2]} targetPosition={[1, 0, 0]} />
                    )}
                    {pointLight && <CustomPointLighting position={[1, 1, 2]} />}
                    {grid && <gridHelper args={[1000, 1000, 0x888888, 0x888888]} />}
                    {environment && <Environment preset="dawn" blur={5} />}

                    <group rotation={[-Math.PI / 2, 0, 0]}>
                        <SampleHandlerModel x={0} y={0} z={0} r={0} deMetal={deMetal} />
                    </group>
                </Canvas>
            </div>
        </StyledDiv>
    )
}
