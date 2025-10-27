import { extend } from "@react-three/fiber"
import * as React from "react"
import { useCallback, useState } from "react"
import { Checkbox, Slider } from "antd"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import styled from "styled-components"
import { RenderPass, ShaderPass } from "three-stdlib"
import { CanvasFancy } from "./CanvasFancy"
import { DEFAULT_SETTINGS, SceneSettings } from "./settings"
import { SampleHandlerModel } from "./SampleHandler"

extend({ ShaderPass, RenderPass })

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
        background: #555;
        //color: black;

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

export const SceneWithControls = () => {
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

    function update_env_map_intensity(v: number) {
        setSettings(current => ({
            ...current,
            envMapIntensity: v
        }))
    }

    const {
        lightingIntensity,
        envMapIntensity,
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
                        max={10}
                        step={0.2}
                        onChange={update_lighting_intensity}
                    />
                </div>
                <div className="setting">
                    <label>Environment Intensity</label>
                    <Slider
                        value={settings.envMapIntensity}
                        min={0}
                        max={1}
                        step={0.05}
                        onChange={update_env_map_intensity}
                    />
                </div>
            </div>
            <div className="scene">
                <CanvasFancy {...settings}>
                    <group position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <SampleHandlerModel x={0} y={0} z={0} r={0} {...modelProps} />
                    </group>
                </CanvasFancy>
            </div>
        </StyledDiv>
    )
}
