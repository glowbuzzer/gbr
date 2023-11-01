/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { Button, Card, Select, Space, Switch } from "antd"
import { appSlice, useAppState } from "./store"

import styled from "styled-components"
import { PrecisionInput } from "../../../../libs/controls/src/util/components/PrecisionInput"
import React from "react"
import { useDispatch } from "react-redux"
import { Box3, Vector3 } from "three"
import { useSoloActivity } from "@glowbuzzer/store"

const StyledDiv = styled.div`
    padding: 10px;
    .grid {
        display: grid;
        width: 100%;
        grid-template-columns: 1fr 2fr 2fr 2fr;
        gap: 8px;
        align-items: center;
        margin-bottom: 8px;
    }

    .col5 {
        grid-template-columns: 1fr 2fr 2fr 2fr 2fr;
    }

    .title {
        display: flex;
        justify-content: space-between;
    }
`

export const DemoTile = () => {
    const { box, path, plannedPath, clearance, showControls, route } = useAppState()
    const activityApi = useSoloActivity(0)

    const dispatch = useDispatch()

    const position = box.min
    const dimensions = box.max.clone().sub(box.min)

    const route_options = [
        { value: 0b000011, label: "Around the Front" },
        { value: 0b001100, label: "Around the Back" },
        { value: 0b110000, label: "Over the Top" }
    ]

    function update_position(axis: string, value: number) {
        const new_position = position.clone()
        new_position[axis] = value
        dispatch(
            appSlice.actions.setBox(new Box3(new_position, new_position.clone().add(dimensions)))
        )
    }

    function update_dimensions(axis: string, value: number) {
        const new_dimensions = dimensions.clone()
        new_dimensions[axis] = value
        dispatch(
            appSlice.actions.setBox(
                new Box3(position.clone(), position.clone().add(new_dimensions))
            )
        )
    }

    function update_point(index: number, axis: string, value: number) {
        const new_path = path.slice()
        const pos = new_path[index].clone()
        pos[axis] = value
        new_path[index] = pos
        dispatch(appSlice.actions.setPath(new_path))
    }

    function add_point() {
        const new_path = path.slice()
        new_path.push(new Vector3(200, -200, 0))
        dispatch(appSlice.actions.setPath(new_path))
    }

    function delete_point(i: number) {
        const new_path = path.slice()
        new_path.splice(i, 1)
        dispatch(appSlice.actions.setPath(new_path))
    }

    function update_clearance(value: number) {
        dispatch(appSlice.actions.setClearance(value))
    }

    function toggle_show_controls() {
        dispatch(appSlice.actions.setShowControls(!showControls))
    }

    function reset() {
        return activityApi.moveToPosition(200, 0, 150).rotationEuler(Math.PI, 0, 0).promise()
    }

    async function exec() {
        for (const point of plannedPath) {
            await activityApi.moveLine(point.x, point.y, point.z).frameIndex(0).promise()
        }
        await activityApi.moveToPosition(200, 0, 150).promise()
    }

    function update_route(route) {
        dispatch(appSlice.actions.setRoute(route))
    }

    return (
        <StyledDiv>
            <p>This is a demo of path planning with obstacle avoidance.</p>
            <p>You can move the obstacle in the scene using the inputs below.</p>
            <p>
                The robot will try to follow the path given but avoid the obstacle using the
                preferred routing mode.
            </p>
            <Space direction="vertical">
                <Card size="small" title="Move">
                    <Space>
                        <Button size="small" onClick={reset}>
                            Reset
                        </Button>
                        <Button size="small" onClick={exec}>
                            Execute Moves
                        </Button>
                    </Space>
                </Card>
                <Card size="small" title="Obstacle">
                    <div className="grid">
                        <div>Position</div>
                        <>
                            {["x", "y", "z"].map(axis => (
                                <div className="input" key={axis}>
                                    {axis.toUpperCase()}{" "}
                                    <PrecisionInput
                                        step={10}
                                        value={position[axis]}
                                        onChange={v => update_position(axis, v)}
                                        precision={0}
                                    />
                                </div>
                            ))}
                        </>
                        <div>Dimensions</div>
                        <>
                            {["x", "y", "z"].map(axis => (
                                <div className="input" key={"t-" + axis}>
                                    {axis.toUpperCase()}{" "}
                                    <PrecisionInput
                                        step={10}
                                        value={dimensions[axis]}
                                        onChange={v => update_dimensions(axis, v)}
                                        precision={0}
                                    />
                                </div>
                            ))}
                        </>
                        <div>Clearance</div>
                        <div>
                            C{" "}
                            <PrecisionInput
                                step={5}
                                value={clearance}
                                onChange={update_clearance}
                                precision={0}
                            />
                        </div>
                    </div>
                </Card>
                <Card
                    size="small"
                    title={
                        <div className="title">
                            Path
                            <div>
                                <Switch
                                    size="small"
                                    checked={showControls}
                                    onChange={toggle_show_controls}
                                />{" "}
                                Show Controls
                            </div>
                        </div>
                    }
                >
                    <div className="grid col5">
                        {path.map((p, i) => (
                            <React.Fragment key={i}>
                                Point {i + 1}
                                {["x", "y", "z"].map(axis => (
                                    <div className="input" key={axis}>
                                        {axis.toUpperCase()}{" "}
                                        <PrecisionInput
                                            step={10}
                                            value={p[axis]}
                                            onChange={v => update_point(i, axis, v)}
                                            precision={0}
                                        />
                                    </div>
                                ))}
                                <Button
                                    size="small"
                                    onClick={() => delete_point(i)}
                                    disabled={path.length <= 2}
                                >
                                    Delete
                                </Button>
                            </React.Fragment>
                        ))}
                    </div>
                    <Button size="small" onClick={add_point}>
                        Add Point
                    </Button>
                </Card>
                <Card size="small" title="Preferred Route">
                    <Select
                        size="small"
                        popupMatchSelectWidth={false}
                        options={route_options}
                        value={route}
                        onChange={update_route}
                    />
                </Card>
            </Space>
        </StyledDiv>
    )
}
