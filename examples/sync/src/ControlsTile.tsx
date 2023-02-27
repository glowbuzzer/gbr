import React, { useEffect, useState } from "react"
import { StyledTileContent } from "../../../libs/controls/src/util/styles/StyledTileContent"
import { DockTileDefinitionBuilder } from "@glowbuzzer/controls"
import {
    ARCDIRECTION,
    STREAMCOMMAND,
    STREAMSTATE,
    TRIGGERACTION,
    TRIGGERON,
    useMachine,
    useStream
} from "@glowbuzzer/store"
import { Button } from "antd"

const PUCK_TIME = 5000 // should be divisible by 8
const APPROACH_TIME = 500

const ROBOT_REST_POSITION = [0, Math.PI / 4, Math.PI / 4, 0, 0, 0]
export const ControlsTile = () => {
    const { heartbeat } = useMachine()
    const threeAxisStream = useStream(0)
    const twoAxisStream = useStream(1)

    const [running, setRunning] = useState(false)

    const streams = [twoAxisStream, threeAxisStream]
    const idle = streams.every(s => s.state === STREAMSTATE.STREAMSTATE_IDLE)

    function start() {
        setRunning(true)

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
        if (running) {
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
                // prettier-ignore
                threeAxisStream.activity.enqueue(
                    threeAxisStream.activity
                        .moveToPosition(0, -300, 80)
                        .rotation(0,1,0,0)
                        .frameIndex(0)
                        .configuration(0)
                        .duration(PUCK_TIME /2 - APPROACH_TIME),
                    threeAxisStream.activity.moveLine(0, 0, -70).relative().frameIndex(0).duration(APPROACH_TIME),
                    threeAxisStream.activity.moveLine(0, 0, 50).relative().frameIndex(0).duration(APPROACH_TIME),
                    threeAxisStream.activity.moveJoints(ROBOT_REST_POSITION).duration(PUCK_TIME / 2 - APPROACH_TIME),
                    threeAxisStream.activity
                        .moveToPosition(300, 0, 80)
                        .rotationEuler(0, -Math.PI, Math.PI)
                        .frameIndex(0)
                        .configuration(0)
                        .duration(PUCK_TIME /2 - APPROACH_TIME),
                    threeAxisStream.activity.moveLine(0, 0, -70).relative().frameIndex(0).duration(APPROACH_TIME),
                    threeAxisStream.activity.moveLine(0, 0, 50).relative().frameIndex(0).duration(APPROACH_TIME),
                    threeAxisStream.activity.moveJoints(ROBOT_REST_POSITION).duration(PUCK_TIME / 2 - APPROACH_TIME),
                    // threeAxisStream.activity.moveLine(-50, 0, 20).duration(PUCK_TIME / 2 - APPROACH_TIME),
                    // threeAxisStream.activity.moveLine(-50, 0, 2).duration(APPROACH_TIME),
                    // threeAxisStream.activity.moveLine(-50, 0, 20).duration(APPROACH_TIME),
                    // threeAxisStream.activity.moveLine(0, -50, 30).duration(PUCK_TIME / 2 - APPROACH_TIME)
                )
            } else {
                // console.log("TOO MANY PENDING ITEMS", threeAxisStream.pending)
            }
        }
    }, [running, twoAxisStream.pending, threeAxisStream.pending])

    function stop() {
        setRunning(false)
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
        setRunning(false)

        threeAxisStream.activity.enqueue(threeAxisStream.activity.moveJoints(ROBOT_REST_POSITION))
        twoAxisStream.activity.enqueue(twoAxisStream.activity.moveToPosition(300, 0, 0))
    }

    function queue() {
        threeAxisStream.activity.enqueue(
            ...Array.from({ length: 100 }).map(() => threeAxisStream.activity.dwell(29))
        )
        twoAxisStream.activity.enqueue(
            ...Array.from({ length: 100 }).map(() => threeAxisStream.activity.dwell(37))
        )
    }

    return (
        <StyledTileContent>
            <div>{(heartbeat / 4 || 0).toFixed(0)}</div>
            <div>
                <Button onClick={reset} disabled={running}>
                    RESET
                </Button>
                <Button onClick={running ? stop : start} disabled={!running && !idle}>
                    {running ? "STOP" : "START"}
                </Button>
                <Button onClick={queue}>TEST</Button>
            </div>
            <div>{STREAMSTATE[twoAxisStream.state]}</div>
            <div>{STREAMSTATE[threeAxisStream.state]}</div>
        </StyledTileContent>
    )
}

export const ControlsTileDefinition = DockTileDefinitionBuilder()
    .id("sync-controls")
    .name("Controls")
    .placement(1, 1)
    .render(() => <ControlsTile />)
    .build()
