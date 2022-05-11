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
        <Tile title="State Machine Tools">
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
