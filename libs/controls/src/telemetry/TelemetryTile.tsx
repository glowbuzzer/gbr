/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useMemo, useState } from "react"
import { SparklineScrolling } from "./SparklineScrolling"
import { Tile, TileSettings } from "../tiles"
import styled from "styled-components"
import { Button, Checkbox, Col, InputNumber, Row } from "antd"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import {
    CaptureState,
    TelemetrySettingsType,
    telemetrySlice,
    useConfig,
    useTelemetryControls,
    useTelemetryData,
    useTelemetrySettings
} from "@glowbuzzer/store"
import { useDispatch } from "react-redux"

const StyledSettings = styled.div``
const Selection = styled.div`
    .ant-checkbox-wrapper {
        display: block;
        margin-left: 24px;
    }
`

type TelemetrySettingsDialogProps = {
    settings: TelemetrySettingsType
    onChange(settings: Partial<TelemetrySettingsType>): void
}

const TelemetrySettingsDialog = ({ settings, onChange }: TelemetrySettingsDialogProps) => {
    const { cartesianAxes, joints, cartesianEnabled, queueEnabled } = settings

    function update_cartesian(event: CheckboxChangeEvent) {
        const { name, checked } = event.target
        const index = ["x", "y", "z"].indexOf(name)
        const update = [...cartesianAxes]
        update[index] = checked
        onChange({
            cartesianAxes: update
        })
    }

    function update_joint(event: CheckboxChangeEvent) {
        const { name, checked } = event.target
        const update = [...joints]
        update[Number(name)] = checked
        onChange({
            joints: update
        })
    }

    function update_display(event: CheckboxChangeEvent) {
        const { name, checked } = event.target
        onChange({
            [name]: checked
        })
    }

    return (
        <StyledSettings>
            <Row>
                <Col span={8}>
                    <Checkbox
                        checked={cartesianEnabled}
                        onChange={event => {
                            onChange({ cartesianEnabled: event.target.checked })
                        }}
                    >
                        Cartesian
                    </Checkbox>
                    <Selection>
                        <Checkbox
                            name="x"
                            checked={cartesianAxes[0]}
                            onChange={update_cartesian}
                            disabled={!settings.cartesianEnabled}
                        >
                            X
                        </Checkbox>
                        <Checkbox
                            name="y"
                            checked={cartesianAxes[1]}
                            onChange={update_cartesian}
                            disabled={!settings.cartesianEnabled}
                        >
                            Y
                        </Checkbox>
                        <Checkbox
                            name="z"
                            checked={cartesianAxes[2]}
                            onChange={update_cartesian}
                            disabled={!settings.cartesianEnabled}
                        >
                            Z
                        </Checkbox>
                    </Selection>
                </Col>
                <Col span={8}>
                    <Checkbox
                        checked={settings.jointsEnabled}
                        onChange={event => {
                            onChange({ jointsEnabled: event.target.checked })
                        }}
                    >
                        Joint
                    </Checkbox>
                    <Selection>
                        <Checkbox
                            name="0"
                            checked={joints[0]}
                            onChange={update_joint}
                            disabled={!settings.jointsEnabled}
                        >
                            Joint 1
                        </Checkbox>
                        <Checkbox
                            name="1"
                            checked={joints[1]}
                            onChange={update_joint}
                            disabled={!settings.jointsEnabled}
                        >
                            Joint 2
                        </Checkbox>
                        <Checkbox
                            name="2"
                            checked={joints[2]}
                            onChange={update_joint}
                            disabled={!settings.jointsEnabled}
                        >
                            Joint 3
                        </Checkbox>
                        <Checkbox
                            name="3"
                            checked={joints[3]}
                            onChange={update_joint}
                            disabled={!settings.jointsEnabled}
                        >
                            Joint 4
                        </Checkbox>
                        <Checkbox
                            name="4"
                            checked={joints[4]}
                            onChange={update_joint}
                            disabled={!settings.jointsEnabled}
                        >
                            Joint 5
                        </Checkbox>
                        <Checkbox
                            name="5"
                            checked={joints[5]}
                            onChange={update_joint}
                            disabled={!settings.jointsEnabled}
                        >
                            Joint 6
                        </Checkbox>
                    </Selection>
                </Col>
                <Col span={8}>
                    <Checkbox
                        checked={queueEnabled}
                        onChange={event => {
                            onChange({ queueEnabled: event.target.checked })
                        }}
                    >
                        Queue Info
                    </Checkbox>
                </Col>
            </Row>
            <div>
                Show
                <p>
                    <Checkbox
                        name="posEnabled"
                        checked={settings.posEnabled}
                        onChange={update_display}
                    >
                        Position
                    </Checkbox>
                    <Checkbox
                        name="velEnabled"
                        checked={settings.velEnabled}
                        onChange={update_display}
                    >
                        Velocity
                    </Checkbox>
                    <Checkbox
                        name="accEnabled"
                        checked={settings.accEnabled}
                        onChange={update_display}
                    >
                        Acceleration
                    </Checkbox>
                </p>
            </div>
        </StyledSettings>
    )
}

const TelemetrySettings = () => {
    const initialSettings = useTelemetrySettings()
    const [settings, saveSettings] = useState<TelemetrySettingsType>(initialSettings)
    const dispatch = useDispatch()

    function save() {
        dispatch(telemetrySlice.actions.settings(settings))
    }

    function update_settings(change: Partial<TelemetrySettingsType>) {
        saveSettings(settings => ({ ...settings, ...change }))
    }

    return (
        <TileSettings onConfirm={save}>
            <TelemetrySettingsDialog settings={settings} onChange={update_settings} />
        </TileSettings>
    )
}

const axis_colors = ["red", "green", "blue"]
const axis_keys = ["x", "y", "z"]

const SparklineCartesian = () => {
    const telemetry = useTelemetryData()
    const settings = useTelemetrySettings()
    const config = useConfig()

    const kparams = config.kinematicsConfiguration[Object.keys(config.kinematicsConfiguration)[0]]

    const pos_domain = useMemo(() => {
        // pick the first kinematics parameters
        const { extentsX, extentsY, extentsZ } = kparams
        // produce overall [min, max] from individual x, y, z [min, max]
        return [extentsX, extentsY, extentsZ].reduce(
            ([min, max], xyz) => [Math.min(min, xyz?.[0]), Math.max(max, xyz?.[1])],
            [0, 0]
        )
    }, [kparams])

    const { vmax, amax } = useMemo(() => kparams.linearLimits[0], [kparams])
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
        return Object.keys(config.joint).reduce(
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

    const vel_domain = Object.keys(config.joint).reduce(
        ([min, max], key, index) => {
            if (!settings.joints[index]) {
                return [min, max]
            }
            return [
                Math.min(min, -config.joint[key].limits[0].vmax),
                Math.max(max, config.joint[key].limits[0].vmax)
            ]
        },
        [0, 0]
    )

    const acc_domain = Object.keys(config.joint).reduce(
        ([min, max], key, index) => {
            if (!settings.joints[index]) {
                return [min, max]
            }
            return [
                Math.min(min, -config.joint[key].limits[0].amax),
                Math.max(max, config.joint[key].limits[0].amax)
            ]
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
        <Tile title="Telemetry" settings={<TelemetrySettings />} footer={<TelemetryControls />}>
            <SparklineQueue />
            <SparklineCartesian />
            <SparklineJoints />
        </Tile>
    )
}
