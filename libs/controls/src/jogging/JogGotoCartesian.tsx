import { Radio } from "antd"
import { FrameSelector } from "../misc"
import React, { useState } from "react"
import { Euler, Quaternion } from "three"
import { useLocalStorage } from "../util/LocalStorageHook"
import {
    LIMITPROFILE,
    MoveParametersConfig,
    MoveToPositionBuilder,
    useKinematicsCartesianPosition,
    usePreview,
    useSoloActivity
} from "@glowbuzzer/store"
import { RobotConfigurationSelector } from "../misc/RobotConfigurationSelector"
import { WaypointsCartesian } from "./WaypointsCartesian"
import { StyledJogDiv } from "./util"
import { JogGotoInputPanel, JogGotoItem } from "./JogGotoInputPanel"

enum Mode {
    POSITION,
    ORIENTATION,
    WAYPOINT
}

const Tab = ({ value, children, mode }) => (
    <div className={"tab" + (value === mode ? " selected" : "")}>{children}</div>
)

const xyzItems: JogGotoItem[] = [
    { type: "linear", key: "x", label: "X" },
    { type: "linear", key: "y", label: "Y" },
    { type: "linear", key: "z", label: "Z" }
]

const abcItems: JogGotoItem[] = [
    { type: "angular", key: "x", label: "α" },
    { type: "angular", key: "y", label: "β" },
    { type: "angular", key: "z", label: "Ɣ" }
]

/** @ignore - internal to the jog tile */
export const JogGotoCartesian = ({
    kinematicsConfigurationIndex,
    jogSpeed,
    defaultFrameIndex,
    showRobotConfiguration
}) => {
    const [mode, setMode] = useState(Mode.POSITION)

    const [selectedFrame, setSelectedFrame] = useState(0)

    const [robotConfiguration, setRobotConfiguration] = useLocalStorage(
        "jog.robot.configuration",
        0
    )

    const motion = useSoloActivity(kinematicsConfigurationIndex)
    const waypoint = useKinematicsCartesianPosition(kinematicsConfigurationIndex)

    const preview = usePreview()

    const move_params: MoveParametersConfig = {
        vmaxPercentage: jogSpeed,
        amaxPercentage: jogSpeed,
        jmaxPercentage: jogSpeed,
        limitConfigurationIndex: LIMITPROFILE.LIMITPROFILE_JOGGING
    }

    const {
        x: qx,
        y: qy,
        z: qz,
        w: qw
    } = useKinematicsCartesianPosition(kinematicsConfigurationIndex).position || {
        x: 0,
        y: 0,
        z: 0,
        w: 1
    }

    const rotation = new Quaternion(qx, qy, qz, qw)

    function goto(move: MoveToPositionBuilder) {
        preview.disable()
        move.frameIndex(selectedFrame)
            .configuration(robotConfiguration)
            .params(move_params)
            .promise()
            .finally(preview.enable)
    }

    function goto_waypoint(w) {
        preview.disable()
        console.log("MOVE TO WAYPOINT", w)
        return motion
            .moveToPosition()
            .setFromCartesianPosition(w.position)
            .configuration(w.configuration)
            .params(move_params)
            .promise()
            .finally(preview.enable)
    }

    function goto_orient(key: string, angleInRadians: number) {
        const euler = new Euler().setFromQuaternion(rotation)
        euler[key] = angleInRadians
        const { x, y, z, w } = new Quaternion().setFromEuler(euler)
        return goto(motion.moveToPosition().rotation(x, y, z, w))
    }

    function goto_orient_all(values) {
        const { x: a, y: b, z: c } = values
        const euler = new Euler(a, b, c)
        const { x, y, z, w } = new Quaternion().setFromEuler(euler)
        return goto(motion.moveToPosition().rotation(x, y, z, w))
    }

    const Selectors = () => (
        <div className="selectors">
            <div className="frame">
                Frame:{" "}
                <FrameSelector
                    onChange={setSelectedFrame}
                    value={selectedFrame}
                    defaultFrame={defaultFrameIndex}
                    hideWorld
                />
            </div>
            {showRobotConfiguration && (
                <RobotConfigurationSelector
                    value={robotConfiguration}
                    onChange={setRobotConfiguration}
                />
            )}
        </div>
    )

    const goto_position = (index, value) => {
        switch (index) {
            case "x":
                return goto(motion.moveToPosition(value))
            case "y":
                return goto(motion.moveToPosition(undefined, value))
            case "z":
                return goto(motion.moveToPosition(undefined, undefined, value))
        }
    }

    const goto_position_all = values => {
        const { x, y, z } = values
        return goto(motion.moveToPosition(x, y, z))
    }

    return (
        <StyledJogDiv>
            <Radio.Group value={mode} onChange={e => setMode(e.target.value)} size="small">
                <Radio.Button value={Mode.POSITION}>Position</Radio.Button>
                <Radio.Button value={Mode.ORIENTATION}>Orientation</Radio.Button>
                <Radio.Button value={Mode.WAYPOINT}>Waypoint</Radio.Button>
            </Radio.Group>
            <div>
                <Tab value={Mode.POSITION} mode={mode}>
                    <Selectors />

                    <JogGotoInputPanel
                        localStorageKey={"jog.position"}
                        items={xyzItems}
                        onGoto={goto_position}
                        onGotoAll={goto_position_all}
                    />
                </Tab>
                <Tab value={Mode.ORIENTATION} mode={mode}>
                    <Selectors />

                    <JogGotoInputPanel
                        localStorageKey={"jog.orientation"}
                        items={abcItems}
                        onGoto={goto_orient}
                        onGotoAll={goto_orient_all}
                    />
                </Tab>
                <Tab value={Mode.WAYPOINT} mode={mode}>
                    <WaypointsCartesian
                        kinematicsConfigurationIndex={kinematicsConfigurationIndex}
                        position={waypoint}
                        onSelect={goto_waypoint}
                    />
                </Tab>
            </div>
        </StyledJogDiv>
    )
}
