/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { SparklineScrolling } from "./SparklineScrolling"
import styled from "styled-components"
import { Button, Radio, RadioChangeEvent, Slider, Space, Tag } from "antd"
import {
    CaptureState,
    JOINT_TYPE,
    KinematicsConfigurationConfig,
    TelemetryPVAT,
    useJointConfigurationList,
    useKinematicsConfigurationList,
    useTelemetryControls,
    useTelemetryData,
    useTelemetrySettings
} from "@glowbuzzer/store"
import { DockTileWithToolbar } from "../dock/DockTileWithToolbar"
import * as d3 from "d3"
import { DockToolbarButtonGroup } from "../dock/DockToolbar"
import { useLocalStorage } from "../util/LocalStorageHook"

const axis_colors = ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#444444"]

enum TelemetryVisibilityOptions {
    SET = 0b01,
    ACT = 0b10,
    BOTH = 0b11,
    DIFF = 0b100
}

type SparklineJointsProps = {
    kinematicsConfiguration: KinematicsConfigurationConfig
    view: TelemetryVisibilityOptions
    selected: boolean[]
    duration: number
}

const SparklineJoints = ({
    kinematicsConfiguration,
    view,
    selected,
    duration
}: SparklineJointsProps) => {
    const elemRef = useRef<HTMLDivElement>(null)
    const telemetry = useTelemetryData()
    const { plot } = useTelemetrySettings()
    const [height, setHeight] = useState(0)

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                setHeight(entry.contentRect.height)
            }
        })

        if (elemRef.current) {
            resizeObserver.observe(elemRef.current)
        }

        return () => {
            if (elemRef.current) {
                resizeObserver.unobserve(elemRef.current)
            }
        }
    }, [])

    const selectedJointOptions = useMemo(() => {
        return kinematicsConfiguration.participatingJoints
            .map((_, i) => axis_colors[i])
            .filter((_, i) => selected[i])
            .map(color => {
                switch (view) {
                    case TelemetryVisibilityOptions.SET:
                        return [{ color, dashArray: "" }]
                    case TelemetryVisibilityOptions.ACT:
                        return [{ color, dashArray: "2,2" }]
                    case TelemetryVisibilityOptions.BOTH:
                        return [
                            { color, dashArray: "" },
                            { color, dashArray: "2,2" }
                        ]
                    case TelemetryVisibilityOptions.DIFF:
                        return [{ color, dashArray: "" }]
                }
            })
            .flat()
    }, [kinematicsConfiguration.participatingJoints, selected, view])

    const { data, domain } = useMemo(() => {
        const data = telemetry.map(d => ({
            t: d.t,
            values: kinematicsConfiguration.participatingJoints
                .map(index => {
                    switch (view) {
                        case TelemetryVisibilityOptions.SET:
                            return [d.set[index][plot]]
                        case TelemetryVisibilityOptions.ACT:
                            return [d.act[index][plot]]
                        case TelemetryVisibilityOptions.BOTH:
                            return [d.set[index][plot], d.act[index][plot]]
                        case TelemetryVisibilityOptions.DIFF:
                            return [d.set[index][plot] - d.act[index][plot]]
                    }
                })
                .filter((_, i) => selected[i])
                .flat()
        }))

        const domain = d3.extent(
            data.flatMap(d => {
                return d.values.map(n => {
                    return n * 1.1
                })
            })
        )
        return { data, domain }
    }, [telemetry, kinematicsConfiguration, plot, view])

    return (
        <div ref={elemRef} className="chart">
            <SparklineScrolling
                height={height}
                domain={domain}
                options={selectedJointOptions}
                data={data}
                duration={duration}
            />
        </div>
    )
}

const StyledTelemetryGroup = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    background: red;

    > div {
        flex-grow: 1;
    }
`

const StyledCaptureState = styled.span`
    display: inline-block;
    color: grey;
    user-select: none;
`

const StyledTelemetryForKinematicsConfiguration = styled.div`
    user-select: none;
    padding: 10px;
    height: 100%;
    margin-bottom: 4px;
    background: ${props => props.theme.colorBgContainer};
    display: flex;
    flex-direction: column;

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

    .chart {
        flex-grow: 1;
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
    const [view, setView] = useLocalStorage(
        "viewTelemetrySetActBoth",
        TelemetryVisibilityOptions.SET
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
                <div>
                    <Radio.Group
                        size="small"
                        value={view}
                        buttonStyle="solid"
                        onChange={e => setView(e.target.value)}
                    >
                        <Radio.Button value={TelemetryVisibilityOptions.SET}>SET</Radio.Button>
                        <Radio.Button value={TelemetryVisibilityOptions.ACT}>ACT</Radio.Button>
                        <Radio.Button value={TelemetryVisibilityOptions.BOTH}>BOTH</Radio.Button>
                        <Radio.Button value={TelemetryVisibilityOptions.DIFF}>DIFF</Radio.Button>
                    </Radio.Group>
                </div>
                <div className="title">{kinematicsConfiguration.name}</div>
            </div>
            <SparklineJoints
                kinematicsConfiguration={kinematicsConfiguration}
                selected={selected}
                view={view}
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
                            const values = d.set.map((v, index) => {
                                if (joints[index].jointType === JOINT_TYPE.JOINT_REVOLUTE) {
                                    return (v.p * 180) / Math.PI
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

    function update_pvat(e: RadioChangeEvent) {
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
                            onChange={update_pvat}
                        >
                            <Radio.Button value={TelemetryPVAT.POS}>Pos</Radio.Button>
                            <Radio.Button value={TelemetryPVAT.VEL}>Vel</Radio.Button>
                            <Radio.Button value={TelemetryPVAT.ACC}>Acc</Radio.Button>
                            <Radio.Button value={TelemetryPVAT.TORQUE}>Torque</Radio.Button>
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
                <StyledTelemetryGroup>
                    {kinematicsConfigurations.map((kinematicsConfiguration, index) => (
                        <div key={index}>
                            <TelemetryForKinematicsConfiguration
                                kinematicsConfiguration={kinematicsConfiguration}
                                duration={capture.captureDuration}
                            />
                        </div>
                    ))}
                </StyledTelemetryGroup>
            )}
        </DockTileWithToolbar>
    )
}
