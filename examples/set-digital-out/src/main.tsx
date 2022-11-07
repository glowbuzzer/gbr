/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import {
    DockLayout,
    DockLayoutProvider,
    DockTileDefinitionBuilder,
    GlowbuzzerApp,
    GlowbuzzerTileDefinitions
} from "@glowbuzzer/controls"
import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { ExampleTileContent } from "../../util/styles"
import { Space, Switch } from "antd"
import { useDigitalOutputState } from "@glowbuzzer/store"
import { ExampleAppMenu } from "../../util/ExampleAppMenu"

const ToggleDigitalOutputTile = () => {
    const [dout, setDout] = useDigitalOutputState(1) // use the 2nd digital output

    function handle_state_change() {
        const new_state = !dout.setValue // toggle
        setDout(new_state, true) // set new state (and override any existing state)
    }

    return (
        <ExampleTileContent>
            <Space>
                Toggle my digital output
                <Switch checked={dout.setValue} onChange={handle_state_change} />
            </Space>
        </ExampleTileContent>
    )
}

const toggleDigitalOutputTileDefinition = DockTileDefinitionBuilder()
    .id("toggle-digital-output")
    .name("Toggle Digital Output")
    .placement(1, 0)
    .render(() => <ToggleDigitalOutputTile />)
    .build()

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp>
            <DockLayoutProvider
                appName={"set-digital-out"}
                tiles={[GlowbuzzerTileDefinitions.CONNECT, toggleDigitalOutputTileDefinition]}
            >
                <ExampleAppMenu title="Toggle Digital Output" />
                <DockLayout />
            </DockLayoutProvider>
        </GlowbuzzerApp>
    </StrictMode>
)
