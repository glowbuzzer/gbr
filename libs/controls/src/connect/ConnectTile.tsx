/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Button, Radio, Spin, Tag } from "antd"
import {
    ConnectionState,
    DesiredState,
    determine_machine_state,
    FaultCode,
    MachineState,
    MACHINETARGET,
    possible_transitions,
    useConnection,
    useMachine
} from "@glowbuzzer/store"
import styled from "styled-components"

export const ConnectTileHelp = () => (
    <div>
        <h4>Connection Tile</h4>
        <p>
            The connection tile is used to connect to GBC and the PLC (GBEM/GBSM etc.) and manage
            their joint state.
        </p>
        <p>
            The "Simulate" and "Live" buttons toggle between Simulating a PLC and being connected
            live to a PLC and controlling a real machine.
        </p>
        <p>
            The "Disabled" and "Live" buttons control the state of the machine. Disabled means the
            machine is not operational whereas Live means the machine is able to move
        </p>
        <p>"Current" state shows the current state of the real or simulated machine</p>
        <p>
            In the bottom half of the tile, faults are displayed. Ether active faults or a fault
            history.
        </p>
    </div>
)

const StyledDiv = styled.div`
    padding: 5px;

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
 * The url used to connect is set in the preferences (see {@link PreferencesDialog}). Once connected you can switch
 * between simulation and live running, and enable or disable operation. If any faults have occurred these are displayed
 * and you can reset the fault ready and continue operation.
 */
export const ConnectTile = () => {
    const connection = useConnection()
    const machine = useMachine()

    function change_target(e) {
        machine.setDesiredMachineTarget(e.target.value)
    }

    function change_desired_state(e) {
        machine.setDesiredState(e.target.value)
    }

    const state = determine_machine_state(machine.statusWord)

    function connect() {
        connection.setAutoConnect(true)
    }

    function disconnect() {
        connection.setAutoConnect(false)
        connection.disconnect()
    }

    const connected = connection.connected && connection.statusReceived
    const fault = machine.currentState === MachineState.FAULT
    const fault_active = machine.currentState === MachineState.FAULT_REACTION_ACTIVE
    const target_not_acquired = machine.target !== machine.requestedTarget

    function determine_traffic_light_color() {
        if (!connected) {
            return "red"
        }
        if (!machine.heartbeatReceived || machine.activeFault) {
            return "orange"
        }
        return "green"
    }

    function issue_reset() {
        machine.setMachineControlWord(possible_transitions.FaultReset())
    }

    return (
        <StyledDiv>
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
                <div className="label">Machine operation</div>
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
                        <Radio.Button className="danger" value={DesiredState.OPERATIONAL}>
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
