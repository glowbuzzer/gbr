/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React from "react"
import { MachineState, OPERATION_ERROR, useMachine } from "@glowbuzzer/store"
import { Tag } from "antd"

export const OperationErrorPanel = () => {
    const machine = useMachine()

    if (machine.operationError === OPERATION_ERROR.OPERATION_ERROR_NONE) {
        return null // no error
    }

    const in_fault = machine.currentState === MachineState.FAULT
    if (machine.operationError === OPERATION_ERROR.OPERATION_ERROR_HLC_HEARTBEAT_LOST) {
        if (in_fault) {
            // past fault
            return <Tag color="green">Connection established. Reset fault to continue</Tag>
        }
        return <Tag color="red">Failed to send heartbeat within timeout</Tag>
    }

    return <Tag color={in_fault ? "orange" : "red"}>{machine.operationErrorMessage}</Tag>
}
