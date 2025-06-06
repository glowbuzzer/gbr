/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import {
    FAULT_CAUSE,
    MachineState,
    OPERATION_ERROR,
    useConnection,
    useMachineCurrentState,
    useMachineFaults,
    useOverallSafetyStateInput
} from "@glowbuzzer/store"
import { StatusTrayItem } from "./StatusTrayItem"
import { DismissType } from "./StatusTrayProvider"
import { filter_fault_causes } from "../util/faults"
import { Tag } from "antd"
import * as React from "react"
import styled from "styled-components"

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;

    .message {
        margin-left: 4px;
    }

    .errors {
        display: flex;
        flex-wrap: wrap;
        align-items: center;

        .error-message {
            font-weight: bold;
            color: ${props => props.theme.colorErrorText};
            padding: 6px 0;
        }
    }
`

function only_safety_error(fault: number) {
    const mask = 1 << FAULT_CAUSE.FAULT_CAUSE_SAFETY_BIT_NUM
    return (fault & mask) === mask
}

/**
 * Status tray item for faults (active or not)
 */
export const StatusTrayFaults = () => {
    const currentState = useMachineCurrentState()
    const { activeFault, faultHistory, operationError, operationErrorMessage } = useMachineFaults()
    const { connected } = useConnection()
    const overall = useOverallSafetyStateInput()
    const safety_enabled = overall !== undefined

    const fault = currentState === MachineState.FAULT
    const fault_active = currentState === MachineState.FAULT_REACTION_ACTIVE

    if (!connected) {
        return null
    }

    if (!fault && !fault_active) {
        return null
    }

    // the safety dedicated status tray item will take care of pure safety faults
    if (!fault_active && safety_enabled && only_safety_error(faultHistory)) {
        return null
    }
    if (fault_active && safety_enabled && only_safety_error(activeFault)) {
        return
    }

    const show_error = !!activeFault || !!faultHistory || !!operationError

    return (
        <StatusTrayItem
            id={"faults"}
            dismissable={fault_active ? DismissType.NOT_DISMISSIBLE : DismissType.REQUIRE_RESET}
        >
            <StyledDiv>
                {show_error && (
                    <div className="errors">
                        {filter_fault_causes(faultHistory).map(({ code, description }) => (
                            <Tag color="red" key={code}>
                                {description}
                            </Tag>
                        ))}
                        <div className="error-message">
                            {operationError === OPERATION_ERROR.OPERATION_ERROR_HLC_HEARTBEAT_LOST
                                ? "Heartbeat lost"
                                : operationErrorMessage}
                        </div>
                    </div>
                )}
                <div className="message">
                    {fault_active
                        ? "Fault currently active, automatic reset attempted, manual intervention may be required (e.g. safety reset)"
                        : "A fault occurred and must be reset"}
                </div>
            </StyledDiv>
        </StatusTrayItem>
    )
}
