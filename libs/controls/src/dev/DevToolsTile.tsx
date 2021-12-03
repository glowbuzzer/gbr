import * as React from "react"
import { useEffect, useState } from "react"
import { Tile } from "@glowbuzzer/layout"
import { Button, Slider, Tag } from "antd"
import {
    determine_machine_state,
    MachineState,
    possible_transitions,
    useDevTools,
    useMachine
} from "@glowbuzzer/store"
import styled from "styled-components"

const StatusFreqTable = styled.div`
    display: flex;
    gap: 30px;
    align-items: center;
    .ant-slider {
        flex-grow: 1;
        margin: 10px 20px;
    }
`

const CurrentMachineState = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
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

    const result: any = {}

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

export const DevToolsTile = () => {
    const devtools = useDevTools()
    const machine = useMachine()

    const currentMachineState = determine_machine_state(machine.statusWord)

    const [frequency, setFrequency] = useState(devtools.statusFrequency)

    useEffect(() => {
        setFrequency(devtools.statusFrequency)
    }, [devtools.statusFrequency])

    function send_frequency(v) {
        devtools.setStatusFrequency(v)
    }

    return (
        <Tile title="Developer Tools">
            <StatusFreqTable>
                <div>Status Frequency</div>
                <Slider
                    tipFormatter={null}
                    value={frequency}
                    onChange={setFrequency}
                    onAfterChange={send_frequency}
                    min={0}
                    max={100}
                    step={25}
                    marks={{
                        0: "Slow (10s)",
                        50: "Medium",
                        100: "Fast (1/10s)"
                    }}
                />
            </StatusFreqTable>
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
