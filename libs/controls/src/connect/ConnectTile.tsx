/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Button, Radio, RadioChangeEvent, Tag } from "antd"
import {
    ConnectionState,
    DesiredState,
    MachineState,
    MACHINETARGET,
    possible_transitions,
    useConnection,
    useEstopInput,
    useMachineControlWord,
    useMachineCurrentState,
    useMachineDesiredState,
    useMachineTargetAcquired,
    useMachineTargetState,
    useSimulationOnlyConfiguration
} from "@glowbuzzer/store"
import styled from "styled-components"

const StyledDiv = styled.div`
    padding: 5px;

    .row {
        &.padded {
            padding: 12px 0;
        }

        padding: 2px 0;
        display: flex;
        justify-content: stretch;
        gap: 20px;
        align-items: center;

        .label {
            flex-grow: 1;
        }

        .estop {
            display: inline-block;
            padding: 2px 8px;
            margin: 0 12px;
            color: ${props => props.theme.colorErrorText};
            border: 1px dashed ${props => props.theme.colorErrorText};
            border-radius: 5px;
        }

        .ant-radio-group {
            display: flex;
            justify-content: stretch;

            .ant-radio-button-wrapper {
                flex-grow: 1;
                flex-basis: 0;
                text-align: center;
            }

            .ant-radio-button-wrapper:first-child {
                border-radius: 10px 0 0 10px;
            }

            .ant-radio-button-wrapper:last-child {
                border-radius: 0 10px 10px 0;
            }
        }

        .controls {
            min-width: 180px;
            display: flex;
            justify-content: space-between;
            gap: 6px;
            align-items: center;

            .ant-tag {
                text-align: center;
                flex-grow: 1;
                margin-inline-end: 0;
            }
            .ant-btn,
            .ant-radio-group {
                flex-grow: 1;
            }
        }
    }

    .machine-message {
        display: flex;
        .ant-tag {
            flex-grow: 1;
            text-align: center;
            white-space: inherit;
            padding: 10px;
            font-size: 1em;
        }

        padding-top: 10px;
        text-align: center;
    }
`

/**
 * @ignore
 * The connect tile allows you to connect and disconnect from a running GBC, and interact with the basic state of the machine.
 *
 * To change the connection url, use the settings cog in the top right of the tile. Once connected you can switch
 * between simulation and live running, and enable or disable operation.
 */
export const ConnectTile = () => {
    const connection = useConnection()
    const estopActive = useEstopInput()
    const simulationOnly = useSimulationOnlyConfiguration()
    const state = useMachineCurrentState()
    const [, setDesiredState] = useMachineDesiredState()
    const [, setMachineControlWord] = useMachineControlWord()
    const targetAcquired = useMachineTargetAcquired()
    const [currentTarget, , setDesiredMachineTarget] = useMachineTargetState()

    function change_target(e: RadioChangeEvent) {
        setDesiredMachineTarget(e.target.value)
    }

    function change_desired_state(e: RadioChangeEvent) {
        setDesiredState(e.target.value)
    }

    const connected = connection.connected && connection.statusReceived
    const fault = state === MachineState.FAULT
    const fault_active = state === MachineState.FAULT_REACTION_ACTIVE
    const op = state === MachineState.OPERATION_ENABLED

    function issue_reset() {
        setMachineControlWord(possible_transitions.FaultReset())
    }

    const no_change_operation_mode = !connected || fault || fault_active || !targetAcquired

    return (
        <StyledDiv>
            <div className="row">
                <div className="label">Change Mode {simulationOnly && <Tag>SIM ONLY</Tag>}</div>
                <div className="controls">
                    <Radio.Group
                        disabled={connection.state !== ConnectionState.CONNECTED}
                        size={"small"}
                        value={currentTarget}
                        onChange={change_target}
                    >
                        <Radio.Button value={MACHINETARGET.MACHINETARGET_SIMULATION}>
                            Simulate
                        </Radio.Button>
                        <Radio.Button
                            disabled={simulationOnly}
                            className="danger"
                            value={MACHINETARGET.MACHINETARGET_FIELDBUS}
                        >
                            Live
                        </Radio.Button>
                    </Radio.Group>
                </div>
            </div>
            <div className="row">
                <div className="label">
                    Machine Operation
                    {estopActive && <span className="estop">SAFETY</span>}
                </div>
                <div className="controls">
                    <Radio.Group
                        disabled={no_change_operation_mode}
                        size={"small"}
                        value={
                            state === MachineState.OPERATION_ENABLED
                                ? DesiredState.OPERATIONAL
                                : DesiredState.STANDBY
                        }
                        onChange={change_desired_state}
                    >
                        <Radio.Button value={DesiredState.STANDBY}>Disabled</Radio.Button>
                        <Radio.Button
                            className="danger"
                            value={DesiredState.OPERATIONAL}
                            disabled={no_change_operation_mode || estopActive}
                        >
                            Enabled
                        </Radio.Button>
                    </Radio.Group>
                </div>
            </div>
            <div className="row">
                <div className="label">Current State</div>
                <div className="controls">
                    <Tag color={fault || fault_active ? "red" : op ? "green" : undefined}>
                        {connected ? MachineState[state] || "Unknown" : "None"}
                    </Tag>
                    {connected && fault && (
                        <div className="reset-button">
                            <Button size="small" onClick={issue_reset}>
                                Reset
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </StyledDiv>
    )
}
