/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useMemo } from "react"
import { SparklineScrolling } from "./SparklineScrolling"
import styled from "styled-components"
import { Button, InputNumber, Radio, RadioChangeEvent, Space, Tag } from "antd"
import {
    CaptureState,
    JOINT_TYPE,
    JointConfig,
    TelemetryPVA,
    useJointConfig,
    useKinematicsConfigurationList,
    useTelemetryControls,
    useTelemetryData,
    useTelemetrySettings
} from "@glowbuzzer/store"
import { StyledTileContent } from "../util/styles/StyledTileContent"
import { DockTileWithToolbar } from "../dock/DockTileWithToolbar"
import * as d3 from "d3"
import { DockToolbarButtonGroup } from "../dock/DockToolbar"

const axis_colors = ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c"]

const SparklineJoints = ({ kinematicsConfiguration }) => {
    const telemetry = useTelemetryData()
    const { plot } = useTelemetrySettings()
    const jointConfigurations = useJointConfig()
    const participatingJoints: JointConfig[] = kinematicsConfiguration.participatingJoints.map(
        n => jointConfigurations[n]
    )

    const { data, domain } = useMemo(() => {
        let data = telemetry.map(d => ({
            t: d.t,
            values: kinematicsConfiguration.participatingJoints.map(index => d.joints[index])
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
            options={axis_colors.slice(0, participatingJoints.length).map(color => ({ color }))}
            data={data}
        />
    )
}

/*
const SparklineQueue = () => {
    const telemetry = useTelemetryData()
    const settings = useTelemetrySettings()

    const cap_options = useMemo(() => [{ color: axis_colors[0] }, { color: axis_colors[1] }], [])
    const wait_options = useMemo(() => [{ color: axis_colors[0] }], [])

    if (!settings.queueEnabled) {
        return null
    }

    const cap = telemetry.map(d => ({
        t: d.t,
        values: [d.m7cap, d.m4cap]
    }))

    const wait = telemetry.map(d => ({
        t: d.t,
        values: [d.m7wait || 0]
    }))

    return (
        <>
            <SparklineScrolling domain={[0, 150]} options={cap_options} data={cap} />
            <SparklineScrolling domain={[0, 10]} options={wait_options} data={wait} />
        </>
    )
}
*/

const StyledCaptureState = styled.span`
    display: inline-block;
    color: grey;
    user-select: none;
`

const TelemetryControls = () => {
    const capture = useTelemetryControls()
    const data = useTelemetryData()
    const joints = useJointConfig()

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
                                    Start Capture
                                </Button>
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
                                <Button size="small" onClick={() => capture.cancelCapture()}>
                                    Reset
                                </Button>
                            </Space>
                        )
                    }[capture.captureState]
                }
            </DockToolbarButtonGroup>
            <Space>
                <StyledCaptureState>{CaptureState[capture.captureState]}</StyledCaptureState>
                {capture.lastCapture ? null : <Tag color="red">NO DATA</Tag>}
            </Space>
        </>
    )
}

/**
 * @ignore
 */
export const TelemetryTile = () => {
    const kinematicsConfigurations = useKinematicsConfigurationList()
    return (
        <DockTileWithToolbar toolbar={<TelemetryControls />}>
            <StyledTileContent>
                {kinematicsConfigurations.map((kinematicsConfiguration, index) => (
                    <SparklineJoints
                        key={index}
                        kinematicsConfiguration={kinematicsConfiguration}
                    />
                ))}
            </StyledTileContent>
        </DockTileWithToolbar>
    )
}
