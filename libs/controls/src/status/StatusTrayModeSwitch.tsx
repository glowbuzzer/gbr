/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useEffect } from "react"
import { StatusTrayItem } from "./StatusTrayItem"
import styled from "styled-components"
import {
    JOINT_TORQUE_MODE,
    JointCommand,
    MachineState,
    ManualMode,
    useConnection,
    useEnablingSwitchInput,
    useMachineState,
    useResetNeededInput
} from "@glowbuzzer/store"
import { Steps } from "antd"
import { useJointsForKinematicsConfigurationList } from "../util"
import { useGlowbuzzerMode } from "../modes"

const StyledDiv = styled.div`
    //height: 400px;
`

export const StatusTrayModeSwitch = () => {
    const { mode, modes } = useGlowbuzzerMode()
    const state = useMachineState()
    const joints = useJointsForKinematicsConfigurationList(0)
    const connection = useConnection()
    const resetNeeded = useResetNeededInput()
    const enablingSwitchEngaged = useEnablingSwitchInput()

    const cst_mode =
        mode === ManualMode.HAND_GUIDED &&
        [MachineState.OPERATION_ENABLED, MachineState.QUICK_STOP].includes(state)

    useEffect(() => {
        // put all the joints into correct mode
        connection.send(
            JSON.stringify({
                command: {
                    joint: Object.fromEntries(
                        joints.map(joint => {
                            const zero_g_supported =
                                joint.config.supportedTorqueModes &
                                JOINT_TORQUE_MODE.JOINT_TORQUE_MODE_GRAVITY

                            return [
                                joint.index,
                                {
                                    command: {
                                        torqueMode:
                                            zero_g_supported && cst_mode
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
    }, [cst_mode])

    if (mode === ManualMode.DISABLED || modes.length === 0) {
        // we're not in any mode, or there are no modes
        return null
    }

    const { name } = modes.find(m => m.value === mode)

    const action_required = resetNeeded || !enablingSwitchEngaged
    if (!action_required) {
        return null
    }

    return (
        <StatusTrayItem id="teach">
            <StyledDiv>
                <Steps direction="vertical">
                    <Steps.Step
                        title={`${name} Mode Requested`}
                        description={`The ${name.toLowerCase()} mode has been activated`}
                        status="finish"
                    />
                    <Steps.Step
                        title={"Press Hardware Reset Button"}
                        description="You must press the reset button to acknowledge the safety errors"
                        status={resetNeeded ? "process" : "finish"}
                    />
                    <Steps.Step
                        title={"Operate Enabling Switch"}
                        description="You must operate the enablng switch (deadman) to enable hand guiding"
                        status={resetNeeded ? "wait" : enablingSwitchEngaged ? "finish" : "process"}
                    />
                </Steps>
            </StyledDiv>
        </StatusTrayItem>
    )
}
