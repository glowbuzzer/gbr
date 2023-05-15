/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import {
    ConnectTileDefinition,
    DockLayout,
    DockLayoutProvider,
    DockTileDefinitionBuilder,
    GlowbuzzerApp
} from "@glowbuzzer/controls"
import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { ExampleAppMenu } from "../../../util/ExampleAppMenu"
import { GlowbuzzerConfig, GlowbuzzerMinimalConfig } from "../../../../libs/store/src"
import { ToggleDigitalOutputTile } from "./ToggleDigitalOutputTile"

const toggleDigitalOutputTileDefinition = DockTileDefinitionBuilder()
    .id("toggle-digital-output")
    .name("Toggle Digital Output")
    .placement(1, 0)
    .render(() => <ToggleDigitalOutputTile />)
    .build()

const config: GlowbuzzerConfig = {
    ...GlowbuzzerMinimalConfig,
    machine: [
        {
            name: "My Machine",
            busCycleTime: 4
        }
    ],
    dout: [
        {
            name: "My Digital Output"
        }
    ]
}

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp appName={"set-digital-out"} configuration={config}>
            <DockLayoutProvider tiles={[ConnectTileDefinition, toggleDigitalOutputTileDefinition]}>
                <ExampleAppMenu title="Toggle Digital Output" />
                <DockLayout />
            </DockLayoutProvider>
        </GlowbuzzerApp>
    </StrictMode>
)
