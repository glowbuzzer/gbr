/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import {
    DesiredState,
    MachineState,
    useConnection,
    useEstopInput,
    useMachineCurrentState,
    useMachineDesiredState,
    useMachineTargetState
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
    // const machine = useMachine()
    const currentState = useMachineCurrentState()
    const [target] = useMachineTargetState()
    const [, requestedTarget] = useMachineTargetState()
    const [desiredState, setDesiredState] = useMachineDesiredState()

    const estopActive = useEstopInput()
    const connected = connection.connected && connection.statusReceived
    const fault = currentState === MachineState.FAULT
    const fault_active = currentState === MachineState.FAULT_REACTION_ACTIVE
    const target_not_acquired = target !== requestedTarget

    const disabled = !connected || fault || fault_active || target_not_acquired

    const op = currentState === MachineState.OPERATION_ENABLED
    const loading = !op && desiredState === DesiredState.OPERATIONAL

    function enable() {
        setDesiredState(DesiredState.OPERATIONAL)
    }
    function disable() {
        setDesiredState(DesiredState.STANDBY)
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
