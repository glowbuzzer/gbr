/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Radio } from "antd"
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
import { JogTileItem, StyledJogDiv } from "./util"
import { JogGotoInputPanel, JogGotoItem } from "./JogGotoInputPanel"

export enum PositionMode {
    POSITION,
    ORIENTATION
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
    jogSpeed,
    positionMode,
    kinematicsConfigurationIndex,
    frameIndex,
    disabled
}) => {
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
    } = waypoint.position.rotation || {
        x: 0,
        y: 0,
        z: 0,
        w: 1
    }

    const rotation = new Quaternion(qx, qy, qz, qw)

    function goto(move: MoveToPositionBuilder) {
        preview.disable()
        move.frameIndex(frameIndex)
            .configuration(robotConfiguration)
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
            <div>
                <Tab value={PositionMode.POSITION} mode={positionMode}>
                    <JogGotoInputPanel
                        localStorageKey={"jog.position"}
                        items={xyzItems}
                        disabled={disabled}
                        onGoto={goto_position}
                        onGotoAll={goto_position_all}
                    />
                </Tab>
                <Tab value={PositionMode.ORIENTATION} mode={positionMode}>
                    <JogGotoInputPanel
                        localStorageKey={"jog.orientation"}
                        items={abcItems}
                        disabled={disabled}
                        onGoto={goto_orient}
                        onGotoAll={goto_orient_all}
                    />
                </Tab>
            </div>
        </StyledJogDiv>
    )
}
