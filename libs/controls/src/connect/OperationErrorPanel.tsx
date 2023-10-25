/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React, { useEffect, useState } from "react"
import { MachineState, OPERATION_ERROR, useConnection, useMachine } from "@glowbuzzer/store"
import { Tag } from "antd"

export const OperationErrorPanel = ({ onAutoReset }) => {
    const machine = useMachine()

    if (machine.operationError === OPERATION_ERROR.OPERATION_ERROR_NONE) {
        return null // no error
    }

    if (
        machine.currentState !== MachineState.FAULT &&
        machine.currentState !== MachineState.FAULT_REACTION_ACTIVE
    ) {
        return null // not in fault / fault reaction active
    }

    const in_fault = machine.currentState === MachineState.FAULT
    if (machine.operationError === OPERATION_ERROR.OPERATION_ERROR_HLC_HEARTBEAT_LOST) {
        if (in_fault) {
            // past fault
            return (
                <Tag color="orange">
                    There was an error sending heartbeat. Reset fault to continue
                </Tag>
            )
        }
        return <Tag color="red">Client failed to send heartbeat within timeout</Tag>
    }

    return <Tag color={in_fault ? "orange" : "red"}>{machine.operationErrorMessage}</Tag>
}
