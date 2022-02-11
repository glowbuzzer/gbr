import * as React from "react"
import { useState } from "react"
import { settings, useJointPositions } from "@glowbuzzer/store"
import { DeleteOutlined, PushpinOutlined } from "@ant-design/icons"
import styled from "styled-components"
import { Button } from "antd"
import { MathUtils } from "three"

const { load, save } = settings("waypoints")

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

export const Waypoints = ({ kinematicsConfigurationIndex, onSelect }: WaypointsProps) => {
    const joints = useJointPositions(kinematicsConfigurationIndex)

    const [waypoints, setWaypoints] = useState<number[][]>(
        load([
            [90, 45, 45, 45, 90, 0],
            [90, 90, 0, 0, 90, 0]
        ])
    )

    function add() {
        setWaypoints(current => {
            const next = [...current, joints.map(j => MathUtils.radToDeg(j || 0))]
            save(next)
            return next
        })
    }

    function remove(index: number) {
        setWaypoints(current => {
            const next = current.filter((_, i) => i !== index)
            save(next)
            return next
        })
    }

    return (
        <StyledDiv>
            <Button onClick={add}>Add Waypoint</Button>
            {waypoints.map((w, i) => (
                <div key={i}>
                    <span onClick={() => onSelect(w)}>
                        <PushpinOutlined /> {w.map(j => j.toFixed(0)).join(", ")}
                    </span>{" "}
                    <DeleteOutlined className="delete" onClick={() => remove(i)} />
                </div>
            ))}
        </StyledDiv>
    )
}
