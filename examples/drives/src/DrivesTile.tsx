/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React from "react"
import { BitFieldDisplay, MotorVisualization, SegmentDisplay } from "@glowbuzzer/controls"
import styled from "styled-components"
import { StyledTileContent } from "../../../libs/controls/src/util/styles/StyledTileContent"
import {
    JOINT_TYPE,
    useJoint,
    useJointConfigurationList,
    useJointPositions,
    usePrefs
} from "@glowbuzzer/store"
import { useJointsForKinematicsConfiguration } from "../../../libs/controls/src/util/hooks"
import { MathUtils } from "three"
import { useRawJointPositions } from "../../../libs/store/src/joints"
import { DriveConfigEditor } from "./config/DriveConfigEditor"
import { Button } from "antd"

const StyledDiv = styled.div`
    display: flex;
    justify-content: space-around;
    height: 100%;
    padding-bottom: 10px;

    .motor {
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        height: 100%;
        //background: rgba(255, 0, 0, 0.1);
    }

    .dro {
        display: flex;
        gap: 4px;
    }

    .status-word {
        display: flex;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        justify-content: space-around;
    }

    .ace-wrapper {
        margin: 10px;
        flex-grow: 1;
        background: pink;
    }
`

const DriveControl = ({ index }) => {
    const joint = useJoint(0)
    return (
        <div>
            {joint.controlWord} / {joint.statusWord}
        </div>
    )
}

const DriveItem = ({ index }) => {
    const joints = useJointConfigurationList()
    const jointConfig = joints[index]
    const prefs = usePrefs()
    const { jointType, negLimit, posLimit } = jointConfig
    const type = jointConfig.jointType === JOINT_TYPE.JOINT_REVOLUTE ? "angular" : "linear"
    const positions = useRawJointPositions()
    const jointStatus = useJoint(index)

    const units = prefs.getUnits(type)
    const min = prefs.fromSI(MathUtils.degToRad(negLimit), type)
    const max = prefs.fromSI(MathUtils.degToRad(posLimit), type)
    const current = prefs.fromSI(positions[index], type)

    return (
        <div key={index} className="motor">
            <MotorVisualization width={250} value={positions[index] || 0} />
            <div className="dro">
                <SegmentDisplay value={current} toFixed={4} width={12} />
                {units}
            </div>

            <div className="status-word">
                <BitFieldDisplay
                    bitCount={8}
                    value={jointStatus.statusWord}
                    labels={["fault", "power", "enable", "homing", "moving", "target"]}
                />
            </div>
            {/*
            <DriveControl index={index} />
*/}

            <div className="ace-wrapper">
                <DriveConfigEditor index={index} />
            </div>
            <Button size="small">Set</Button>
        </div>
    )
}

export const DrivesTile = () => {
    const joints = useJointsForKinematicsConfiguration(0)

    return (
        <StyledDiv>
            {joints.map((j, index) => {
                return <DriveItem key={index} index={index} />
            })}
        </StyledDiv>
    )
}
