/*
 * Copyright (c) 2022-2023. Glowbuzzer. All rights reserved
 */

import React, { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./App"
import { config } from "./config"
import { GlowbuzzerApp } from "@glowbuzzer/controls"

import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { Demo } from "./Demo"

const root = createRoot(document.getElementById("root"))
root.render(
    /*
    <Demo />
*/
    <GlowbuzzerApp appName="cutter" configuration={config}>
        <App />
    </GlowbuzzerApp>
)
