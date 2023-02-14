import React from "react"
import { StyledTileContent } from "../../../libs/controls/src/util/styles/StyledTileContent"
import { DockTileDefinitionBuilder } from "@glowbuzzer/controls"
import {
    TRIGGERACTION,
    TRIGGERON,
    useMachine,
    useSoloActivity,
    useStateMachine
} from "@glowbuzzer/store"
import { Button } from "antd"
import { useState } from "react"

export const ControlsTile = () => {
    const { heartbeat } = useMachine()
    const api = useSoloActivity(0)
    const [busy, setBusy] = useState(false)
    const [run, setRun] = useState(false)

    // const { currentState, previousState, userData } = useStateMachine(
    //     {
    //         idle: {
    //             transitions: {
    //                 forward: run
    //             }
    //         },
    //         forward: {
    //             enter() {
    //                 console.log("enter forward")
    //                 return delay(
    //                     {
    //                         state: "back",
    //                         data: "going back now"
    //                     },
    //                     2000
    //                 )
    //             },
    //             exit() {
    //                 setForwardCompletedCount(count => count + 1)
    //             },
    //             transitions: {
    //                 idle: !run
    //             }
    //         },
    //         back: {
    //             enter() {
    //                 console.log("enter backward")
    //                 return delay(
    //                     {
    //                         state: "forward",
    //                         data: "going forward now"
    //                     },
    //                     2000
    //                 )
    //             },
    //             transitions: {
    //                 idle: !run
    //             }
    //         }
    //     },
    //     "idle",
    //     [run]
    // )

    function move_start() {
        setBusy(true)
        return api
            .moveToPosition(20, 0, 20)
            .addTrigger({
                action: TRIGGERACTION.TRIGGERACTION_START,
                type: TRIGGERON.TRIGGERON_TICK,
                tick: {
                    value: heartbeat + 250
                }
            })
            .promise()
            .then(() => setBusy(false))
    }

    function reset() {}

    return (
        <StyledTileContent>
            <div>{(heartbeat / 4 || 0).toFixed(0)}</div>
            <div>
                <Button onClick={reset} disabled={busy}>
                    RESET
                </Button>
                <Button onClick={move_start} disabled={busy}>
                    START 1
                </Button>
            </div>
        </StyledTileContent>
    )
}

export const ControlsTileDefinition = DockTileDefinitionBuilder()
    .id("sync-controls")
    .name("Controls")
    .placement(1, 1)
    .render(() => <ControlsTile />)
    .build()
