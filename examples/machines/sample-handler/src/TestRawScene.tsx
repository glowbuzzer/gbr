import { Canvas } from "@react-three/fiber"
import { SampleHandlerModel } from "./SampleHandler"
import { Environment, OrbitControls } from "@react-three/drei"
import { useCallback, useState } from "react"
import { Checkbox, Slider } from "antd"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import styled from "styled-components"
import { CustomSpotLighting } from "./CustomSpotLighting"
import { TriadHelper } from "@glowbuzzer/controls"
import { CustomPointLighting } from "./CustomPointLighting"
import { ACESFilmicToneMapping, PCFSoftShadowMap } from "three"

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
        background: white;

        display: flex;
        flex-wrap: wrap;
        align-items: center;
        //color: white;

        .setting {
            padding: 10px;
            display: flex;
            gap: 5px;
            align-items: center;
        }

        .ant-slider {
            margin: 0 10px;
            min-width: 100px;
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
    reduceEnvMapIntensity: false,
    ambientLight: true,
    hemisphereLight: true,
    directionalLight: true,
    pointLight: true,
    spotLight: true,
    deMetal: false,
    castShadow: false,
    lightingIntensity: 10
}

type SceneSettings = {
    [K in keyof typeof DEFAULT_SETTINGS]: (typeof DEFAULT_SETTINGS)[K]
}

function get_settings(): SceneSettings {
    const settings = localStorage.getItem("sample-handler-settings")
    if (!settings) {
        return DEFAULT_SETTINGS
    }
    const all = JSON.parse(settings)
    const filtered = Object.fromEntries(
        Object.entries(all).filter(([k]) => DEFAULT_SETTINGS[k] !== undefined)
    )
    return { ...DEFAULT_SETTINGS, ...filtered }
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

    function update_lighting_intensity(v: number) {
        setSettings(current => ({
            ...current,
            lightingIntensity: v
        }))
    }

    const {
        lightingIntensity,
        grid,
        environment,
        hemisphereLight,
        directionalLight,
        pointLight,
        spotLight,
        ambientLight,
        ...modelProps
    } = settings

    return (
        <StyledDiv>
            <div className="settings">
                {Object.entries(settings)
                    .filter(([_key, value]) => typeof value === "boolean")
                    .map(([key, value]) => {
                        return (
                            <div key={key} className="setting">
                                <label>{key}</label>
                                <Checkbox
                                    name={key}
                                    checked={!!value}
                                    onChange={update_setting}
                                ></Checkbox>
                            </div>
                        )
                    })}
                <div className="setting">
                    <label>Lighting Intensity</label>
                    <Slider
                        value={settings.lightingIntensity}
                        min={0}
                        max={100}
                        step={5}
                        onChange={update_lighting_intensity}
                    />
                </div>
            </div>
            <div className="scene">
                <Canvas
                    shadows
                    gl={{
                        antialias: true,
                        toneMapping: ACESFilmicToneMapping,
                        shadowMapEnabled: true,
                        shadowMapType: PCFSoftShadowMap
                    }}
                >
                    <TriadHelper size={2} />
                    <OrbitControls enableDamping={false} makeDefault />

                    {/* circle on the floor to receive shadows */}
                    <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
                        <circleGeometry args={[6, 64]} />
                        <shadowMaterial transparent opacity={0.5} />
                    </mesh>

                    {ambientLight && <ambientLight intensity={lightingIntensity} />}
                    {spotLight && (
                        <CustomSpotLighting
                            position={[1, 1, 2]}
                            targetPosition={[1, 0, 0]}
                            intensity={lightingIntensity}
                        />
                    )}
                    {directionalLight && (
                        <directionalLight
                            position={[1, 1, 1]}
                            intensity={lightingIntensity}
                            castShadow
                            shadow-mapSize={[2048, 2048]}
                            shadow-bias={-0.0002}
                            shadow-normalBias={0.02}
                        />
                    )}
                    {hemisphereLight && <hemisphereLight intensity={lightingIntensity} />}
                    {pointLight && (
                        <CustomPointLighting position={[1, 1, 2]} intensity={lightingIntensity} />
                    )}

                    <color attach="background" args={["#666"]} />

                    {grid && <gridHelper args={[1000, 1000, 0x888888, 0x888888]} />}

                    {environment && <Environment preset="studio" blur={5} />}

                    <group position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <SampleHandlerModel x={0} y={0} z={0} r={0} {...modelProps} />
                    </group>
                </Canvas>
            </div>
        </StyledDiv>
    )
}
