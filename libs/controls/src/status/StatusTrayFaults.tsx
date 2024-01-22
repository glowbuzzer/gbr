/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { MachineState, OPERATION_ERROR, useConnection, useMachine } from "@glowbuzzer/store"
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
`

/**
 * Status tray item for faults (active or not)
 */
export const StatusTrayFaults = () => {
    const machine = useMachine()
    const { connected } = useConnection()

    const fault = machine.currentState === MachineState.FAULT
    const fault_active = machine.currentState === MachineState.FAULT_REACTION_ACTIVE

    if (!connected) {
        return null
    }

    if (!fault && !fault_active) {
        return null
    }

    return (
        <StatusTrayItem
            id={"faults"}
            dismissable={fault_active ? DismissType.NOT_DISMISSIBLE : DismissType.REQUIRE_RESET}
        >
            <StyledDiv>
                <div>
                    {filter_fault_causes(machine.faultHistory).map(({ code, description }) => (
                        <Tag color="red" key={code}>
                            {description}
                        </Tag>
                    ))}
                </div>
                <div className="message">
                    {fault_active
                        ? "Fault currently active and cannot be reset. "
                        : "A fault occurred and must be reset. "}
                    {machine.operationError === OPERATION_ERROR.OPERATION_ERROR_HLC_HEARTBEAT_LOST
                        ? "Heartbeat lost"
                        : machine.operationErrorMessage}
                </div>
            </StyledDiv>
        </StatusTrayItem>
    )
}
