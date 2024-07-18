/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { StatusTrayItem } from "../StatusTrayItem"
import styled from "styled-components"
import {
    useDrivesSafePositionReset,
    useEnablingSwitchInput,
    useJointPositions,
    useResetNeededInput,
    useSafetyOverrideEnabledInput,
    useSafetyOverrideProcessesRequired,
    useSoloActivity
} from "@glowbuzzer/store"
import { Button, Steps } from "antd"

const StyledDiv = styled.div`
    header {
        margin: 10px 0;
        color: ${props => props.theme.colorErrorText};
        font-size: 2em;
    }

    .ant-steps-item.hidden {
        display: none;
    }
`

enum ProcessSteps {
    ENGAGE_OVERRIDE,
    PRESS_RESET,
    OPERATE_ENABLING_SWITCH,
    MOVE_TO_ZERO,
    PERFORM_VISUAL_CHECK,
    DISENGAGE_OVERRIDE,
    PRESS_RESET2
}

export const SafetyOverrideModePanel = () => {
    const safetyOverrideEnabled = useSafetyOverrideEnabledInput()
    const resetNeeded = useResetNeededInput()
    const joints = useJointPositions(0)
    const solo = useSoloActivity(0)
    const resetDrivesSafePosition = useDrivesSafePositionReset()
    const enablingSwitch = useEnablingSwitchInput()
    const { drivesSafePositionValidInput, faultTcpSwmInput, faultJointsSlpInput } =
        useSafetyOverrideProcessesRequired()

    const all_joints_zero = joints.every(joint => Math.abs(joint) < 0.0001)

    function title() {
        if (!drivesSafePositionValidInput) {
            return "Drives Safe Position not valid"
        }
        if (!faultTcpSwmInput) {
            return "Tool safe workspace management fault"
        }
        if (!faultJointsSlpInput) {
            return "Joints safe position fault"
        }
    }

    function step_num() {
        if (!all_joints_zero && !safetyOverrideEnabled) {
            return ProcessSteps.ENGAGE_OVERRIDE
        } else if (!all_joints_zero && resetNeeded) {
            return ProcessSteps.PRESS_RESET
        } else if (!enablingSwitch) {
            return ProcessSteps.OPERATE_ENABLING_SWITCH
        } else if (!all_joints_zero) {
            return ProcessSteps.MOVE_TO_ZERO
        } else if (!drivesSafePositionValidInput) {
            return ProcessSteps.PERFORM_VISUAL_CHECK
        } else if (safetyOverrideEnabled) {
            return ProcessSteps.DISENGAGE_OVERRIDE
        } else {
            return ProcessSteps.PRESS_RESET2
        }
    }

    function move_zero() {
        const positions = joints.map(() => 0)
        return solo.moveJoints(positions).promise()
    }

    function ack_safety_reset() {
        resetDrivesSafePosition(true)
    }

    const current = step_num()
    console.log("current", current)

    return (
        <StatusTrayItem id="override-mode">
            <StyledDiv>
                <header>{title()}</header>
                <Steps direction="vertical" current={current}>
                    <Steps.Step
                        title="Engage safety override switch"
                        description="You must engage the physical safety override switch to disable all safety functions before resetting the drives"
                    />
                    <Steps.Step
                        title={"Press Hardware Reset Button"}
                        description="You must press the reset button to acknowledge the safety errors"
                    />
                    <Steps.Step
                        title={"Operate Enabling Switch"}
                        description="You must operate the enablng switch (deadman) to move the robot"
                    />
                    <Steps.Step
                        title="Move robot to zero position"
                        description={
                            <>
                                <p>
                                    Click the button below to move all joints to their zero
                                    positions.
                                </p>
                                <Button
                                    onClick={move_zero}
                                    size="small"
                                    disabled={current !== ProcessSteps.MOVE_TO_ZERO}
                                >
                                    MOVE TO ZERO POSITION
                                </Button>
                            </>
                        }
                    />
                    <Steps.Step
                        title="Perform visual check"
                        className={drivesSafePositionValidInput ? "hidden" : ""}
                        description={
                            <>
                                <p>
                                    Click the button below to confirm robot is in the correct zero
                                    position.
                                </p>
                                <Button
                                    onClick={ack_safety_reset}
                                    size="small"
                                    disabled={current !== ProcessSteps.PERFORM_VISUAL_CHECK}
                                >
                                    CONFIRM ROBOT POSITION
                                </Button>
                            </>
                        }
                    />
                    <Steps.Step
                        title="Disengage safety override switch"
                        description="Disengage the safety override switch to re-enable safety functions."
                    />
                    {(!faultJointsSlpInput || !faultTcpSwmInput) && (
                        <Steps.Step
                            active={current === ProcessSteps.PRESS_RESET2}
                            title={"Press Hardware Reset Button"}
                            description="You must press the reset button again to acknowledge the safety errors"
                        />
                    )}
                </Steps>
            </StyledDiv>
        </StatusTrayItem>
    )
}
