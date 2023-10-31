/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React, { useEffect, useState } from "react"
import styled from "styled-components"
import {
    JOINT_MODEOFOPERATION,
    JOINT_TORQUE_MODE,
    JointCommand,
    MachineState,
    useConnection,
    useJointConfigurationList,
    useMachineState
} from "@glowbuzzer/store"
import { Button, Input, Radio, Space } from "antd"

const StyledDiv = styled.div`
    padding: 10px;

    .grid {
        display: grid;
        grid-template-columns: repeat(4, auto);
        grid-gap: 10px;

        .input {
            grid-column: span 2;
        }

        .disabled {
            opacity: 0.5;
        }
    }
    .ant-alert {
        text-align: center;
    }
`

type MODE_DESCRIPTIONS = { [key in JOINT_TORQUE_MODE]: string }
const mode_descriptions: MODE_DESCRIPTIONS = {
    [JOINT_TORQUE_MODE.JOINT_TORQUE_MODE_DEFAULT]: "Default",
    [JOINT_TORQUE_MODE.JOINT_TORQUE_MODE_GRAVITY]: "Zero-G",
    [JOINT_TORQUE_MODE.JOINT_TORQUE_MODE_DIRECT]: "Direct"
}

const JointTorqueModeForJoint = ({ index, zerog }: { index: number; zerog: boolean }) => {
    const connection = useConnection()
    const config = useJointConfigurationList()[index]
    const state = useMachineState()
    const [mode, setMode] = useState<JOINT_TORQUE_MODE>(JOINT_TORQUE_MODE.JOINT_TORQUE_MODE_DEFAULT)
    const [torque, setTorque] = useState("0")

    useEffect(() => {
        // if config or state changes we need to revert to defaults
        setMode(JOINT_TORQUE_MODE.JOINT_TORQUE_MODE_DEFAULT)
    }, [config, state, zerog])

    function update_mode(mode: JOINT_TORQUE_MODE) {
        setMode(mode)
        if (connection.connected) {
            connection.send(
                JSON.stringify({
                    command: {
                        joint: {
                            [index]: {
                                command: {
                                    torqueMode: mode
                                } as JointCommand
                            }
                        }
                    }
                })
            )
        }
    }

    function update_torque() {
        const value = parseFloat(torque)
        if (connection.connected) {
            connection.send(
                JSON.stringify({
                    command: {
                        joint: {
                            [index]: {
                                command: {
                                    setTorque: value
                                } as JointCommand
                            }
                        }
                    }
                })
            )
        }
    }

    const zero_g_supported =
        config.supportedTorqueModes & JOINT_TORQUE_MODE.JOINT_TORQUE_MODE_GRAVITY

    return (
        <React.Fragment key={index}>
            <div>{config.name}</div>
            {Object.entries(mode_descriptions).map(([modeString, description]) => {
                const mode_option = parseInt(modeString) as JOINT_TORQUE_MODE
                const disabled =
                    zerog ||
                    (mode_option !== JOINT_TORQUE_MODE.JOINT_TORQUE_MODE_DEFAULT &&
                        !(config.supportedTorqueModes & mode_option)) ||
                    !connection.connected ||
                    state !== MachineState.OPERATION_ENABLED ||
                    !(config.supportedModes & JOINT_MODEOFOPERATION.JOINT_MODEOFOPERATION_CST)
                return (
                    <React.Fragment key={mode_option}>
                        <div>
                            <Radio
                                disabled={disabled}
                                onClick={() => update_mode(mode_option)}
                                checked={
                                    zerog && zero_g_supported
                                        ? mode_option ===
                                          JOINT_TORQUE_MODE.JOINT_TORQUE_MODE_GRAVITY
                                        : mode_option === mode
                                }
                            />{" "}
                            <span className={disabled ? "disabled" : undefined}>{description}</span>
                        </div>
                    </React.Fragment>
                )
            })}
            {mode === JOINT_TORQUE_MODE.JOINT_TORQUE_MODE_DIRECT && (
                <>
                    <div />
                    <div className="input">
                        <Input
                            size="small"
                            value={torque}
                            onChange={e => setTorque(e.target.value)}
                        />
                    </div>
                    <Button size="small" disabled={Number.isNaN(torque)} onClick={update_torque}>
                        Set
                    </Button>
                </>
            )}
        </React.Fragment>
    )
}

/**
 * @ignore - this is for development purposes only
 */
export const JointTorqueModesTile = () => {
    const connection = useConnection()
    const state = useMachineState()
    const jointConfigs = useJointConfigurationList()
    const [zerog, setZerog] = useState(false)

    const disabled = !connection.connected || state !== MachineState.OPERATION_ENABLED

    function toggle_zerog() {
        setZerog(!zerog)
        connection.send(
            JSON.stringify({
                command: {
                    joint: Object.fromEntries(
                        jointConfigs.map((config, index) => {
                            const zero_g_supported =
                                config.supportedTorqueModes &
                                JOINT_TORQUE_MODE.JOINT_TORQUE_MODE_GRAVITY

                            return [
                                index,
                                {
                                    command: {
                                        torqueMode:
                                            zerog && zero_g_supported
                                                ? JOINT_TORQUE_MODE.JOINT_TORQUE_MODE_GRAVITY
                                                : JOINT_TORQUE_MODE.JOINT_TORQUE_MODE_DEFAULT
                                    } as JointCommand
                                }
                            ]
                        })
                    )
                }
            })
        )
    }

    return (
        <StyledDiv>
            <Space direction="vertical">
                <Button size="small" disabled={disabled} onClick={toggle_zerog}>
                    {zerog ? "Exit Zero-G Mode" : "Enter Zero-G Mode"}
                </Button>
                <div className="grid">
                    {jointConfigs.map((_config, index) => (
                        <JointTorqueModeForJoint key={index} index={index} zerog={zerog} />
                    ))}
                </div>
            </Space>
        </StyledDiv>
    )
}
