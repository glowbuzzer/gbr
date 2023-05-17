/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { SparklineScrolling } from "./SparklineScrolling"
import styled from "styled-components"
import { Button, Radio, RadioChangeEvent, Slider, Space, Tag } from "antd"
import {
    CaptureState,
    JOINT_TYPE,
    JointConfig,
    KinematicsConfigurationConfig,
    TelemetryPVA,
    useJointConfigurationList,
    useKinematicsConfigurationList,
    useTelemetryControls,
    useTelemetryData,
    useTelemetrySettings
} from "@glowbuzzer/store"
import { DockTileWithToolbar } from "../dock/DockTileWithToolbar"
import * as d3 from "d3"
import { DockToolbarButtonGroup } from "../dock/DockToolbar"

const axis_colors = ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#444444"]

type SparklineJointsProps = {
    kinematicsConfiguration: KinematicsConfigurationConfig
    selected: boolean[]
    duration: number
}

const SparklineJoints = ({ kinematicsConfiguration, selected, duration }: SparklineJointsProps) => {
    const telemetry = useTelemetryData()
    const { plot } = useTelemetrySettings()
    const jointConfigurations = useJointConfigurationList()
    const participatingJoints: JointConfig[] = kinematicsConfiguration.participatingJoints.map(
        n => jointConfigurations[n]
    )

    const selectedJointColours = useMemo(() => {
        return kinematicsConfiguration.participatingJoints
            .map((_, i) => axis_colors[i])
            .filter((_, i) => selected[i])
            .map(color => ({ color }))
    }, [kinematicsConfiguration.participatingJoints, selected])

    const { data, domain } = useMemo(() => {
        let data = telemetry.map(d => ({
            t: d.t,
            values: kinematicsConfiguration.participatingJoints
                .map(index => d.joints[index])
                .filter((_, i) => selected[i])
        }))

        if (plot >= TelemetryPVA.VEL) {
            data = data.slice(1).map((d, index) => ({
                t: d.t,
                values: d.values.map(
                    (v, axis) => (d.values[axis] - data[index].values[axis]) * 1000
                )
            }))
        }

        if (plot >= TelemetryPVA.ACC) {
            data = data.slice(1).map((d, index) => ({
                t: d.t,
                values: d.values.map(
                    (v, axis) => (d.values[axis] - data[index].values[axis]) * 1000
                )
            }))
        }

        const domain = d3.extent(
            data.flatMap(d => {
                return d.values.map(n => {
                    return n * 1.1
                })
            })
        )
        return { data, domain }
    }, [telemetry, kinematicsConfiguration, plot])

    return (
        <SparklineScrolling
            domain={domain}
            options={selectedJointColours}
            data={data}
            duration={duration}
        />
    )
}

const StyledCaptureState = styled.span`
    display: inline-block;
    color: grey;
    user-select: none;
`

const StyledTelemetryForKinematicsConfiguration = styled.div`
    user-select: none;
    padding: 10px;
    margin-bottom: 4px;
    background: ${props => props.theme.colorBgContainer};

    .controls {
        display: flex;
        gap: 5px;

        align-items: center;

        .title {
            flex-grow: 1;
            text-align: right;
        }

        .ant-tag:hover {
            outline: 1px solid grey;
        }
    }
`

const StyledDuration = styled.div`
    display: flex;
    gap: 5px;
    align-items: center;
    color: ${props => props.theme.colorText};
    .ant-slider {
        width: 150px;
    }
`

const StyledAxisToggle = styled(Tag)<{ axiscolor: string; selected: boolean }>`
    cursor: pointer;
    span {
        display: block;
        min-width: 18px;
        margin-bottom: 3px;
        text-align: center;
        border-bottom: 2px solid ${props => (props.selected ? props.axiscolor : "transparent")};
    }
`

const TelemetryForKinematicsConfiguration = ({ kinematicsConfiguration, duration }) => {
    const joints = useJointConfigurationList()
    const [selected, setSelected] = useState(
        kinematicsConfiguration.participatingJoints.map(() => true)
    )

    function toggle_selected(index) {
        setSelected(selected.map((v, i) => (i === index ? !v : v)))
    }

    return (
        <StyledTelemetryForKinematicsConfiguration>
            <div className="controls">
                <div>
                    {kinematicsConfiguration.participatingJoints.map((joint, index) => (
                        <StyledAxisToggle
                            key={index}
                            axiscolor={axis_colors[index]}
                            selected={selected[index]}
                            onClick={() => toggle_selected(index)}
                        >
                            <span>{joints[joint].name}</span>
                        </StyledAxisToggle>
                    ))}
                </div>
                <div className="title">{kinematicsConfiguration.name}</div>
            </div>
            <SparklineJoints
                kinematicsConfiguration={kinematicsConfiguration}
                selected={selected}
                duration={duration}
            />
        </StyledTelemetryForKinematicsConfiguration>
    )
}

/**
 * @ignore
 */
export const TelemetryTile = () => {
    const kinematicsConfigurations = useKinematicsConfigurationList()
    const capture = useTelemetryControls()
    const data = useTelemetryData()
    const joints = useJointConfigurationList()
    const [isVisible, setIsVisible] = useState(!document.hidden)

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsVisible(!document.hidden)
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange)
        }
    }, [])

    function download() {
        const dl =
            "data:application/octet-stream;charset=utf-16le;base64," +
            btoa(
                [["t", ...joints.map((_, i) => `j${i}`)]]
                    .concat(
                        data.map(d => {
                            const values = d.joints.map((v, index) => {
                                if (joints[index].jointType === JOINT_TYPE.JOINT_REVOLUTE) {
                                    return (v * 180) / Math.PI
                                }
                                return v
                            })
                            return [d.t, ...values].map(v => v.toString())
                        })
                    )
                    .map(line => line.join(","))
                    .join("\n")
            )

        const a = document.createElement("a")
        document.body.appendChild(a)
        a.download = "telemetry.csv"
        a.href = dl
        a.click()
    }

    function update_pva(e: RadioChangeEvent) {
        capture.setPlot(e.target.value)
    }

    return (
        <DockTileWithToolbar
            toolbar={
                <>
                    <DockToolbarButtonGroup>
                        <Radio.Group
                            size="small"
                            value={capture.plot}
                            buttonStyle="solid"
                            onChange={update_pva}
                        >
                            <Radio.Button value={TelemetryPVA.POS}>Pos</Radio.Button>
                            <Radio.Button value={TelemetryPVA.VEL}>Vel</Radio.Button>
                            <Radio.Button value={TelemetryPVA.ACC}>Acc</Radio.Button>
                        </Radio.Group>
                    </DockToolbarButtonGroup>
                    <DockToolbarButtonGroup>
                        {
                            {
                                [CaptureState.RUNNING]: (
                                    <Button size="small" onClick={() => capture.pause()}>
                                        Pause
                                    </Button>
                                ),
                                [CaptureState.PAUSED]: (
                                    <Space>
                                        <Button size="small" onClick={() => capture.resume()}>
                                            Start
                                        </Button>
                                        <Button size="small" onClick={() => capture.startCapture()}>
                                            Capture
                                        </Button>
                                        {/*
                                        <InputNumber
                                            size="small"
                                            value={capture.captureDuration}
                                            min={10}
                                            max={2500}
                                            step={10}
                                            onChange={captureDuration =>
                                                capture.setDuration(Number(captureDuration))
                                            }
                                        />
*/}
                                    </Space>
                                ),
                                [CaptureState.WAITING]: (
                                    <Button size="small" onClick={() => capture.cancelCapture()}>
                                        Cancel Capture
                                    </Button>
                                ),
                                [CaptureState.COMPLETE]: (
                                    <Space>
                                        <Button size="small" onClick={download}>
                                            Download
                                        </Button>
                                        <Button
                                            size="small"
                                            onClick={() => capture.cancelCapture()}
                                        >
                                            Reset
                                        </Button>
                                    </Space>
                                )
                            }[capture.captureState]
                        }
                    </DockToolbarButtonGroup>
                    <DockToolbarButtonGroup>
                        <StyledDuration>
                            <Slider
                                value={capture.captureDuration}
                                onChange={capture.setDuration}
                                min={250}
                                max={3000}
                                step={250}
                                tooltip={{ placement: "bottom" }}
                            />
                            <span>{capture.captureDuration}ms</span>
                        </StyledDuration>
                    </DockToolbarButtonGroup>
                    <Space>
                        <StyledCaptureState>
                            {CaptureState[capture.captureState]}
                        </StyledCaptureState>
                        {capture.lastCapture ? null : <Tag color="red">NO DATA</Tag>}
                    </Space>
                </>
            }
        >
            {isVisible && (
                <div>
                    {kinematicsConfigurations.map((kinematicsConfiguration, index) => (
                        <div key={index}>
                            <TelemetryForKinematicsConfiguration
                                kinematicsConfiguration={kinematicsConfiguration}
                                duration={capture.captureDuration}
                            />
                        </div>
                    ))}
                </div>
            )}
        </DockTileWithToolbar>
    )
}
