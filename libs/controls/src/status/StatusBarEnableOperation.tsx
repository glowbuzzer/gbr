/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import {
    DesiredState,
    MachineState,
    useConnection,
    useEstopInput,
    useMachine
} from "@glowbuzzer/store"
import { Button, Space } from "antd"
import styled from "styled-components"

const StyledSpace = styled(Space)`
    .ant-btn {
        min-width: 160px;
    }

    .disable-operation {
        background-color: ${props => props.theme.red4};
    }
    .ant-btn.disable-operation:hover {
        background-color: ${props => props.theme.red5};
    }
`

export const StatusBarEnableOperation = () => {
    const connection = useConnection()
    const machine = useMachine()
    const estopActive = useEstopInput()
    const connected = connection.connected && connection.statusReceived
    const fault = machine.currentState === MachineState.FAULT
    const fault_active = machine.currentState === MachineState.FAULT_REACTION_ACTIVE
    const target_not_acquired = machine.target !== machine.requestedTarget

    const disabled = !connected || fault || fault_active || target_not_acquired

    const op = machine.currentState === MachineState.OPERATION_ENABLED
    const loading = !op && machine.desiredState === DesiredState.OPERATIONAL

    function enable() {
        machine.setDesiredState(DesiredState.OPERATIONAL)
    }
    function disable() {
        machine.setDesiredState(DesiredState.STANDBY)
    }

    return (
        <StyledSpace>
            {estopActive && <span className="estop">SAFETY</span>}
            {op ? (
                <Button
                    className="disable-operation"
                    disabled={disabled}
                    onClick={disable}
                    color="red"
                    type="primary"
                >
                    DISABLE
                </Button>
            ) : (
                <Button disabled={disabled || loading} onClick={enable}>
                    ENABLE OPERATION
                </Button>
            )}
        </StyledSpace>
    )
}
