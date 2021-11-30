import * as React from "react"
import { Button, Radio, Tag } from "antd"
import {
    ConnectionState,
    DesiredState,
    determine_machine_state,
    MachineState,
    useConnect,
    useMachine,
    FaultCode,
    MACHINETARGET
} from "@glowbuzzer/store"
import { Tile } from "@glowbuzzer/layout"
import styled from "@emotion/styled"
import { StyledControls } from "../util/styled"
import { TrafficLight } from "./TrafficLight"

const PaddedTag = styled(Tag)`
    margin-top: 5px;
`

const FlexCentered = styled.div`
    display: flex;
    gap: 4px;
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

    function determine_traffic_light_color() {
        if (!(connection.connected && connection.statusReceived)) {
            return "red"
        }
        if (!machine.heartbeatReceived || machine.activeFault) {
            return "orange"
        }
        return "green"
    }

    const traffic_light_color = determine_traffic_light_color()

    return (
        <Tile
            title="Connection"
            controls={
                <FlexCentered>
                    <TrafficLight width={20} color={traffic_light_color} />
                    <StyledControls>
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
                        &nbsp;
                        <Radio.Group
                            disabled={connection.state !== ConnectionState.CONNECTED}
                            size={"small"}
                            value={
                                state === MachineState.OPERATION_ENABLED
                                    ? DesiredState.OPERATIONAL
                                    : DesiredState.STANDBY
                            }
                            onChange={change_desired_state}
                        >
                            <Radio.Button value={DesiredState.STANDBY}>Standby</Radio.Button>
                            <Radio.Button className="danger" value={DesiredState.OPERATIONAL}>
                                Operate
                            </Radio.Button>
                        </Radio.Group>
                    </StyledControls>
                </FlexCentered>
            }
        >
            <div>
                {connection.connected ? (
                    <div>
                        <Button onClick={disconnect}>Disconnect</Button>
                    </div>
                ) : (
                    <h3>Not connected</h3>
                )}
                {connection.statusReceived || <h3>No status received</h3>}
                {machine.heartbeatReceived || <h3>Lost heartbeat</h3>}
                {!connection.connected && !connection.autoConnect && (
                    <Button onClick={connect}>Connect</Button>
                )}
                {connection.connected && connection.statusReceived && (
                    <PaddedTag>{MachineState[machine.currentState]}</PaddedTag>
                )}
                {Object.values(FaultCode)
                    .filter(k => typeof k === "number")
                    .filter((k: number) => machine.activeFault & k)
                    .map(k => (
                        <PaddedTag key={k} color="red">
                            {FaultCode[k].substr("FAULT_CAUSE_".length)}
                        </PaddedTag>
                    ))}
            </div>
        </Tile>
    )
}
