/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { WaypointsProps } from "./types"
import {
    JOINT_TYPE,
    useJointConfig,
    useJointPositions,
    useKinematicsConfiguration,
    usePrefs
} from "@glowbuzzer/store"
import { useLocalStorage } from "../util/LocalStorageHook"
import { StyledWaypointsDiv } from "./util"
import { Button } from "antd"
import { DeleteOutlined, PushpinOutlined } from "@ant-design/icons"
import * as React from "react"

/** @ignore - internal to the jog tile */
export const WaypointsJoints = ({ kinematicsConfigurationIndex, onSelect }: WaypointsProps) => {
    const joints = useJointPositions(kinematicsConfigurationIndex)
    const jointConfig = useJointConfig()
    const kcConfig = useKinematicsConfiguration(kinematicsConfigurationIndex)
    const { fromSI, getUnits } = usePrefs()

    // determine precision (toFixed decimal places)
    const dpl = getUnits("linear") === "mm" ? 0 : 2
    const dpa = getUnits("angular") === "deg" ? 0 : 2

    const [waypoints, setWaypoints] = useLocalStorage(
        `waypoints.joint.${kinematicsConfigurationIndex}`,
        []
    )

    function add() {
        setWaypoints(current => {
            return [...current, joints]
        })
    }

    function remove(index: number) {
        setWaypoints(current => {
            return current.filter((_, i) => i !== index)
        })
    }

    function convert(w: number[]): string[] {
        return kcConfig.participatingJoints
            .map(physicalJointIndex => jointConfig[physicalJointIndex])
            .map(({ jointType }, index) =>
                fromSI(
                    w[index],
                    jointType === JOINT_TYPE.JOINT_REVOLUTE ? "angular" : "linear"
                ).toFixed(jointType === JOINT_TYPE.JOINT_REVOLUTE ? dpa : dpl)
            )
    }

    return (
        <StyledWaypointsDiv>
            <Button onClick={add}>Add Waypoint</Button>
            {waypoints.map((w, i) => (
                <div key={i}>
                    <span onClick={() => onSelect(w)}>
                        <PushpinOutlined /> {convert(w).join(", ")}
                    </span>{" "}
                    <DeleteOutlined className="delete" onClick={() => remove(i)} />
                </div>
            ))}
        </StyledWaypointsDiv>
    )
}
