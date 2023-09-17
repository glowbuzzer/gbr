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
    const { tipPickUp, setTipPickUp } = useAppState()
    const { firstSuck, setFirstSuck } = useAppState()
    const [duration, setDuration] = useState(1)
    const [moveType, setMoveType] = useState("moveRelative")

    async function start() {
        stream.reset()
        stream.sendCommand(STREAMCOMMAND.STREAMCOMMAND_RUN)

        setMode(Mode.RUNNING)

        //move to tip pickup point
        await stream.send(api => [
            // api.moveToPosition().setFromPoint(points[1]).promise(),
            // moveType === "moveRelative"
            //     ? api.moveLine(500).relative(true).promise()
            //     : api.moveLine().setFromPoint(points[2]).promise()
            api.moveToPosition().translation(144, 33, 0).rotation(0, 0, 0, 1).promise(),
            api.moveLine().translation(144, 33, -40).rotation(0, 0, 0, 1).promise()
        ])
        setTipPickUp(true)

        //wiggle to attach tip
        await stream.send(api => [
            api.moveLine().translation(144, 33, -30).rotation(0, 0, 0, 1).promise(),
            api.moveLine().translation(144, 33, -40).rotation(0, 0, 0, 1).promise(),
            api.moveLine().translation(144, 33, -30).rotation(0, 0, 0, 1).promise(),
            api.moveLine().translation(144, 33, -40).rotation(0, 0, 0, 1).promise(),
            api.moveLine().translation(144, 33, 0).rotation(0, 0, 0, 1).promise()
        ])

        //move to blue liquid
        await stream.send(api => [
            api.moveToPosition().translation(180, 33, 0).rotation(0, 0, 0, 1).promise(),
            api.moveLine().translation(180, 33, -30).rotation(0, 0, 0, 1).promise()
        ])

        setFirstSuck(true)
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
        setTipPickUp(false)
        setFirstSuck(false)
        stream
            .send(api => [api.moveToPosition().setFromPoint(points[0]).promise()])
            .finally(() => setMode(Mode.READY))
    }

    const move_type_options = [
        { label: "relative move of 500 in X", value: "moveRelative" },
        { label: "linear move to position", value: "moveLine" }
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
                <Space>
                    Move to start, then
                    <Select options={move_type_options} value={moveType} onChange={setMoveType} />
                    {/*<span>for</span>*/}
                    {/*<PrecisionInput value={duration} onChange={setDuration} precision={0} /> second*/}
                </Space>
                <Checkbox checked={tipPickUp} onChange={() => setTipPickUp(!tipPickUp)}>
                    tipPickUp
                </Checkbox>
                <Checkbox checked={firstSuck} onChange={() => setFirstSuck(!firstSuck)}>
                    firstSuck
                </Checkbox>
            </Space>
        </div>
    )
}

/*
move to tip
 */
