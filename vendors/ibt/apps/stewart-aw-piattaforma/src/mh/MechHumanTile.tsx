/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React, { useMemo, useState } from "react"
import { RcFile } from "antd/es/upload"
import { Button, message, Space, Table, Tag } from "antd"
import { CartesianPosition, MachineState, useMachineState, useStream } from "@glowbuzzer/store"
import { calc_cartesian_position, chunk, interpolate } from "./motion"
import { useMechHumanContext } from "./MechHumanContextProvider"
import styled from "styled-components"
import { Euler, Quaternion } from "three"
import { radToDeg } from "three/src/math/MathUtils"

const StyledDiv = styled.div`
    padding: 10px;
`

enum State {
    PROJECT_NOT_LOADED = "Project Not Loaded",
    PROJECT_LOADING = "Loading Project...",
    MOVE_START_REQUIRED = "Move To Start Required",
    READY = "Ready",
    GENERATING = "Generating...",
    RUNNING = "Running"
}

const columns = ["x", "y", "z", "a", "b", "c"].map(key => ({
    key: key,
    title: key.toUpperCase(),
    dataIndex: key
}))

/**
 * Provide the UI to load a project and run the motion.
 */
export const MechHumanTile = () => {
    const { points, openProject } = useMechHumanContext()
    const { execute, reset, tag, state: streamState, pending, queued, time } = useStream(0)
    const [messageApi, messagePlaceholder] = message.useMessage()
    const [state, setState] = useState(State.PROJECT_NOT_LOADED)
    const [positions, setPositions] = useState<CartesianPosition[]>([])
    const [showPositions, setShowPositions] = useState(false)
    const machineState = useMachineState()

    const disabled = machineState !== MachineState.OPERATION_ENABLED

    async function open_project() {
        // function called when user selects a file to "upload" (actually just load into memory)
        setState(State.PROJECT_LOADING)

        const r = await fetch("/teeth.zip").then(r => r.arrayBuffer())
        openProject(r)
            .then(() => {
                messageApi.success("Project loaded!")
                setPositions(points.map(calc_cartesian_position))
                setState(State.MOVE_START_REQUIRED)
            })
            .catch(e => {
                messageApi.error(e.message)
                setState(State.PROJECT_NOT_LOADED)
            })
    }

    // async function before_upload(info: RcFile) {
    //     // function called when user selects a file to "upload" (actually just load into memory)
    //     setState(State.PROJECT_LOADING)
    //
    //     openProject(await info.arrayBuffer())
    //         .then(() => {
    //             messageApi.success("Project loaded!")
    //             setPositions(points.map(calc_cartesian_position))
    //             setState(State.MOVE_START_REQUIRED)
    //         })
    //         .catch(e => {
    //             messageApi.error(e.message)
    //             setState(State.PROJECT_NOT_LOADED)
    //         })
    // }

    async function run() {
        try {
            setState(State.GENERATING)

            /**
             * Interpolate the marks in the jawMotion file and send to the robot.
             *
             * We chunk up the interpolated points to avoid blocking the main UI thread while we generate the activities.
             * We collect an array of promises, all of which will be resolved when the motion is complete.
             */
            const promises = []
            // TODO: M: should read the frame rate from project file and bus frequency from config
            for (const positions of chunk(interpolate(points, 21, 4), 100)) {
                // take chunk of positions and send to robot using api.moveInstant()
                promises.push(
                    execute(api =>
                        positions.map(p => api.moveInstant().setFromCartesianPosition(p))
                    )
                )
                // allow the UI thread to do some work before processing next chunk
                await new Promise(resolve => setTimeout(resolve, 0))
            }

            setState(State.RUNNING)
            await Promise.all(promises)

            messageApi.success("Motion completed!")
            reset()
        } finally {
            setState(State.MOVE_START_REQUIRED)
        }
    }

    async function go_start() {
        // move to the start position (first point in the motion)
        const start_position = calc_cartesian_position(points[0])
        const { translation } = start_position
        const { x, y } = translation

        try {
            reset()
            await execute(api => [
                // move to safe Z
                api.moveLine(0, 0, -10).relative(),
                // move to start xy
                api.moveLine(x, y, null /* current position */),
                // move to start
                api.moveLine().setFromCartesianPosition(start_position)
            ])
            setState(State.READY)
        } catch (e) {
            messageApi.error(e.message)
            setState(State.MOVE_START_REQUIRED)
        }
    }

    const busy = state === State.PROJECT_LOADING || state === State.RUNNING
    const loaded = state !== State.PROJECT_NOT_LOADED

    const table_data = useMemo(() => {
        return positions.map((p, i) => {
            const euler = new Euler().setFromQuaternion(new Quaternion().copy(p.rotation as any))
            return {
                key: i,
                x: p.translation.x.toFixed(2),
                y: p.translation.y.toFixed(2),
                z: p.translation.z.toFixed(2),
                a: radToDeg(euler.x).toFixed(2),
                b: radToDeg(euler.y).toFixed(2),
                c: radToDeg(euler.z).toFixed(2)
            }
        })
    }, [positions])

    return (
        <StyledDiv>
            {messagePlaceholder}
            <Space direction="vertical">
                <Space>
                    <Button
                        size="small"
                        onClick={open_project}
                        loading={state === State.PROJECT_LOADING}
                        disabled={busy}
                    >
                        Load Project
                    </Button>
                    {/*
                    <Upload beforeUpload={before_upload} maxCount={1} showUploadList={false}>
                        <Button
                            size="small"
                            loading={state === State.PROJECT_LOADING}
                            disabled={busy}
                        >
                            Load Project
                        </Button>
                    </Upload>
*/}
                    {disabled ? (
                        <Tag color="red">NOT OP ENABLED</Tag>
                    ) : (
                        <Tag color="green">OPERATION ENABLED</Tag>
                    )}
                </Space>
                <Space>
                    <Tag color="gold">{state}</Tag>
                    {state === State.MOVE_START_REQUIRED && (
                        <Button size="small" onClick={go_start} disabled={disabled}>
                            Move Start
                        </Button>
                    )}
                    {state === State.READY && (
                        <Button size="small" onClick={run} disabled={disabled}>
                            Run Motion
                        </Button>
                    )}
                    {state === State.RUNNING && (
                        <Button size="small" onClick={reset}>
                            Cancel
                        </Button>
                    )}
                </Space>
                {loaded && (
                    <>
                        <div>Project file contains {points.length} points</div>
                    </>
                )}
                <div>
                    <Tag>Queued {queued}</Tag>
                    <Tag>Pending {pending}</Tag>
                    <Tag>Time {time}</Tag>
                </div>
                <Button size="small" onClick={() => setShowPositions(!showPositions)}>
                    {showPositions ? "Hide" : "Show"} Positions
                </Button>
                {showPositions && (
                    <Table
                        size="small"
                        dataSource={table_data}
                        columns={columns}
                        pagination={false}
                    />
                )}
            </Space>
        </StyledDiv>
    )
}
