/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React, { useEffect, useState } from "react"
import {
    BLENDTYPE,
    MachineState,
    MoveParametersConfig,
    STREAMCOMMAND,
    useMachineCurrentState,
    useMachineHeartbeat,
    useSoloActivity,
    useStream
} from "@glowbuzzer/store"
import { Button, Space } from "antd"
import { useDispatch } from "react-redux"
import { appSlice } from "./store"

enum Mode {
    REQUIRE_RESET,
    READY,
    RUNNING
}

export const DemoTile = () => {
    const currentState = useMachineCurrentState()
    const heartbeat = useMachineHeartbeat()
    const thomasStream = useStream(0)
    const thomasSoloActivity = useSoloActivity(0)

    const [mode, setMode] = useState(Mode.REQUIRE_RESET)
    const dispatch = useDispatch()

    useEffect(() => {
        if (currentState !== MachineState.OPERATION_ENABLED) {
            setMode(Mode.REQUIRE_RESET)
        }
    }, [currentState])

    function pick() {
        dispatch(appSlice.actions.pick())
    }

    function place() {
        dispatch(appSlice.actions.place())
    }

    async function start() {
        setMode(Mode.RUNNING)
        const moveparams: MoveParametersConfig = {
            blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
            blendTimePercentage: 100
        }
        for (let block = 0; block < 3; block++) {
            await thomasStream
                .send(api => [
                    api
                        .moveToPosition(300, 0, (3 - block) * 100 + 30)
                        .frameIndex(0)
                        .params(moveparams)
                        .promise(),
                    api
                        .moveLine(300, 0, (3 - block) * 100)
                        .frameIndex(0)
                        .params(moveparams)
                        .promise()
                        .then(pick),
                    api
                        .moveLine(300, 0, (3 - block) * 100 + 30)
                        .frameIndex(0)
                        .params(moveparams)
                        .promise(),
                    api
                        .moveToPosition(0, 300, block * 100 + 130)
                        .frameIndex(0)
                        .params(moveparams)
                        .promise(),
                    api
                        .moveLine(0, 300, block * 100 + 100)
                        .frameIndex(0)
                        .params(moveparams)
                        .promise()
                        .then(place),
                    api
                        .moveToPosition(0, 300, block * 100 + 130)
                        .frameIndex(0)
                        .params(moveparams)
                        .promise()
                ])
                .then(() => {
                    setMode(Mode.REQUIRE_RESET)
                })
        }
    }

    function stop() {
        setMode(Mode.REQUIRE_RESET)
        thomasStream.sendCommand(STREAMCOMMAND.STREAMCOMMAND_STOP)
        thomasStream.reset()
    }

    async function reset() {
        thomasStream.reset()
        thomasStream.sendCommand(STREAMCOMMAND.STREAMCOMMAND_RUN)
        dispatch(appSlice.actions.reset())

        await thomasSoloActivity
            .moveToPosition(200, 50, 350)
            .frameIndex(0)
            .rotationEuler(0, Math.PI, 0)
            .promise()

        setMode(Mode.READY)
    }

    return (
        <div style={{ padding: "10px" }}>
            <Space direction="vertical">
                <Space>
                    <Button onClick={reset} disabled={mode !== Mode.REQUIRE_RESET}>
                        RESET
                    </Button>
                    <Button
                        onClick={mode === Mode.RUNNING ? stop : start}
                        disabled={mode === Mode.REQUIRE_RESET}
                    >
                        {mode === Mode.RUNNING ? "STOP" : "START"}
                    </Button>
                </Space>
            </Space>
        </div>
    )
}
