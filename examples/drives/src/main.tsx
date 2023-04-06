/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { createRoot } from "react-dom/client"
import React, { StrictMode } from "react"
import { GlowbuzzerApp } from "@glowbuzzer/controls"
import { ConnectionProvider } from "../../../libs/controls/src/app/ConnectionProvider"
import { App } from "./app"

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp appName="drives">
            <App />
        </GlowbuzzerApp>
    </StrictMode>
)
