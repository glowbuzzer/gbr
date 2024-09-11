/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { createRoot } from "react-dom/client"
import { GlowbuzzerApp, SerialCommunicationsProvider } from "@glowbuzzer/controls"

import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { App } from "./app"

const root = createRoot(document.getElementById("root"))
root.render(
    <GlowbuzzerApp appName="ibt-fsoe-l" autoOpEnabled>
        <SerialCommunicationsProvider>
            <App />
        </SerialCommunicationsProvider>
    </GlowbuzzerApp>
)
