/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Radio } from "antd"
import React, { useEffect, useMemo, useState } from "react"
import { useLocalStorage } from "../util/LocalStorageHook"
import {
    JOINT_TYPE,
    LIMITPROFILE,
    MoveJointsBuilder,
    MoveParametersConfig,
    useJointConfig,
    useJointPositions,
    useKinematicsConfiguration,
    usePreview,
    useSoloActivity
} from "@glowbuzzer/store"
import { JogTileItem, StyledJogDiv } from "./util"
import { JogGotoInputPanel, JogGotoItem } from "./JogGotoInputPanel"
import { WaypointsJoints } from "./WaypointsJoints"
import { KinematicsConfigurationSelector } from "../misc/KinematicsConfigurationSelector"

enum Mode {
    POSITION,
    WAYPOINT
}

const Tab = ({ mode, value, children }) => (
    <div className={"tab" + (value === mode ? " selected" : "")}>{children}</div>
)

/** @ignore - internal to the jog tile */
export const JogGotoJoint = ({
    kinematicsConfigurationIndex,
    onChangeKinematicsConfigurationIndex,
    jogSpeed
}) => {
    const [mode, setMode] = useState(Mode.POSITION)

    const [positions, setPositions] = useLocalStorage(
        `jog.joints.${kinematicsConfigurationIndex}`,
        []
    )

    const jointConfig = useJointConfig()
    const kcConfig = useKinematicsConfiguration(kinematicsConfigurationIndex)
    const jointItems = useMemo<JogGotoItem[]>(
        () =>
            kcConfig.participatingJoints.map((physicalJointIndex, index) => {
                const j = jointConfig[physicalJointIndex]
                return {
                    type: j.jointType === JOINT_TYPE.JOINT_REVOLUTE ? "angular" : "linear",
                    title: j.name,
                    key: index
                }
            }),
        [jointConfig, kcConfig.participatingJoints]
    )

    const motion = useSoloActivity(kinematicsConfigurationIndex)

    // we need the joints, both for the joint count and for current positions
    const joints = useJointPositions(kinematicsConfigurationIndex)

    useEffect(() => {
        // ensure there are enough positions
        if (positions.length !== joints.length) {
            setPositions(current => joints.map((j, i) => current[i] || 0))
        }
    }, [setPositions, positions, joints])

    const preview = usePreview()

    const move_params: MoveParametersConfig = {
        vmaxPercentage: jogSpeed,
        amaxPercentage: jogSpeed,
        jmaxPercentage: jogSpeed,
        limitConfigurationIndex: LIMITPROFILE.LIMITPROFILE_JOGGING
    }

    function goto(move: MoveJointsBuilder) {
        preview.disable()
        move.params(move_params).promise().finally(preview.enable)
    }

    const goto_joint = (index, value) =>
        goto(motion.moveJoints(joints.map((j, i) => (index === i ? value : j))))

    const goto_all = values => goto(motion.moveJoints(Object.values(values)))

    function goto_waypoint(w) {
        preview.disable()
        return motion.moveJoints(w).params(move_params).promise().finally(preview.enable)
    }

    return (
        <StyledJogDiv>
            <JogTileItem>
                <div>
                    Kinematics:{" "}
                    <KinematicsConfigurationSelector
                        onChange={onChangeKinematicsConfigurationIndex}
                        value={kinematicsConfigurationIndex}
                    />
                </div>
                <Radio.Group value={mode} onChange={e => setMode(e.target.value)} size="small">
                    <Radio.Button value={Mode.POSITION}>Position</Radio.Button>
                    <Radio.Button value={Mode.WAYPOINT}>Waypoint</Radio.Button>
                </Radio.Group>
            </JogTileItem>
            <div>
                <Tab value={Mode.POSITION} mode={mode}>
                    <JogGotoInputPanel
                        localStorageKey={"jog.joint"}
                        items={jointItems}
                        onGoto={goto_joint}
                        onGotoAll={goto_all}
                    />
                </Tab>
                <Tab value={Mode.WAYPOINT} mode={mode}>
                    <WaypointsJoints
                        kinematicsConfigurationIndex={kinematicsConfigurationIndex}
                        onSelect={goto_waypoint}
                    />
                </Tab>
            </div>
        </StyledJogDiv>
    )
}
