import * as React from "react"
import {
    JOINT_TYPE,
    useJointConfig,
    useJointPositions,
    useKinematicsConfiguration,
    usePrefs
} from "@glowbuzzer/store"
import { DeleteOutlined, PushpinOutlined } from "@ant-design/icons"
import styled from "styled-components"
import { Button } from "antd"
import { Euler, Quaternion } from "three"
import { useLocalStorage } from "../util/LocalStorageHook"

const StyledDiv = styled.div`
    padding: 10px;

    div {
        font-weight: bold;
        color: darkblue;
        cursor: pointer;

        :hover .delete {
            display: inline;
        }
    }

    .delete {
        display: none;
    }
`

type WaypointsProps = {
    kinematicsConfigurationIndex: number
    onSelect(waypoint: number[]): void
}

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
        <StyledDiv>
            <Button onClick={add}>Add Waypoint</Button>
            {waypoints.map((w, i) => (
                <div key={i}>
                    <span onClick={() => onSelect(w)}>
                        <PushpinOutlined /> {convert(w).join(", ")}
                    </span>{" "}
                    <DeleteOutlined className="delete" onClick={() => remove(i)} />
                </div>
            ))}
        </StyledDiv>
    )
}

export const WaypointsCartesian = ({ kinematicsConfigurationIndex, position, onSelect }) => {
    const [waypoints, setWaypoints] = useLocalStorage(
        `waypoints.cartesian.${kinematicsConfigurationIndex}`,
        []
    )
    const { fromSI, getUnits } = usePrefs()

    // determine precision (toFixed decimal places)
    const dpl = getUnits("linear") === "mm" ? 0 : 2
    const dpa = getUnits("angular") === "deg" ? 0 : 2

    function add() {
        setWaypoints(current => [...current, position])
    }

    function remove(index: number) {
        setWaypoints(current => current.filter((_, i) => i !== index))
    }

    return (
        <StyledDiv>
            <Button onClick={add}>Add Waypoint</Button>
            {waypoints.map((w, i) => {
                const p = w.position.translation
                const q = w.position.rotation
                const euler = new Euler().setFromQuaternion(new Quaternion(q.x, q.y, q.z, q.w))

                const [x, y, z] = ["x", "y", "z"].map(k => fromSI(p[k], "linear").toFixed(dpl))
                const [ax, ay, az] = ["x", "y", "z"].map(k =>
                    fromSI(euler[k], "angular").toFixed(dpa)
                )

                return (
                    <div key={i}>
                        <span onClick={() => onSelect(w)}>
                            <PushpinOutlined /> ({x}, {y}, {z} {getUnits("linear")}) ({ax}, {ay},{" "}
                            {az} {getUnits("angular")})
                        </span>{" "}
                        <DeleteOutlined className="delete" onClick={() => remove(i)} />
                    </div>
                )
            })}
        </StyledDiv>
    )
}
