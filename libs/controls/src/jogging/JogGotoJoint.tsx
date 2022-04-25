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
    usePreview,
    useSoloActivity
} from "@glowbuzzer/store"
import { StyledJogDiv } from "./StyledJogDiv"
import { JogGotoInputPanel, JogGotoItem } from "./JogGotoInputPanel"
import { WaypointsJoints } from "./Waypoints"

enum Mode {
    POSITION,
    WAYPOINT
}

const Tab = ({ mode, value, children }) => (
    <div className={"tab" + (value === mode ? " selected" : "")}>{children}</div>
)

export const JogGotoJoint = ({ kinematicsConfigurationIndex, jogSpeed }) => {
    const [mode, setMode] = useState(Mode.POSITION)

    const [positions, setPositions] = useLocalStorage("jog.joints", [])

    const jointConfig = useJointConfig()
    const jointItems = useMemo<JogGotoItem[]>(
        () =>
            jointConfig.map((j, index) => ({
                type: j.jointType === JOINT_TYPE.JOINT_PRISMATIC ? "linear" : "angular",
                label: "J" + index,
                key: index
            })),
        [jointConfig]
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
            <Radio.Group value={mode} onChange={e => setMode(e.target.value)} size="small">
                <Radio.Button value={Mode.POSITION}>Position</Radio.Button>
                <Radio.Button value={Mode.WAYPOINT}>Waypoint</Radio.Button>
            </Radio.Group>
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
