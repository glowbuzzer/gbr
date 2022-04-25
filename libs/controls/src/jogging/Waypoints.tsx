import * as React from "react"
import { useState } from "react"
import {
    CartesianPositionsConfig,
    JOINT_TYPE,
    settings,
    useJointConfig,
    useJointPositions,
    usePrefs
} from "@glowbuzzer/store"
import { DeleteOutlined, PushpinOutlined } from "@ant-design/icons"
import styled from "styled-components"
import { Button } from "antd"
import { Euler, Quaternion } from "three"

const { load: loadJoint, save: saveJoint } = settings("waypoints.joint")
const { load: loadCartesian, save: saveCartesian } = settings("waypoints.cartesian")

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
    const { fromSI, getUnits } = usePrefs()

    // determine precision (toFixed decimal places)
    const dpl = getUnits("linear") === "mm" ? 0 : 2
    const dpa = getUnits("angular") === "deg" ? 0 : 2

    const [waypoints, setWaypoints] = useState<number[][]>(loadJoint([]))

    function add() {
        setWaypoints(current => {
            const next = [...current, joints.map(j => j || 0)]
            saveJoint(next)
            return next
        })
    }

    function remove(index: number) {
        setWaypoints(current => {
            const next = current.filter((_, i) => i !== index)
            saveJoint(next)
            return next
        })
    }

    function convert(w: number[]): string[] {
        return jointConfig.map(({ jointType }, index) =>
            fromSI(
                w[index],
                jointType === JOINT_TYPE.JOINT_PRISMATIC ? "linear" : "angular"
            ).toFixed(jointType === JOINT_TYPE.JOINT_PRISMATIC ? dpl : dpa)
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

export const WaypointsCartesian = ({ position, onSelect }) => {
    const [waypoints, setWaypoints] = useState<CartesianPositionsConfig[]>(loadCartesian([]))
    const { fromSI, getUnits } = usePrefs()

    // determine precision (toFixed decimal places)
    const dpl = getUnits("linear") === "mm" ? 0 : 2
    const dpa = getUnits("angular") === "deg" ? 0 : 2

    function add() {
        setWaypoints(current => {
            const next = [...current, position]
            saveCartesian(next)
            return next
        })
    }

    function remove(index: number) {
        setWaypoints(current => {
            const next = current.filter((_, i) => i !== index)
            saveCartesian(next)
            return next
        })
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
