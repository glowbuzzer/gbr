/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useMemo } from "react"
import { SparklineScrolling } from "./SparklineScrolling"
import styled from "styled-components"
import { Button, InputNumber } from "antd"
import {
    CaptureState,
    useConfig,
    useKinematicsConfiguration,
    useTelemetryControls,
    useTelemetryData,
    useTelemetrySettings
} from "@glowbuzzer/store"
import { StyledTileContent } from "../util/styles/StyledTileContent"
import { DockTileWithToolbar } from "../dock/DockTileWithToolbar"

const axis_colors = ["red", "green", "blue"]
const axis_keys = ["x", "y", "z"]

const SparklineCartesian = () => {
    const telemetry = useTelemetryData()
    const settings = useTelemetrySettings()
    const kc = useKinematicsConfiguration(0)

    const pos_domain = useMemo(() => {
        // pick the first kinematics parameters
        const { extentsX, extentsY, extentsZ } = kc
        // produce overall [min, max] from individual x, y, z [min, max]
        return [extentsX, extentsY, extentsZ].reduce(
            ([min, max], xyz) => [Math.min(min, xyz?.[0]), Math.max(max, xyz?.[1])],
            [0, 0]
        )
    }, [kc])

    console.log("KC", kc)

    const { vmax, amax } = useMemo(() => kc.linearLimits[0], [kc])
    const options = useMemo(
        () =>
            settings.cartesianAxes
                .map((a, index) => a && { color: axis_colors[index] })
                .filter(o => o),
        [settings]
    )

    if (!settings.cartesianEnabled) {
        return null
    }

    const data = telemetry.map(d => ({
        t: d.t,
        values: settings.cartesianAxes
            .map((a, index) => a && d[axis_keys[index]])
            .filter(o => o !== undefined)
    }))
    const vel =
        settings.velEnabled &&
        data.slice(1).map((d, index) => ({
            t: d.t,
            values: d.values.map((v, axis) => (d.values[axis] - data[index].values[axis]) * 1000)
        }))
    const acc =
        settings.velEnabled &&
        settings.accEnabled &&
        vel.slice(1).map((d, index) => ({
            t: d.t,
            values: d.values.map((v, axis) => (d.values[axis] - vel[index].values[axis]) * 1000)
        }))

    return (
        <>
            <SparklineScrolling domain={pos_domain} options={options} data={data} />
            {vel && <SparklineScrolling domain={[-vmax, vmax]} options={options} data={vel} />}
            {acc && <SparklineScrolling domain={[-amax, amax]} options={options} data={acc} />}
        </>
    )
}

const SparklineJoints = () => {
    const telemetry = useTelemetryData()
    const settings = useTelemetrySettings()
    const config = useConfig()

    const pos_domain = useMemo(() => {
        // produce overall [min, max] from joint min and max settings
        return config.joint.reduce(
            ([min, max], key, index) => {
                if (!settings.joints[index]) {
                    return [min, max]
                }
                const joint_values = telemetry.map(t => t.joints[index])
                return [
                    Math.min(min, Math.min(...joint_values)),
                    Math.max(max, Math.max(...joint_values))
                ]
            },
            [0, 0]
        )
    }, [config.joint, settings.joints, telemetry])

    const vel_domain = config.joint.reduce(
        ([min, max], joint, index) => {
            if (!settings.joints[index]) {
                return [min, max]
            }
            return [Math.min(min, -joint.limits[0].vmax), Math.max(max, joint.limits[0].vmax)]
        },
        [0, 0]
    )

    const acc_domain = config.joint.reduce(
        ([min, max], joint, index) => {
            if (!settings.joints[index]) {
                return [min, max]
            }
            return [Math.min(min, -joint.limits[0].amax), Math.max(max, joint.limits[0].amax)]
        },
        [0, 0]
    )

    const options = useMemo(
        () => settings.joints.filter(j => j).map((a, index) => ({ color: axis_colors[index] })),
        [settings]
    )

    if (!settings.jointsEnabled) {
        return null
    }

    const data = telemetry.map(d => ({
        t: d.t,
        values: settings.joints.filter(j => j).map((a, index) => d.joints[index])
    }))
    const vel =
        settings.velEnabled &&
        data.slice(1).map((d, index) => ({
            t: d.t,
            values: d.values.map((v, axis) => (d.values[axis] - data[index].values[axis]) * 1000)
        }))
    const acc =
        settings.velEnabled &&
        settings.accEnabled &&
        vel.slice(1).map((d, index) => ({
            t: d.t,
            values: d.values.map((v, axis) => (d.values[axis] - vel[index].values[axis]) * 1000)
        }))

    // console.log(telemetry.map(t => `${t.t}, ${t.m7wait}, ${t.joints[0]}`))
    return (
        <>
            <SparklineScrolling domain={pos_domain} options={options} data={data} />
            {vel && <SparklineScrolling domain={vel_domain} options={options} data={vel} />}
            {acc && <SparklineScrolling domain={acc_domain} options={options} data={acc} />}
        </>
    )
}

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

const StyledCaptureState = styled.span`
    display: inline-block;
    margin-right: 20px;
    color: grey;
    user-select: none;
`

const TelemetryControls = () => {
    const capture = useTelemetryControls()
    const data = useTelemetryData()

    function download() {
        const dl =
            "data:application/octet-stream;charset=utf-16le;base64," +
            btoa(
                [["t", "x", "y", "z"]]
                    .concat(data.map(d => [d.t, d.x, d.y, d.z].map(v => v.toString())))
                    .map(line => line.join(","))
                    .join("\n")
            )

        const a = document.createElement("a")
        document.body.appendChild(a)
        a.download = "telemetry.csv"
        a.href = dl
        a.click()
    }

    return (
        <>
            {
                {
                    [CaptureState.CONTINUOUS]: (
                        <>
                            <Button onClick={() => capture.pause()}>Pause</Button>
                            <Button onClick={() => capture.startCapture()}>Start Capture</Button>
                        </>
                    ),
                    [CaptureState.PAUSED]: (
                        <>
                            <StyledCaptureState>PAUSED</StyledCaptureState>
                            <Button onClick={() => capture.resume()}>Resume</Button>
                            <Button onClick={() => capture.startCapture()}>Start Capture</Button>
                        </>
                    ),
                    [CaptureState.WAITING]: (
                        <>
                            <StyledCaptureState>WAITING</StyledCaptureState>
                            <Button onClick={() => capture.cancelCapture()}>Cancel Capture</Button>
                        </>
                    ),
                    [CaptureState.COMPLETE]: (
                        <>
                            <StyledCaptureState>COMPLETE</StyledCaptureState>
                            <Button onClick={download}>Download</Button>
                            <Button onClick={() => capture.cancelCapture()}>Reset</Button>
                        </>
                    ),
                    [CaptureState.TRIGGERED]: <StyledCaptureState>CAPTURING</StyledCaptureState>
                }[capture.captureState]
            }
            &nbsp;
            <InputNumber
                value={capture.captureDuration}
                min={10}
                max={5000}
                step={10}
                onChange={captureDuration => capture.setDuration(Number(captureDuration))}
            />
        </>
    )
}

/**
 * @ignore
 */
export const TelemetryTile = () => {
    return (
        <DockTileWithToolbar toolbar={<TelemetryControls />}>
            <StyledTileContent>
                <SparklineQueue />
                <SparklineCartesian />
                <SparklineJoints />
            </StyledTileContent>
        </DockTileWithToolbar>
    )
}
