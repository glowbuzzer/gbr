import React, { useEffect, useState } from "react"
import { StyledTileContent } from "../../../libs/controls/src/util/styles/StyledTileContent"
import { DockTileDefinitionBuilder } from "@glowbuzzer/controls"
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
    useStream
} from "@glowbuzzer/store"
import { Button, Checkbox, Select, Space, Tag } from "antd"

const PUCK_TIME = 5000 // should be divisible by 8
const APPROACH_TIME = 500

enum Mode {
    REQUIRE_RESET,
    READY,
    RUNNING
}

export const DemoTile = () => {
    const { heartbeat, currentState } = useMachine()
    const threeAxisStream = useStream(0)
    const twoAxisStream = useStream(1)
    const threeAxisSoloApi = useSoloActivity(0)
    const twoAxisSoloApi = useSoloActivity(1)

    const points = usePoints()
    const [useSecondPoint, setUseSecondPoint] = useState(false)
    const [homePoint, setHomePoint] = useState(0)
    const [secondPoint, setSecondPoint] = useState(1)
    const [mode, setMode] = useState(Mode.REQUIRE_RESET)

    const streams = [twoAxisStream, threeAxisStream]

    useEffect(() => {
        if (currentState !== MachineState.OPERATION_ENABLED) {
            setMode(Mode.REQUIRE_RESET)
        }
    }, [currentState])

    const point_menu_items = points.map((point, index) => ({
        key: index,
        value: index,
        label: point.name
    }))

    function start() {
        setMode(Mode.RUNNING)

        const syncTrigger = {
            action: TRIGGERACTION.TRIGGERACTION_START,
            type: TRIGGERON.TRIGGERON_TICK,
            tick: {
                value: heartbeat + 250
            }
        }
        twoAxisStream.activity.enqueue(twoAxisStream.activity.dwell(0).addTrigger(syncTrigger))
        threeAxisStream.activity.enqueue(
            threeAxisStream.activity.dwell(PUCK_TIME / 2 / 4).addTrigger(syncTrigger)
        )
    }

    useEffect(() => {
        if (mode === Mode.RUNNING) {
            // add to the "puck" moves
            if (twoAxisStream.pending < 20) {
                // prettier-ignore
                twoAxisStream.activity.enqueue(
                    twoAxisStream.activity.moveArc(0, -300, 0).centre(0, 0, 0).direction(ARCDIRECTION.ARCDIRECTION_CW).duration(PUCK_TIME),
                    twoAxisStream.activity.moveArc(300, 0, 0).centre(0, 0, 0).direction(ARCDIRECTION.ARCDIRECTION_CCW).duration(PUCK_TIME)
                )
            }
            // add to the "frustum" moves
            if (threeAxisStream.pending < 20) {
                threeAxisStream.activity.enqueue(
                    threeAxisStream.activity
                        .moveToPosition(0, -300, 80)
                        .rotation(0, 1, 0, 0)
                        .frameIndex(0)
                        .configuration(0)
                        .duration(PUCK_TIME / 2 - APPROACH_TIME),
                    threeAxisStream.activity
                        .moveLine(0, 0, -70)
                        .relative()
                        .frameIndex(0)
                        .duration(APPROACH_TIME),
                    threeAxisStream.activity
                        .moveLine(0, 0, 50)
                        .relative()
                        .frameIndex(0)
                        .duration(APPROACH_TIME),
                    threeAxisStream.activity
                        .moveToPosition()
                        .setFromPoint(points[homePoint])
                        .configuration(0)
                        .duration(PUCK_TIME / 2 - APPROACH_TIME),
                    threeAxisStream.activity
                        .moveToPosition(300, 0, 80)
                        .rotationEuler(0, -Math.PI, Math.PI)
                        .frameIndex(0)
                        .configuration(0)
                        .duration(PUCK_TIME / 2 - APPROACH_TIME),
                    threeAxisStream.activity
                        .moveLine(0, 0, -70)
                        .relative()
                        .frameIndex(0)
                        .duration(APPROACH_TIME),
                    threeAxisStream.activity
                        .moveLine(0, 0, 50)
                        .relative()
                        .frameIndex(0)
                        .duration(APPROACH_TIME),
                    threeAxisStream.activity
                        .moveToPosition()
                        .setFromPoint(useSecondPoint ? points[secondPoint] : points[homePoint])
                        .configuration(0)
                        .duration(PUCK_TIME / 2 - APPROACH_TIME)
                )
            }
        }
    }, [mode, twoAxisStream.pending, threeAxisStream.pending])

    function stop() {
        setMode(Mode.REQUIRE_RESET)
        streams.forEach(s => {
            s.sendCommand(STREAMCOMMAND.STREAMCOMMAND_STOP)
            s.reset()
        })
    }

    function reset() {
        streams.forEach(s => {
            s.reset()
            s.sendCommand(STREAMCOMMAND.STREAMCOMMAND_RUN)
        })

        Promise.all([
            threeAxisSoloApi.moveToPosition().setFromPoint(points[homePoint]).promise(),
            twoAxisSoloApi.moveToPosition(300, 0, 0).promise()
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
                        <Tag>PUCK {STREAMSTATE[twoAxisStream.state].substring(12)}</Tag>
                        <Tag>ROBOT {STREAMSTATE[threeAxisStream.state].substring(12)}</Tag>
                    </Space>
                </Space>
                <Space>
                    <span>Home position</span>
                    <Select options={point_menu_items} value={homePoint} onChange={setHomePoint} />
                    {points.length > 1 && (
                        <>
                            <span>
                                <Checkbox
                                    checked={useSecondPoint}
                                    onChange={() => setUseSecondPoint(!useSecondPoint)}
                                >
                                    Use second point
                                </Checkbox>
                            </span>
                            <Select
                                options={point_menu_items}
                                value={secondPoint}
                                disabled={!useSecondPoint}
                                onChange={setSecondPoint}
                            />
                        </>
                    )}
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

export const DemoTileDefinition = DockTileDefinitionBuilder()
    .id("sync-controls")
    .name("Demo")
    .placement(1, 1)
    .render(() => <DemoTile />)
    .build()
