/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React, { useEffect, useState } from "react"
import { MachineState, OPERATION_ERROR, useConnection, useMachine } from "@glowbuzzer/store"
import { Alert } from "antd"

export const OperationErrorPanel = () => {
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
                <Alert
                    style={{ width: "100%" }}
                    type="warning"
                    message="There was an error sending heartbeat. Reset fault to continue"
                />
            )
        }
        return (
            <Alert
                style={{ width: "100%" }}
                type="error"
                message="Client failed to send heartbeat within timeout"
            />
        )
    }

    return (
        <Alert
            style={{ width: "100%" }}
            type={in_fault ? "warning" : "error"}
            message={machine.operationErrorMessage}
        />
    )
}
