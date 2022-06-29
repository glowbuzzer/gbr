/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Tile } from "../tiles"
import { Button, Tag } from "antd"
import {
    determine_machine_state,
    MachineState,
    possible_transitions,
    useMachine
} from "@glowbuzzer/store"
import styled from "styled-components"

const help = (
    <div>
        <h4>StateMachine Tools Tile</h4>
        <p>The StateMachine Tools Tile allows the user to interact with the statemachine that exists on the PLC (GBEM/GBSM).</p>
        <p>It is not usually necessary to use this tile but it is useful for development where you want to</p>
        <p>force the statemachine into a specfic state.</p>
        <p>Usually you can use the Connect Tile's "Disabled" and "Enabled"</p>
        <p>buttons to jump from <code>SWITCH_ON_DISABLED</code> to <code>OPERATION_ENABLED</code>.</p>
    </div>
)


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
    const machine = useMachine()

    if (!machine) {
        throw new Error("Invalidate state - no machine")
    }

    const result = {}

    function add(...keys) {
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

    function updateControlWord(key) {
        machine.setMachineControlWord(possible_transitions[key](machine.controlWord))
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
    // const devtools = useDevTools()
    const machine = useMachine()

    const currentMachineState = determine_machine_state(machine.statusWord)

    /*
    const [frequency, setFrequency] = useState(devtools.statusFrequency)

    useEffect(() => {
        setFrequency(devtools.statusFrequency)
    }, [devtools.statusFrequency])

    function send_frequency(v) {
        devtools.setStatusFrequency(v)
    }
*/

    return (
        <Tile title={"State Machine Tools"} help={help}>
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
        </Tile>
    )
}
