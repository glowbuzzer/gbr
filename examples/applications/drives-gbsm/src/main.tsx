/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { createRoot } from "react-dom/client"
import React, { StrictMode } from "react"
import { GlowbuzzerApp, SerialCommunicationsProvider } from "@glowbuzzer/controls"
import { App } from "./app"

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp
            appName="drives-gbdm"
            stepMasterMode
            // If you want to use local config and push it, uncomment the following line
            // configuration={config}
        >
            <SerialCommunicationsProvider>
                <App />
            </SerialCommunicationsProvider>
        </GlowbuzzerApp>
    </StrictMode>
)
