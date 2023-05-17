/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { WaypointsProps } from "./types"
import {
    JOINT_TYPE,
    useJointConfigurationList,
    useJointPositions,
    useKinematicsConfiguration,
    usePrefs
} from "@glowbuzzer/store"
import { useLocalStorage } from "../util/LocalStorageHook"
import { Button } from "antd"
import { DeleteOutlined, PushpinOutlined } from "@ant-design/icons"
import * as React from "react"
import styled from "styled-components"

const StyledWaypointsDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    .waypoint {
        padding: 4px;

        cursor: pointer;

        :hover .delete {
            visibility: visible;
        }

        .delete {
            visibility: hidden;
        }
    }
`

const EMPTY_ARRAY = []
/** @ignore - internal to the jog tile */
export const WaypointsJoints = ({ kinematicsConfigurationIndex, onSelect }: WaypointsProps) => {
    const joints = useJointPositions(kinematicsConfigurationIndex)
    const jointConfig = useJointConfigurationList()
    const kcConfig = useKinematicsConfiguration(kinematicsConfigurationIndex)
    const { fromSI, getUnits } = usePrefs()

    // determine precision (toFixed decimal places)
    const dpl = getUnits("linear") === "mm" ? 0 : 2
    const dpa = getUnits("angular") === "deg" ? 0 : 2

    const [waypoints, setWaypoints] = useLocalStorage(
        `waypoints.joint.${kinematicsConfigurationIndex}`,
        EMPTY_ARRAY
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
            <div>
                {waypoints.map((w, i) => (
                    <div key={i} className="waypoint">
                        <span onClick={() => onSelect(w)}>
                            <PushpinOutlined /> {convert(w).join(", ")}
                        </span>{" "}
                        <DeleteOutlined className="delete" onClick={() => remove(i)} />
                    </div>
                ))}
            </div>
            <div>
                <Button size="small" onClick={add}>
                    Add Waypoint
                </Button>
            </div>
        </StyledWaypointsDiv>
    )
}
