import * as React from "react"
import { Button, Radio, Tag } from "antd"
import { ConnectionState, DesiredState, determine_machine_state, FaultCode, MachineState, MACHINETARGET, possible_transitions, useConnect, useMachine } from "@glowbuzzer/store"
import { Tile } from "@glowbuzzer/layout"
import styled from "styled-components"
import { TrafficLight } from "./TrafficLight"

const FlexCentered = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`

const StyledDiv = styled.div`
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
`

export const ConnectTile = () => {
    const connection = useConnect()
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

    const traffic_light_color = determine_traffic_light_color()

    return (
        <Tile
            title="Connection"
            controls={
                <FlexCentered>
                    {connection.connected ? (
                        <Button onClick={disconnect}>Disconnect</Button>
                    ) : (
                        <div>Not connected</div>
                    )}
                    {!connection.connected && !connection.autoConnect && (
                        <Button onClick={connect}>Connect</Button>
                    )}
                    <TrafficLight width={20} color={traffic_light_color} />
                </FlexCentered>
            }
        >
            <StyledDiv>
                <div className="row">
                    <div className="label">Change mode</div>
                    <div className="controls">
                        <Radio.Group
                            disabled={connection.state !== ConnectionState.CONNECTED}
                            size={"small"}
                            value={machine.actualTarget}
                            onChange={change_target}
                        >
                            <Radio.Button value={MACHINETARGET.MACHINETARGET_SIMULATION}>
                                Simulate
                            </Radio.Button>
                            <Radio.Button
                                className="danger"
                                value={MACHINETARGET.MACHINETARGET_FIELDBUS}
                            >
                                Live
                            </Radio.Button>
                        </Radio.Group>
                    </div>
                </div>
                <div className="row">
                    <div className="label">Machine operation</div>
                    <div className="controls">
                        <Radio.Group
                            disabled={!connected || fault || fault_active}
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
                        <Tag>{connected ? MachineState[machine.currentState] : "DISCONNECTED"}</Tag>
                    </div>
                </div>
                {connected && fault && <div className="row">
                    <div className="label" />
                    <div className="controls">
                        <Button onClick={issue_reset}>Reset Fault</Button>
                    </div>
                </div>}
                {fault_active && <div className="row">
                    <div className="label">Fault cause</div>
                    <div className="controls">
                        {Object.values(FaultCode)
                            .filter(k => typeof k === "number")
                            .filter((k: number) => machine.activeFault & k)
                            .map(k => (
                                <Tag key={k} color="red">
                                    {FaultCode[k].substr("FAULT_CAUSE_".length)}
                                </Tag>
                            ))}
                    </div>
                </div>}
                {connected && fault && machine.faultHistory > 0 && <div className="row padded">
                    <div className="label">Fault history</div>
                    <div className="controls">
                        {Object.values(FaultCode)
                            .filter(k => typeof k === "number")
                            .filter((k: number) => machine.faultHistory & k)
                            .map(k => (
                                <Tag key={k}>
                                    {FaultCode[k].substr("FAULT_CAUSE_".length)}
                                </Tag>
                            ))}
                    </div>
                </div>}

                {connection.statusReceived || <h3>No status received</h3>}
                {machine.heartbeatReceived || <h3>Lost heartbeat</h3>}
            </StyledDiv>
        </Tile>
    )
}
