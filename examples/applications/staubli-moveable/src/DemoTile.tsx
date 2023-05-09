/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { STREAMCOMMAND, STREAMSTATE, usePointsList, useStream } from "@glowbuzzer/store"
import React, { useState } from "react"
import { Button, Checkbox, Select, Space, Tag } from "antd"
import { useAppState } from "./store"
import { PrecisionInput } from "../../../../libs/controls/src/util/components/PrecisionInput"

enum Mode {
    REQUIRE_RESET,
    READY,
    RUNNING
}

export const DemoTile = () => {
    const [mode, setMode] = useState(Mode.REQUIRE_RESET)
    const points = usePointsList()
    const stream = useStream(0)
    const { tracking, setTracking } = useAppState()
    const [duration, setDuration] = useState(1)
    const [moveType, setMoveType] = useState("moveRelative")

    async function start() {
        stream.reset()
        stream.sendCommand(STREAMCOMMAND.STREAMCOMMAND_RUN)

        setMode(Mode.RUNNING)
        await stream.send(api => [
            api.moveToPosition().setFromPoint(points[1]).promise(),
            moveType === "moveRelative"
                ? api
                      .moveLine(1000)
                      .duration(duration * 1000)
                      // .rotationEuler(0, Math.PI / 2, 0)
                      .relative(true)
                      .promise()
                : api
                      .moveLine()
                      .setFromPoint(points[2])
                      .duration(duration * 1000)
                      .promise()
        ])
        setMode(Mode.REQUIRE_RESET)
    }

    function stop() {
        setMode(Mode.REQUIRE_RESET)
        stream.sendCommand(STREAMCOMMAND.STREAMCOMMAND_STOP)
        stream.reset()
    }

    function reset() {
        stream.reset()
        stream.sendCommand(STREAMCOMMAND.STREAMCOMMAND_RUN)
        stream
            .send(api => [api.moveToPosition().setFromPoint(points[0]).promise()])
            .finally(() => setMode(Mode.READY))
    }

    const move_type_options = [
        { label: "Relative move in X", value: "moveRelative" },
        { label: "Linear move to position", value: "moveLine" }
    ]

    return (
        <div style={{ padding: "10px" }}>
            <Space direction="vertical">
                <Space>
                    <Button size="small" onClick={reset} disabled={mode !== Mode.REQUIRE_RESET}>
                        RESET
                    </Button>
                    <Button
                        size="small"
                        onClick={mode === Mode.RUNNING ? stop : start}
                        disabled={mode === Mode.REQUIRE_RESET}
                    >
                        {mode === Mode.RUNNING ? "STOP" : "START"}
                    </Button>
                    <Tag>{STREAMSTATE[stream.state].substring(12)}</Tag>
                </Space>
                <Checkbox checked={tracking} onChange={() => setTracking(!tracking)}>
                    Tracking Camera
                </Checkbox>
                <Space>
                    <Select options={move_type_options} value={moveType} onChange={setMoveType} />
                    <span>Duration of move</span>
                    <PrecisionInput value={duration} onChange={setDuration} precision={0} />
                </Space>
            </Space>
        </div>
    )
}
