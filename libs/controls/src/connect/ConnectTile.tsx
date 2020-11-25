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

const FormTag = styled(Tag)`
    padding-top: 5px;
`

const ConnectForm = () => {
    const connection = useConnect()
    const prefs = usePrefs()
    const machine = useMachine()

    const connect = () => connection.connect(prefs.current.url)
    const disconnect = () => connection.disconnect()

    function update_url(e) {
        prefs.set("url", e.target.value)
    }

    return (
        <Form layout={"inline"}>
            <Form.Item name="url" label="url">
                <Input defaultValue={prefs.current.url} onChange={update_url} />
            </Form.Item>
            <Form.Item>
                {connection.state === ConnectionState.CONNECTED ? (
                    <Button type="primary" htmlType="submit" onClick={disconnect}>
                        Disconnect
                    </Button>
                ) : (
                    <Button type="primary" htmlType="submit" onClick={connect} disabled={connection.state === ConnectionState.CONNECTING}>
                        Connect
                    </Button>
                )}
            </Form.Item>
            {connection.error}
            {connection.connected && <FormTag>{MachineState[machine.currentState]}</FormTag>}
        </Form>
    )
}

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

    return (
        <Tile
            title="Connection"
            controls={
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
            }
        >
            <ConnectForm />
        </Tile>
    )
}
