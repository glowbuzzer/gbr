/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { StatusTrayItem } from "./StatusTrayItem"
import {
    configMetadata,
    MachineState,
    possible_transitions,
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
    const config = useSafetyDigitalInputList()

    const fault = machine.currentState === MachineState.FAULT

    useEffect(() => {
        // if in fault state, we should reset the fault as soon as overall safety state is good
        if (overall && fault) {
            machine.setMachineControlWord(possible_transitions.FaultReset())
        }
    }, [overall, fault])

    if (!connected || overall) {
        return null
    }

    return (
        <StatusTrayItem id="safety-errors">
            <StyledGrid>
                {config
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
                    .map(({ item, index, meta }) => {
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
