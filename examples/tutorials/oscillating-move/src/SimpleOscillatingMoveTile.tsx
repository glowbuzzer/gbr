/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { useState } from "react"
import { MachineState, useConnection, useMachine, useSoloActivity } from "@glowbuzzer/store"
import { StyledTileContent } from "../../../../libs/controls/src/util/styles/StyledTileContent"
import { Button } from "antd"
import { DockTileDefinitionBuilder } from "@glowbuzzer/controls"

const SimpleOscillatingMoveTile = () => {
    const [complete, setComplete] = useState(false)
    const [pass, setPass] = useState(0)
    const soloActivity = useSoloActivity(0)
    const { connected } = useConnection()
    const { currentState } = useMachine()

    async function do_promise() {
        setPass(1)
        setComplete(false)
        await soloActivity.moveJoints([200, 0, 0]).promise()
        await soloActivity.moveJoints([0, 0, 0]).promise()
        setPass(2)
        await soloActivity.moveJoints([200, 0, 0]).promise()
        await soloActivity.moveJoints([0, 0, 0]).promise()
        setPass(0)
        setComplete(true)
    }

    return (
        <StyledTileContent>
            <p>
                This simple tutorial shows how to execute one move after another using the solo
                activity API and promises.
            </p>
            <p>
                You need to connect to a running GBC before starting the oscillating move. Click the
                preferences button above to set the GBC websocket endpoint.
            </p>

            {connected && currentState !== MachineState.OPERATION_ENABLED && (
                <p>You need to enable operation before starting the move.</p>
            )}

            <p>
                <Button
                    onClick={do_promise}
                    disabled={
                        pass > 0 || !(connected && currentState === MachineState.OPERATION_ENABLED)
                    }
                >
                    Start Move
                </Button>
            </p>

            <p>
                <b>{pass > 0 && <span>Performing pass {pass}</span>}</b>
            </p>
            <p>
                <b>{complete ? "Move complete. Click Start Move to repeat" : ""}</b>
            </p>
        </StyledTileContent>
    )
}

export const SimpleOscillatingMoveTileDefinition = DockTileDefinitionBuilder()
    .id("simple-oscillating-move")
    .name("Oscillating Move")
    .placement(1, 0)
    .render(SimpleOscillatingMoveTile)
    .build()
