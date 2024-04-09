/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { createRoot } from "react-dom/client"
import { GlowbuzzerApp, SerialCommunicationsProvider } from "@glowbuzzer/controls"

import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { config } from "./config"
import { App } from "./app"
import {
    FlowGbdbFacetSlice,
    FramesGbdbFacetSlice,
    GbdbConfiguration,
    PointsGbdbFacetSlice,
    ToolsGbdbFacetSlice
} from "@glowbuzzer/store"

const persistence: GbdbConfiguration = {
    // remoteDb: "http://localhost:5984",
    facets: {
        project: {
            dependencies: ["cell"],
            slices: [FlowGbdbFacetSlice, PointsGbdbFacetSlice]
        },
        cell: {
            slices: [FramesGbdbFacetSlice, ToolsGbdbFacetSlice]
        }
    }
}

const root = createRoot(document.getElementById("root"))
root.render(
    <GlowbuzzerApp
        appName="awtube-l2"
        configuration={config}
        persistenceConfiguration={persistence}
    >
        <SerialCommunicationsProvider>
            <App />
        </SerialCommunicationsProvider>
    </GlowbuzzerApp>
)
