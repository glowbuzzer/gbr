/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Button, Tag } from "antd"
import {
    MachineState,
    possible_transitions,
    useMachineControlWord,
    useMachineCurrentState
} from "@glowbuzzer/store"
import styled from "styled-components"
import { StyledTileContent } from "../util/styles/StyledTileContent"

const CurrentMachineState = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
`

const MachineTransitionsDiv = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
`

const MachineTransitions = ({ state }: { state: MachineState }) => {
    const [controlWord, setControlWord] = useMachineControlWord()

    const result = {}

    function add(...keys: string[]) {
        for (const key of keys) {
            result[key] = possible_transitions[key]
        }
    }

    switch (state) {
        case MachineState.NOT_READY_TO_SWITCH_ON:
            add("FaultSet")
            break
        case MachineState.FAULT_REACTION_ACTIVE:
            add("FaultClear")
            break
        case MachineState.FAULT:
            add("FaultReset")
            break
        case MachineState.SWITCH_ON_DISABLED:
            add("Shutdown", "FaultSet")
            break
        case MachineState.READY_TO_SWITCH_ON:
            add("DisableVoltage", "SwitchOn", "FaultSet")
            break
        case MachineState.SWITCHED_ON:
            add("Shutdown", "EnableOperation", "FaultSet")
            break
        case MachineState.OPERATION_ENABLED:
            add("SwitchOn", "QuickStop", "DisableVoltage", "FaultSet")
            break
        case MachineState.QUICK_STOP:
            add("DisableVoltage", "EnableOperation", "FaultSet")
            break
    }

    function updateControlWord(key: string) {
        setControlWord(possible_transitions[key](controlWord))
    }

    return (
        <MachineTransitionsDiv>
            {Object.keys(result).map(k => (
                <Button key={k} onClick={() => updateControlWord(k)}>
                    {k}
                </Button>
            ))}
        </MachineTransitionsDiv>
    )
}

/**
 * @ignore
 */
export const StateMachineToolsTile = () => {
    const currentMachineState = useMachineCurrentState()

    return (
        <StyledTileContent>
            <CurrentMachineState>
                <div>Current Machine State</div>
                <Tag
                    color={
                        currentMachineState === MachineState.OPERATION_ENABLED ? "green" : undefined
                    }
                >
                    {currentMachineState}
                </Tag>
            </CurrentMachineState>
            <MachineTransitions state={currentMachineState} />
        </StyledTileContent>
    )
}
