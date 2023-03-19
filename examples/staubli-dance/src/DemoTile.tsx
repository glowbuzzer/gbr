/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React, { useEffect, useState } from "react"
import { StyledTileContent } from "../../../libs/controls/src/util/styles/StyledTileContent"
import { DockTileDefinitionBuilder } from "@glowbuzzer/controls"
import {
    ARCDIRECTION,
    MachineState,
    POSITIONREFERENCE,
    STREAMCOMMAND,
    STREAMSTATE,
    TRIGGERACTION,
    TRIGGERON,
    useMachine,
    usePoints,
    useSoloActivity,
    useStream
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
    const lucyStream = useStream(1)
    const thomasSoloActivity = useSoloActivity(0)
    const lucySoloActivity = useSoloActivity(1)

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
        thomasStream.activity.enqueue(thomasStream.activity.dwell(0).addTrigger(syncTrigger))
        lucyStream.activity.enqueue(lucyStream.activity.dwell(0).addTrigger(syncTrigger))
    }

    useEffect(() => {
        /*
        if (mode === Mode.RUNNING) {
            // add to the "puck" moves
            if (lucyStream.pending < 20) {
                // prettier-ignore
                lucyStream.activity.enqueue(
                    lucyStream.activity.moveArc(0, -300, 0).centre(0, 0, 0).direction(ARCDIRECTION.ARCDIRECTION_CW).duration(PUCK_TIME),
                    lucyStream.activity.moveArc(300, 0, 0).centre(0, 0, 0).direction(ARCDIRECTION.ARCDIRECTION_CCW).duration(PUCK_TIME)
                )
            }
            // add to the "frustum" moves
            if (thomasStream.pending < 20) {
                thomasStream.activity.enqueue(
                    thomasStream.activity
                        .moveToPosition(0, -300, 80)
                        .rotation(0, 1, 0, 0)
                        .frameIndex(0)
                        .configuration(0)
                        .duration(PUCK_TIME / 2 - APPROACH_TIME),
                    thomasStream.activity
                        .moveLine(0, 0, -70)
                        .relative()
                        .frameIndex(0)
                        .duration(APPROACH_TIME),
                    thomasStream.activity
                        .moveLine(0, 0, 50)
                        .relative()
                        .frameIndex(0)
                        .duration(APPROACH_TIME),
                    thomasStream.activity
                        .moveToPosition()
                        .setFromPoint(points[homePoint])
                        .configuration(0)
                        .duration(PUCK_TIME / 2 - APPROACH_TIME),
                    thomasStream.activity
                        .moveToPosition(300, 0, 80)
                        .rotationEuler(0, -Math.PI, Math.PI)
                        .frameIndex(0)
                        .configuration(0)
                        .duration(PUCK_TIME / 2 - APPROACH_TIME),
                    thomasStream.activity
                        .moveLine(0, 0, -70)
                        .relative()
                        .frameIndex(0)
                        .duration(APPROACH_TIME),
                    thomasStream.activity
                        .moveLine(0, 0, 50)
                        .relative()
                        .frameIndex(0)
                        .duration(APPROACH_TIME),
                    thomasStream.activity
                        .moveToPosition()
                        .setFromPoint(useSecondPoint ? points[secondPoint] : points[homePoint])
                        .configuration(0)
                        .duration(PUCK_TIME / 2 - APPROACH_TIME)
                )
            }
        }
*/
    }, [mode, lucyStream.pending, thomasStream.pending])

    function stop() {
        setMode(Mode.REQUIRE_RESET)
        streams.forEach(s => {
            s.sendCommand(STREAMCOMMAND.STREAMCOMMAND_STOP)
            s.reset()
        })
    }

    async function reset() {
        streams.forEach(s => {
            s.reset()
            s.sendCommand(STREAMCOMMAND.STREAMCOMMAND_RUN)
        })

        await thomasSoloActivity.moveToPosition().setFromPoint(points[0]).frameIndex(1).promise()
        await thomasSoloActivity
            .moveArc()
            .setFromPoint(points[2])
            .frameIndex(1)
            .centre(300, 0, 200)
            .direction(ARCDIRECTION.ARCDIRECTION_CCW)
            .promise()

        // return Promise.all([
        //     thomasSoloActivity.moveToPosition().setFromPoint(points[0]).frameIndex(1).promise(),
        //     lucySoloActivity.moveToPosition().setFromPoint(points[0]).frameIndex(2).promise()
        //     // lucySoloActivity.moveToPosition(300, 0, 0).promise()
        // ]).then(() => {
        //     setMode(Mode.READY)
        // })
    }

    async function move_a() {
        await thomasSoloActivity
            .moveToPosition(300, 100, 250)
            .rotationEuler(Math.PI / 2, Math.PI / 4, 0)
            .configuration(0)
            .frameIndex(1)
            .promise()
    }

    async function move_b(optimal = false) {
        await thomasSoloActivity
            .moveToPosition(300, -100, 250)
            .rotationEuler(-Math.PI / 2, 0, 0)
            .configuration(0)
            .frameIndex(1)
            .params({
                optimizeJointDistance: optimal
            })
            .promise()
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
                <Space>
                    <Button onClick={move_a}>Move Thomas Point A</Button>
                    <Button onClick={() => move_b()}>Move Thomas Point B</Button>
                    <Button onClick={() => move_b(true)}>Move Thomas Point B (optimized)</Button>
                </Space>
            </Space>
        </StyledTileContent>
    )
}

export const DemoTileDefinition = DockTileDefinitionBuilder()
    .id("sync-controls")
    .name("Demo")
    .placement(1, 1)
    .render(() => <DemoTile />)
    .build()
