import ReactDOM from "react-dom"
import React, { StrictMode, useState } from "react"
import {
    ConnectTile,
    DigitalOutputsTile,
    GlowbuzzerApp,
    PreferencesDialog
} from "@glowbuzzer/controls"
import { MachineState, useConnection, useDigitalOutputState, useMachine } from "@glowbuzzer/store"
import { Tile } from "@glowbuzzer/controls"

import { Button, Switch } from "antd"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import styled from "styled-components"

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
    const [dout, setDout] = useDigitalOutputState(1)

    const { connected } = useConnection()
    const { currentState } = useMachine()

    function handle_state_change() {
        const new_state = !dout.setValue
        setDout(new_state, true)
    }

    return (
        <Tile title="Set Digital Out Example" controls={<PrefsButton />}>
            <p>This simple tutorial shows how to set a digital output.</p>
            <p>
                You need to connect to a running GBC before manipulating the digital out. Click the
                preferences button above to set the GBC websocket endpoint.
            </p>

            {connected && currentState !== MachineState.OPERATION_ENABLED && (
                <p>You need to enable operation before setting the digital output.</p>
            )}

            <p>Turn on my digital output</p>
            <Switch
                checked={dout.setValue}
                onChange={handle_state_change}
                disabled={!(connected && currentState === MachineState.OPERATION_ENABLED)}
            />
        </Tile>
    )
}

export function App() {
    return (
        <GlowbuzzerApp minWidth="0px">
            <StyledApp>
                <nav>
                    <ConnectTile />
                    <DigitalOutputsTile />
                </nav>
                <section>
                    <OscillatingMoveTile />
                </section>
            </StyledApp>
        </GlowbuzzerApp>
    )
}

ReactDOM.render(
    <StrictMode>
        <App />
    </StrictMode>,
    document.getElementById("root")
)
