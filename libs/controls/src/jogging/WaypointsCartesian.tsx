/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { usePrefs } from "@glowbuzzer/store"
import { DeleteOutlined, PushpinOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { Euler, Quaternion } from "three"
import { useLocalStorage } from "../util/LocalStorageHook"
import { StyledWaypointsDiv } from "./util"

/** @ignore - internal to the jog tile */
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
        <StyledWaypointsDiv>
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
        </StyledWaypointsDiv>
    )
}
