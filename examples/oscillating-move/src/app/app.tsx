import styled from "styled-components"
import { ConnectTile, GlowbuzzerApp, PreferencesDialog } from "@glowbuzzer/controls"
import { SimpleDroTile } from "../../../../apps/cartmc/src/app/tiles/SimpleDroTile"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import React, { useState } from "react"
import { Button } from "antd"
import { MachineState, useConnection, useMachine, useSoloActivity } from "@glowbuzzer/store"
import { Tile } from "@glowbuzzer/layout"

const StyledApp = styled.div`
    padding: 20px;
    display: flex;
    gap: 20px;

    nav,
    section {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    section {
        flex-grow: 1;
        max-width: 500px;
    }
`

const PrefsButton = () => {
    const [visible, setVisible] = useState(false)

    return (
        <div>
            <Button onClick={() => setVisible(true)}>Preferences</Button>
            <PreferencesDialog visible={visible} onClose={() => setVisible(false)} />
        </div>
    )
}

const OscillatingMoveTile = () => {
    const [complete, setComplete] = useState(false)
    const [pass, setPass] = useState(0)
    const soloActivity = useSoloActivity(0)
    const { connected } = useConnection()
    const { currentState } = useMachine()

    async function do_promise() {
        setPass(1)
        setComplete(false)
        await soloActivity.moveJoints([300, 0, 0]).promise()
        await soloActivity.moveJoints([0, 0, 0]).promise()
        setPass(2)
        await soloActivity.moveJoints([300, 0, 0]).promise()
        await soloActivity.moveJoints([0, 0, 0]).promise()
        setPass(0)
        setComplete(true)
    }

    return (
        <Tile title="Oscillating Move Tutorial" controls={<PrefsButton />}>
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
                    disabled={!(connected && currentState === MachineState.OPERATION_ENABLED)}
                >
                    Start Move
                </Button>
            </p>

            <p>
                <b>{pass > 0 && <span>Pass {pass}</span>}</b>
            </p>
            <p>
                <b>{complete ? "Move complete" : ""}</b>
            </p>
        </Tile>
    )
}

export function App() {
    return (
        <GlowbuzzerApp minWidth="0px">
            <StyledApp>
                <nav>
                    <ConnectTile />
                    <SimpleDroTile />
                </nav>
                <section>
                    <OscillatingMoveTile />
                </section>
            </StyledApp>
        </GlowbuzzerApp>
    )
}

export default App
