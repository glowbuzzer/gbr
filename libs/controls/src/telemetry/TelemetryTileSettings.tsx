/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import styled from "styled-components"
import { TelemetrySettingsType, telemetrySlice, useTelemetrySettings } from "@glowbuzzer/store"
import * as React from "react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import { Checkbox, Col, Modal, Row } from "antd"

const StyledSettings = styled.div``

const Selection = styled.div`
    .item {
        margin-left: 24px;
    }
`

/** @ignore */
export const TelemetryTileSettings = ({ open, onClose }) => {
    const initialSettings = useTelemetrySettings()
    const [settings, saveSettings] = useState<TelemetrySettingsType>(initialSettings)
    const dispatch = useDispatch()

    function save() {
        dispatch(telemetrySlice.actions.settings(settings))
        onClose()
    }

    function update_settings(change: Partial<TelemetrySettingsType>) {
        saveSettings(settings => ({ ...settings, ...change }))
    }

    const { cartesianAxes, joints, cartesianEnabled, queueEnabled } = settings

    function update_cartesian(event: CheckboxChangeEvent) {
        const { name, checked } = event.target
        const index = ["x", "y", "z"].indexOf(name)
        const update = [...cartesianAxes]
        update[index] = checked
        update_settings({
            cartesianAxes: update
        })
    }

    function update_joint(event: CheckboxChangeEvent) {
        const { name, checked } = event.target
        const update = [...joints]
        update[Number(name)] = checked
        update_settings({
            joints: update
        })
    }

    function update_display(event: CheckboxChangeEvent) {
        const { name, checked } = event.target
        update_settings({
            [name]: checked
        })
    }

    return (
        <Modal title="Telemetry Settings" open={open} onCancel={onClose} onOk={save}>
            <StyledSettings>
                <Row>
                    <Col span={8}>
                        <Checkbox
                            checked={cartesianEnabled}
                            onChange={event => {
                                update_settings({ cartesianEnabled: event.target.checked })
                            }}
                        >
                            Cartesian
                        </Checkbox>
                        <Selection>
                            <div className="item">
                                <Checkbox
                                    name="x"
                                    checked={cartesianAxes[0]}
                                    onChange={update_cartesian}
                                    disabled={!settings.cartesianEnabled}
                                >
                                    X
                                </Checkbox>
                            </div>
                            <div className="item">
                                <Checkbox
                                    name="y"
                                    checked={cartesianAxes[1]}
                                    onChange={update_cartesian}
                                    disabled={!settings.cartesianEnabled}
                                >
                                    Y
                                </Checkbox>
                            </div>
                            <div className="item">
                                <Checkbox
                                    name="z"
                                    checked={cartesianAxes[2]}
                                    onChange={update_cartesian}
                                    disabled={!settings.cartesianEnabled}
                                >
                                    Z
                                </Checkbox>
                            </div>
                        </Selection>
                    </Col>
                    <Col span={8}>
                        <Checkbox
                            checked={settings.jointsEnabled}
                            onChange={event => {
                                update_settings({ jointsEnabled: event.target.checked })
                            }}
                        >
                            Joint
                        </Checkbox>
                        <Selection>
                            <div className="item">
                                <Checkbox
                                    name="0"
                                    checked={joints[0]}
                                    onChange={update_joint}
                                    disabled={!settings.jointsEnabled}
                                >
                                    Joint 1
                                </Checkbox>
                            </div>
                            <div className="item">
                                <Checkbox
                                    name="1"
                                    checked={joints[1]}
                                    onChange={update_joint}
                                    disabled={!settings.jointsEnabled}
                                >
                                    Joint 2
                                </Checkbox>
                            </div>
                            <div className="item">
                                <Checkbox
                                    name="2"
                                    checked={joints[2]}
                                    onChange={update_joint}
                                    disabled={!settings.jointsEnabled}
                                >
                                    Joint 3
                                </Checkbox>
                            </div>
                            <div className="item">
                                <Checkbox
                                    name="3"
                                    checked={joints[3]}
                                    onChange={update_joint}
                                    disabled={!settings.jointsEnabled}
                                >
                                    Joint 4
                                </Checkbox>
                            </div>
                            <div className="item">
                                <Checkbox
                                    name="4"
                                    checked={joints[4]}
                                    onChange={update_joint}
                                    disabled={!settings.jointsEnabled}
                                >
                                    Joint 5
                                </Checkbox>
                            </div>
                            <div className="item">
                                <Checkbox
                                    name="5"
                                    checked={joints[5]}
                                    onChange={update_joint}
                                    disabled={!settings.jointsEnabled}
                                >
                                    Joint 6
                                </Checkbox>
                            </div>
                        </Selection>
                    </Col>
                    <Col span={8}>
                        <Checkbox
                            checked={queueEnabled}
                            onChange={event => {
                                update_settings({ queueEnabled: event.target.checked })
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
        </Modal>
    )
}
