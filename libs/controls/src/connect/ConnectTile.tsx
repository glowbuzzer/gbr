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

const StyledControls = styled.span`
    /*
    .danger.ant-radio-button-wrapper-checked {
        background: #960000;
        color: white;
    }
    .danger {
        color: #960000;
    }
    */
    .ant-radio-button-wrapper:first-child {
        border-radius: 10px 0 0 10px;
    }
    .ant-radio-button-wrapper:last-child {
        border-radius: 0 10px 10px 0;
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
                    {/*
                    <Switch
                        disabled={connection.state !== ConnectionState.CONNECTED}
                        checkedChildren="Simulation"
                        unCheckedChildren="Live"
                        checked={machine.actualTarget === MachineTarget.FIELDBUS}
                        onChange={change_target}
                    />
                    &nbsp;
                    <Switch
                        checkedChildren="Standby"
                        unCheckedChildren="Operate"
                        checked={state === MachineState.OPERATION_ENABLED}
                        onChange={change_desired_state}
                    />
*/}
                </StyledControls>
            }
        >
            <ConnectForm />
        </Tile>
    )
}
