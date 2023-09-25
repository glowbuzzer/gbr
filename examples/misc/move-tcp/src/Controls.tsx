/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { Radio, RadioChangeEvent, Space, Switch } from "antd"
import React from "react"

export function Controls({ controls }) {
    const {
        freeMovement,
        setFreeMovement,
        waist,
        setWaist,
        elbow,
        setElbow,
        wrist,
        setWrist,
        activeConfiguration,
        setActiveConfiguration,
        tcpControlsActive,
        setTcpControlsActive
    } = controls

    const onChangeWaist = ({ target: { value } }: RadioChangeEvent) => {
        setWaist(value)
    }

    const onChangeElbow = ({ target: { value } }: RadioChangeEvent) => {
        setElbow(value)
    }

    const onChangeWrist = ({ target: { value } }: RadioChangeEvent) => {
        setWrist(value)
    }

    const waistConfigurationName = ["Waist L", "Waist R"]
    const elbowConfigurationName = ["Elbow U", "Elbow D"]
    const wristConfigurationName = ["Wrist U", "Wrist D"]

    const waistConfiguration =
        activeConfiguration == 1 ||
        activeConfiguration == 2 ||
        activeConfiguration == 4 ||
        activeConfiguration == 6
            ? 0
            : 1
    const elbowConfiguration =
        activeConfiguration == 2 ||
        activeConfiguration == 3 ||
        activeConfiguration == 6 ||
        activeConfiguration == 7
            ? 0
            : 1
    const wristConfiguration =
        activeConfiguration == 4 ||
        activeConfiguration == 5 ||
        activeConfiguration == 6 ||
        activeConfiguration == 7
            ? 0
            : 1

    return (
        <div className="tcpControls">
            <h2>TCP controls</h2>
            <h4>Enable TCP controls</h4>
            <div className="tcpSwitch">
                <Space>
                    <Switch onChange={setTcpControlsActive} checked={tcpControlsActive} />
                </Space>
            </div>
            <h4>Free or locked to configuration</h4>
            <div className="tcpSwitch">
                <Space>
                    Locked
                    <Switch
                        disabled={!tcpControlsActive}
                        onChange={setFreeMovement}
                        checked={freeMovement}
                    />
                    Free
                </Space>
            </div>
            <h4>Waist</h4>
            <Radio.Group
                onChange={onChangeWaist}
                disabled={freeMovement || !tcpControlsActive}
                value={waist}
            >
                <Radio value={0}>Waist Left</Radio>
                <Radio value={1}>Waist Right</Radio>
            </Radio.Group>
            <h4>Elbow</h4>
            <Radio.Group
                onChange={onChangeElbow}
                disabled={freeMovement || !tcpControlsActive}
                value={elbow}
            >
                <Radio value={0}>Elbow Up</Radio>
                <Radio value={1}>Elbow Down</Radio>
            </Radio.Group>
            <h4>Wrist</h4>
            <Radio.Group
                onChange={onChangeWrist}
                disabled={freeMovement || !tcpControlsActive}
                value={wrist}
            >
                <Radio value={0}>Wrist Up</Radio>
                <Radio value={1}>Wrist Down</Radio>
            </Radio.Group>
            <h4>Configuration</h4>
            <p>{waistConfigurationName[waistConfiguration]}</p>
            <p>{elbowConfigurationName[elbowConfiguration]}</p>
            <p>{wristConfigurationName[wristConfiguration]}</p>
        </div>
    )
}
