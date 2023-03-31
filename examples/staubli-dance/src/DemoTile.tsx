/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React, { useEffect, useState } from "react"
import { StyledTileContent } from "../../../libs/controls/src/util/styles/StyledTileContent"
import {
    ARCDIRECTION,
    MachineState,
    STREAMCOMMAND,
    STREAMSTATE,
    TRIGGERACTION,
    TRIGGERON,
    useMachine,
    usePoints,
    useSoloActivity,
    useStream,
    useTrace
} from "@glowbuzzer/store"
import { Button, Space, Tag } from "antd"

enum Mode {
    REQUIRE_RESET,
    READY,
    RUNNING
}

export const DemoTile = () => {
    const { heartbeat, currentState } = useMachine()
    const thomasStream = useStream(0)
    const thomasSoloActivity = useSoloActivity(0)
    const thomasTrace = useTrace(0)

    const lucyStream = useStream(1)
    const lucySoloActivity = useSoloActivity(1)
    const lucyTrace = useTrace(1)

    const points = usePoints()

    const [mode, setMode] = useState(Mode.REQUIRE_RESET)

    const streams = [lucyStream, thomasStream]

    useEffect(() => {
        if (currentState !== MachineState.OPERATION_ENABLED) {
            setMode(Mode.REQUIRE_RESET)
        }
    }, [currentState])

    function start() {
        setMode(Mode.RUNNING)

        const syncTrigger = {
            action: TRIGGERACTION.TRIGGERACTION_START,
            type: TRIGGERON.TRIGGERON_TICK,
            tick: {
                value: heartbeat + 250
            }
        }
        thomasTrace.reset()
        lucyTrace.reset()
        thomasTrace.disable()
        lucyTrace.disable()

        Promise.all([
            thomasStream.activity.send(
                thomasStream.activity.dwell(0).addTrigger(syncTrigger).promise(),
                thomasStream.activity
                    .moveArc()
                    .setFromPoint(points[2])
                    .frameIndex(1)
                    .centre(300, 0, 200)
                    .direction(ARCDIRECTION.ARCDIRECTION_CCW)
                    .promise(),
                thomasStream.activity
                    .moveLine(100, 0, 0)
                    .relative(true)
                    .promise()
                    .then(() => thomasTrace.enable()),
                // first traced line segment
                thomasStream.activity.moveLine(0, 0, -150).duration(1500).relative(true).promise(),
                // second traced line segment
                thomasStream.activity
                    .moveLine(0, -150, 0)
                    .duration(1500)
                    .relative(true)
                    .promise()
                    .then(() => thomasTrace.disable()),
                thomasStream.activity
                    .moveToPosition()
                    .setFromPoint(points[2])
                    .frameIndex(1)
                    .promise()
            ),
            lucyStream.activity.send(
                lucyStream.activity.dwell(0).addTrigger(syncTrigger).promise(),
                lucyStream.activity
                    .moveArc()
                    .setFromPoint(points[2])
                    .frameIndex(2)
                    .centre(300, 0, 200)
                    .direction(ARCDIRECTION.ARCDIRECTION_CCW)
                    .promise(),
                lucyStream.activity
                    .moveLine(100, 0, 0)
                    .relative(true)
                    .promise()
                    .then(() => lucyTrace.enable()),
                // synchronised traced arc segment
                lucyStream.activity
                    .moveArc(350, 100, 100)
                    .duration(3000)
                    .centre(350, 0, 100)
                    .rotation(0.70710678118654757, 0.70710678118654757, 0, 0)
                    .plane(0, 0.70710678118654757, 0, 0.70710678118654757)
                    .direction(ARCDIRECTION.ARCDIRECTION_CCW)
                    .frameIndex(2)
                    .promise()
                    .then(() => lucyTrace.disable()),
                lucyStream.activity.moveToPosition().setFromPoint(points[2]).frameIndex(2).promise()
            )
        ]).then(() => {
            streams.forEach(s => {
                s.reset()
                s.sendCommand(STREAMCOMMAND.STREAMCOMMAND_RUN)
            })

            setMode(Mode.REQUIRE_RESET)
        })
    }

    function stop() {
        setMode(Mode.REQUIRE_RESET)
        streams.forEach(s => {
            s.sendCommand(STREAMCOMMAND.STREAMCOMMAND_STOP)
            s.reset()
        })
    }

    async function reset() {
        thomasTrace.reset()
        lucyTrace.reset()
        thomasTrace.disable()
        lucyTrace.disable()

        streams.forEach(s => {
            s.reset()
            s.sendCommand(STREAMCOMMAND.STREAMCOMMAND_RUN)
        })

        return Promise.all([
            thomasSoloActivity.moveToPosition().setFromPoint(points[0]).frameIndex(1).promise(),
            lucySoloActivity.moveToPosition().setFromPoint(points[0]).frameIndex(2).promise()
        ]).then(() => {
            setMode(Mode.READY)
        })
    }

    return (
        <StyledTileContent>
            <Space direction="vertical">
                <Space>
                    <span>Timecode</span>
                    <span>{(heartbeat / 4 || 0).toFixed(0)}</span>
                    <Space>
                        <Tag>THOMAS {STREAMSTATE[lucyStream.state].substring(12)}</Tag>
                        <Tag>LUCY {STREAMSTATE[thomasStream.state].substring(12)}</Tag>
                    </Space>
                </Space>
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
        </StyledTileContent>
    )
}
