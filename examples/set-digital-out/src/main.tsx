/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import {
    DockLayout,
    DockLayoutProvider,
    GlowbuzzerApp,
    GlowbuzzerTileDefinitions
} from "@glowbuzzer/controls"
import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp>
            <DockLayoutProvider
                appName={"set-digital-out"}
                tiles={[
                    GlowbuzzerTileDefinitions.CONNECT,
                    GlowbuzzerTileDefinitions.DIGITAL_OUTPUTS
                ]}
            >
                <DockLayout />
            </DockLayoutProvider>
        </GlowbuzzerApp>
    </StrictMode>
)
