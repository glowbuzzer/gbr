/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import {
    CartesianDroTileDefinition,
    ConnectTileDefinition,
    DockLayout,
    DockLayoutProvider,
    GlowbuzzerApp,
    TelemetryTileDefinition
} from "@glowbuzzer/controls"
import { ExampleAppMenu } from "../../../util/ExampleAppMenu"
import { config } from "./config"
import { SimpleOscillatingMoveTileDefinition } from "./SimpleOscillatingMoveTile"

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp appName="oscillating-move" configuration={config}>
            <DockLayoutProvider
                tiles={[
                    ConnectTileDefinition,
                    CartesianDroTileDefinition,
                    SimpleOscillatingMoveTileDefinition,
                    { ...TelemetryTileDefinition, defaultPlacement: { column: 1, row: 1 } }
                ]}
            >
                <ExampleAppMenu />
                <DockLayout />
            </DockLayoutProvider>
        </GlowbuzzerApp>
    </StrictMode>
)
