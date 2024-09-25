/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { StatusTrayItem } from "./StatusTrayItem"
import {
    configMetadata,
    MachineMetadata,
    MachineState,
    MACHINETARGET,
    possible_transitions,
    useConfig,
    useConnection,
    useMachine,
    useOverallSafetyStateInput,
    useSafetyDigitalInputList,
    useSafetyDigitalInputs
} from "@glowbuzzer/store"
import styled from "styled-components"
import { Tag } from "antd"
import { useEffect } from "react"

const StyledGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 10px;

    .ant-tag {
        width: 100%;
        text-align: center;
    }
`

export const StatusTraySafetyErrors = () => {
    const machine = useMachine()
    const { connected } = useConnection()
    const overall = useOverallSafetyStateInput()
    const values = useSafetyDigitalInputs()
    const safety_dins = useSafetyDigitalInputList()
    const config = useConfig()
    const machine_meta = configMetadata(config.machine[0])

    // const fault = machine.currentState === MachineState.FAULT
    const sim = machine.requestedTarget === MACHINETARGET.MACHINETARGET_SIMULATION

    if (!connected || overall || sim) {
        return null
    }

    const filter: (keyof MachineMetadata)[] = [
        "faultTcpSwmInput",
        "faultJointsSlpInput",
        "faultJointsSlpInput",
        "faultPauseViolationInput",
        "drivesOverTempInput",
        "drivesErrorInput",
        "estopStateInput"
    ]

    const relevant_errors = safety_dins
        .map((item, index) => {
            const meta = configMetadata(item)
            return {
                // we need a stable index into the values array
                item,
                index,
                meta
            }
        })
        .filter(({ index, meta }) => {
            // only show items in the error state
            return values[index] === Boolean(meta.negativeState)
        })
        .filter(({ index }) => {
            return filter.some(name => machine_meta[name]?.index === index)
        })

    if (!relevant_errors.length) {
        return null
    }

    return (
        <StatusTrayItem id="safety-errors">
            <StyledGrid>
                {relevant_errors.map(({ item, index, meta }) => {
                    return (
                        <React.Fragment key={index}>
                            <div>{item.description}</div>
                            <div>
                                <Tag color="red">{meta[meta.negativeState]}</Tag>
                            </div>
                        </React.Fragment>
                    )
                })}
            </StyledGrid>
        </StatusTrayItem>
    )
}
