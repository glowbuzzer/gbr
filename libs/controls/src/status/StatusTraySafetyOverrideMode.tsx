/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { StatusTrayItem } from "./StatusTrayItem"
import styled from "styled-components"
import {
    useJointPositions,
    useSafetyOverrideEnabledInput,
    useSoloActivity
} from "@glowbuzzer/store"
import { Button } from "antd"

const StyledDiv = styled.div`
    text-align: center;

    header {
        margin: 20px;
        color: ${props => props.theme.colorErrorText};
        font-size: 2em;
    }
`

export const StatusTraySafetyOverrideMode = () => {
    // TODO: H: this feels quite robot/IBT specific, should it be in awlib?

    const enabled = useSafetyOverrideEnabledInput()
    const solo = useSoloActivity(0)
    const joints = useJointPositions(0)

    function zero() {
        const values = joints.map(() => 0)
        return solo.moveJoints(values).promise()
    }

    if (!enabled) {
        return null
    }

    return (
        <StatusTrayItem id={"safety-override-mode"}>
            <StyledDiv>
                <header>Safety Override Active</header>
                <p>
                    In this mode the robot will not stop for safety reasons. Use with caution!
                    <br /> This mode is intended for resetting the safety encoder positions in
                    certain scenarios.
                </p>
                <p>Click the button below to move all joints to their zero positions.</p>
                <p>
                    <Button onClick={zero} size={"large"}>
                        MOVE TO ZERO POSITION
                    </Button>
                </p>
                <p>
                    Once the move has completed, check that the physical robot is in the correct
                    position, then ????.
                </p>
            </StyledDiv>
        </StatusTrayItem>
    )
}
