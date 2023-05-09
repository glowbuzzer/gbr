/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode } from "react"

import { GlowbuzzerApp } from "@glowbuzzer/controls"
import { createRoot } from "react-dom/client"
import { config } from "./config"
import { App } from "./app"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp appName="generic" configuration={config}>
            <App />
        </GlowbuzzerApp>
    </StrictMode>
)
