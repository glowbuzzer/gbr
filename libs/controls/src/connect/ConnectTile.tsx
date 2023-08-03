/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useState } from "react"
import { Button, Radio, Space, Spin, Tag } from "antd"
import {
    ConnectionState,
    DesiredState,
    determine_machine_state,
    FaultCode,
    MachineState,
    MACHINETARGET,
    possible_transitions,
    useConnection,
    useEstop,
    useMachine,
    useOfflineConfig
} from "@glowbuzzer/store"
import styled from "styled-components"

const StyledDiv = styled.div`
    padding: 5px;

    .config-info {
        margin: -5px -5px 5px -5px;
        background: rgba(0, 0, 0, 0.05);
        padding: 5px 10px;
    }

    .row {
        &.padded {
            padding: 12px 0;
        }

        padding: 2px 0;
        display: flex;
        justify-content: stretch;
        gap: 20px;
        align-items: center;

        .label {
            flex-grow: 1;
        }

        .estop {
            display: inline-block;
            padding: 2px 8px;
            margin: 0 12px;
            color: ${props => props.theme.colorErrorText};
            border: 1px dashed ${props => props.theme.colorErrorText};
            border-radius: 5px;
        }

        .ant-radio-group {
            display: flex;
            justify-content: stretch;

            .ant-radio-button-wrapper {
                flex-grow: 1;
                flex-basis: 0;
                text-align: center;
            }

            .ant-radio-button-wrapper:first-child {
                border-radius: 10px 0 0 10px;
            }

            .ant-radio-button-wrapper:last-child {
                border-radius: 0 10px 10px 0;
            }
        }

        .controls {
            min-width: 180px;
            text-align: right;

            .ant-tag {
                min-width: 180px;
                text-align: center;
                margin: 0 0 2px 0;
            }

            .ant-btn {
                padding: 0;
                height: inherit;
                min-width: 180px;
            }
        }
    }

    .machine-message {
        text-align: center;
    }
`

/**
 * The connect tile allows you to connect and disconnect from a running GBC, and interact with the basic state of the machine.
 *
 * To change the connection url, use the settings cog in the top right of the tile. Once connected you can switch
 * between simulation and live running, and enable or disable operation. If any faults have occurred these are displayed
 * and you can reset the fault ready and continue operation.
 */
export const ConnectTile = () => {
    const connection = useConnection()
    const machine = useMachine()
    const { modified, usingLocalConfiguration, upload, discard } = useOfflineConfig()
    const [uploading, setUploading] = useState(false)
    const estopActive = useEstop()

    function change_target(e) {
        machine.setDesiredMachineTarget(e.target.value)
    }

    function change_desired_state(e) {
        machine.setDesiredState(e.target.value)
    }

    function upload_config() {
        setUploading(true)
        upload().finally(() => setUploading(false))
    }

    function fetch_remote() {
        discard()
    }

    const state = determine_machine_state(machine.statusWord)

    const connected = connection.connected && connection.statusReceived
    const fault = machine.currentState === MachineState.FAULT
    const fault_active = machine.currentState === MachineState.FAULT_REACTION_ACTIVE
    const target_not_acquired = machine.target !== machine.requestedTarget

    function issue_reset() {
        machine.setMachineControlWord(possible_transitions.FaultReset())
    }

    return (
        <StyledDiv>
            <div>
                {modified ? (
                    connected ? (
                        <div className="config-info">
                            <Space>
                                {usingLocalConfiguration ? (
                                    <>
                                        <div>
                                            Local configuration provided does not match remote. You
                                            should upload a new configuration.
                                        </div>
                                        <Space direction="vertical">
                                            <Button
                                                size="small"
                                                style={{ width: "100%" }}
                                                onClick={upload_config}
                                                disabled={uploading}
                                            >
                                                Upload
                                            </Button>
                                            <Button
                                                size="small"
                                                style={{ width: "100%" }}
                                                onClick={fetch_remote}
                                            >
                                                Fetch
                                            </Button>
                                        </Space>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            Configuration has been modified since you last
                                            connected. You should save or discard your local
                                            changes.
                                        </div>
                                        <Space direction="vertical">
                                            <Button
                                                size="small"
                                                style={{ width: "100%" }}
                                                onClick={upload_config}
                                                disabled={uploading}
                                            >
                                                Save
                                            </Button>
                                            <Button size="small" onClick={discard}>
                                                Discard
                                            </Button>
                                        </Space>
                                    </>
                                )}
                            </Space>
                        </div>
                    ) : usingLocalConfiguration ? null : (
                        <div className="config-info">
                            <Space size={"small"}>
                                <div>
                                    Configuration has been modified since last connect. You need to
                                    connect in order to save your local changes.
                                </div>
                                <Button size="small" onClick={discard}>
                                    Discard
                                </Button>
                            </Space>
                        </div>
                    )
                ) : null}
            </div>

            <div className="row">
                <div className="label">Machine</div>
                <div className="controls">
                    <Tag color={connected ? undefined : "red"}>
                        {connected ? machine.name || "Unknown" : "Not Connected"}
                    </Tag>
                </div>
            </div>
            <div className="row">
                <div className="label">Change mode</div>
                <div className="controls">
                    <Radio.Group
                        disabled={connection.state !== ConnectionState.CONNECTED}
                        size={"small"}
                        value={machine.target}
                        onChange={change_target}
                    >
                        <Radio.Button value={MACHINETARGET.MACHINETARGET_SIMULATION}>
                            Simulate
                        </Radio.Button>
                        <Radio.Button
                            className="danger"
                            value={MACHINETARGET.MACHINETARGET_FIELDBUS}
                        >
                            {target_not_acquired &&
                            machine.requestedTarget === MACHINETARGET.MACHINETARGET_FIELDBUS ? (
                                <span>
                                    <Spin size="small" />{" "}
                                </span>
                            ) : null}
                            Live
                        </Radio.Button>
                    </Radio.Group>
                </div>
            </div>
            <div className="row">
                <div className="label">
                    Machine operation
                    {estopActive && <span className="estop">ESTOP</span>}
                </div>
                <div className="controls">
                    <Radio.Group
                        disabled={!connected || fault || fault_active || target_not_acquired}
                        size={"small"}
                        value={
                            state === MachineState.OPERATION_ENABLED
                                ? DesiredState.OPERATIONAL
                                : DesiredState.STANDBY
                        }
                        onChange={change_desired_state}
                    >
                        <Radio.Button value={DesiredState.STANDBY}>Disabled</Radio.Button>
                        <Radio.Button
                            className="danger"
                            value={DesiredState.OPERATIONAL}
                            disabled={estopActive}
                        >
                            Enabled
                        </Radio.Button>
                    </Radio.Group>
                </div>
            </div>
            <div className="row">
                <div className="label">Current state</div>
                <div className="controls">
                    <Tag>{connected ? MachineState[machine.currentState] : "None"}</Tag>
                </div>
            </div>
            {connected && fault && (
                <div className="row">
                    <div className="label" />
                    <div className="controls">
                        <Button onClick={issue_reset}>Reset Fault</Button>
                    </div>
                </div>
            )}
            {fault_active && (
                <div className="row">
                    <div className="label">Fault cause</div>
                    <div className="controls">
                        {Object.values(FaultCode)
                            .filter(k => typeof k === "number")
                            .filter((k: number) => machine.activeFault & k)
                            .map(k => (
                                <Tag key={k} color="red">
                                    {FaultCode[k].substring("FAULT_CAUSE_".length)}
                                </Tag>
                            ))}
                    </div>
                </div>
            )}
            {connected && fault && machine.faultHistory > 0 && (
                <div className="row padded">
                    <div className="label">Fault history</div>
                    <div className="controls">
                        {Object.values(FaultCode)
                            .filter(k => typeof k === "number")
                            .filter((k: number) => machine.faultHistory & k)
                            .map(k => (
                                <Tag key={k}>{FaultCode[k].substring("FAULT_CAUSE_".length)}</Tag>
                            ))}
                    </div>
                </div>
            )}

            {machine.operationErrorMessage?.length > 0 && (
                <div className="machine-message">{machine.operationErrorMessage}</div>
            )}
            {connection.statusReceived || <h3>No status received</h3>}
            {machine.heartbeatReceived || <h3>Lost heartbeat</h3>}
        </StyledDiv>
    )
}
