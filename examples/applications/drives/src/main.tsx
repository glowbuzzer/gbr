/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { createRoot } from "react-dom/client"
import React, { StrictMode } from "react"
import { GlowbuzzerApp } from "@glowbuzzer/controls"
import { App } from "./app"
import { config } from "./config"
import { SerialCommunicationsProvider } from "@glowbuzzer/controls"
import { GbdbConfiguration, JointsGbdbFacetSlice } from "@glowbuzzer/store"

const persistence: GbdbConfiguration = {
    // remoteDb: "http://localhost:5984",
    facets: {
        project: {
            slices: [JointsGbdbFacetSlice]
        }
    }
}

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp
            appName="drives"
            configuration={config}
            persistenceConfiguration={persistence}
        >
            <SerialCommunicationsProvider>
                <App />
            </SerialCommunicationsProvider>
        </GlowbuzzerApp>
    </StrictMode>
)
