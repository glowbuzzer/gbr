/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import {
    DockLayout,
    DockLayoutProvider,
    GlowbuzzerApp,
    GlowbuzzerTileDefinitions
} from "@glowbuzzer/controls"
import { OscillatingMoveTileDefinition } from "./OscillatingMoveTile"
import { ExampleAppMenu } from "../../util/ExampleAppMenu"

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp>
            <DockLayoutProvider
                appName={"oscillating-move"}
                tiles={[
                    GlowbuzzerTileDefinitions.CONNECT,
                    GlowbuzzerTileDefinitions.CARTESIAN_DRO,
                    OscillatingMoveTileDefinition
                ]}
            >
                <ExampleAppMenu />
                <DockLayout />
            </DockLayoutProvider>
        </GlowbuzzerApp>
    </StrictMode>
)
