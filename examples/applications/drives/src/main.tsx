/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { createRoot } from "react-dom/client"
import React, { StrictMode } from "react"
import { GlowbuzzerApp } from "@glowbuzzer/controls"
import { App } from "./app"
import { config } from "./config"

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp appName="drives" configuration={config}>
            <App />
        </GlowbuzzerApp>
    </StrictMode>
)
