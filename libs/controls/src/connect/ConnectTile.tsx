import * as React from "react"
import { Button, Form, Input, Radio, Tag } from "antd"
import {
    ConnectionState,
    DesiredState,
    determine_machine_state,
    MachineState,
    MachineTarget,
    useConnect,
    useMachine,
    usePrefs
} from "@glowbuzzer/store"
import { Tile } from "@glowbuzzer/layout"
import styled from "styled-components"
import { StyledControls } from "../util/styled"
import { TrafficLight } from "./TrafficLight"

const FormTag = styled(Tag)`
    padding-top: 5px;
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

    return (
        <Tile
            title="Connection"
            controls={
                <FlexCentered>
                    <TrafficLight padded width={20} color="red" />
                    <StyledControls>
                        <Radio.Group
                            disabled={connection.state !== ConnectionState.CONNECTED}
                            size={"small"}
                            value={machine.actualTarget}
                            onChange={change_target}
                        >
                            <Radio.Button value={MachineTarget.SIMULATION}>Simulate</Radio.Button>
                            <Radio.Button className="danger" value={MachineTarget.FIELDBUS}>
                                Live
                            </Radio.Button>
                        </Radio.Group>
                        &nbsp;
                        <Radio.Group
                            disabled={connection.state !== ConnectionState.CONNECTED}
                            size={"small"}
                            value={state === MachineState.OPERATION_ENABLED ? DesiredState.OPERATIONAL : DesiredState.STANDBY}
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
                {connection.connected || <h3>Not connected</h3>}
                {!connection.connected && !connection.autoConnect && <Button onClick={connect}>Connect</Button>}
                {connection.connected && <FormTag>{MachineState[machine.currentState]}</FormTag>}
            </div>
        </Tile>
    )
}
