import * as React from "react"
import { StatusTrayItem } from "../status/StatusTrayItem"
import styled from "styled-components"
import {
    DesiredState,
    JOINT_TORQUE_MODE,
    JointCommand,
    MachineState,
    useConnection,
    useMachine,
    useMachineState,
    useSafetyDigitalInputs
} from "@glowbuzzer/store"
import { Button, Space, Steps } from "antd"
import { useHandGuidedMode } from "./hooks"
import { useEffect } from "react"
import { useJointsForKinematicsConfigurationList } from "../util/hooks"

const StyledDiv = styled.div`
    height: 400px;
`

/**
 * This component displays when hand guided mode is requested and takes the operator
 * through the steps to enter hand guided mode. It also detects wheen all these steps
 * are complete and commands CST mode to the joints in the kinematics configuration.
 *
 * Hand guided mode is exited when the deadman is released or the keyswitch is deactivated.
 * When this happens, GBC leaves OP enabled, and will reset to CSP mode on all joints.
 */
export const StatusTrayHandGuidedMode = () => {
    const state = useMachineState()
    const { setDesiredState } = useMachine()
    const joints = useJointsForKinematicsConfigurationList(0)
    const connection = useConnection()

    const {
        handGuidedModeSupported,
        handGuidedModeActive,
        overallSafetyState,
        handGuidedModeRequested,
        deadmanEngaged
    } = useHandGuidedMode()

    useEffect(() => {
        if (handGuidedModeActive) {
            // put all the joints into CST mode
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
                                            torqueMode: zero_g_supported
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
    }, [handGuidedModeActive])

    if (!handGuidedModeSupported || !handGuidedModeRequested || handGuidedModeActive) {
        // either hand guided mode not supported, requested, or we've gone through all the steps to get to OP enabled
        return null
    }

    return (
        <StatusTrayItem id="teach">
            <StyledDiv>
                <Steps direction="vertical">
                    <Steps.Step
                        title={"Hand Guided Mode Requested"}
                        description="The hand guided mode has been activated"
                        status="finish"
                    />
                    <Steps.Step
                        title={"Operate Deadman Switch"}
                        description="You must operate the deadman switch before entering hand guided mode"
                        status={deadmanEngaged ? "finish" : "process"}
                    />
                    <Steps.Step
                        title={"Press Hardware Reset Button"}
                        description="You must press the reset button to acknowledge the safety errors"
                        status={overallSafetyState ? "finish" : deadmanEngaged ? "process" : "wait"}
                    />
                    <Steps.Step
                        title={"Press Software Reset Button"}
                        description="You must click the reset button below to exit the fault state"
                        status={
                            state === MachineState.FAULT
                                ? overallSafetyState
                                    ? "process"
                                    : "wait"
                                : "finish"
                        }
                    />
                    <Steps.Step
                        title={"Enable Operation"}
                        description={
                            <Space>
                                You are ready to enter hand guided mode 🎉
                                <Button
                                    size="small"
                                    disabled={state !== MachineState.SWITCH_ON_DISABLED}
                                    onClick={() => setDesiredState(DesiredState.OPERATIONAL)}
                                >
                                    Enable
                                </Button>
                            </Space>
                        }
                        status={
                            handGuidedModeActive
                                ? "finish"
                                : state === MachineState.FAULT
                                ? "wait"
                                : "process"
                        }
                    />
                </Steps>
            </StyledDiv>
        </StatusTrayItem>
    )
}
