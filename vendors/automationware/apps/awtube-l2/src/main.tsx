/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { createRoot } from "react-dom/client"
import {
    ConnectionConfiguration,
    GlowbuzzerApp,
    RoleBuilder,
    SerialCommunicationsProvider,
    UserModel
} from "@glowbuzzer/controls"

import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { App } from "./app"
import {
    FlowGbdbFacetSlice,
    FramesGbdbFacetSlice,
    GbdbConfiguration,
    PointsGbdbFacetSlice,
    ToolsGbdbFacetSlice
} from "@glowbuzzer/store"
import { SimpleMoveCapability } from "./SimpleMoveCapabilities"

// console.log(config)

const persistence: GbdbConfiguration = {
    facets: {
        project: {
            dependencies: ["cell"],
            slices: [FlowGbdbFacetSlice, PointsGbdbFacetSlice]
        },
        cell: {
            singleton: true,
            autoSave: true,
            slices: [
                FramesGbdbFacetSlice,
                PointsGbdbFacetSlice,
                ToolsGbdbFacetSlice,
                FlowGbdbFacetSlice
            ]
        }
    }
}

const userModel: UserModel = {
    // set an anonymous role to allow anonymous users
    anonymousRole: "anon",

    roles: [
        // add the default admin role capabilities
        RoleBuilder.defaultAdminRole()
            .addCapabilities(SimpleMoveCapability.READ, SimpleMoveCapability.WRITE)
            .build(),

        // add an empty anonymous role
        new RoleBuilder("anon").addCapabilities(SimpleMoveCapability.READ).build()
    ]
}

/**
 * Configuration for the connection to the remote services. These need to
 * be in the client app so that Vite can replace the values at build time.
 */
const connectionConfiguration: ConnectionConfiguration = {
    remotePouchDb: false,
    // @ts-ignore
    hostname: import.meta.env.VITE_REMOTE_HOST,
    // @ts-ignore
    manualConnect: import.meta.env.VITE_MANUAL_CONNECT === "true"
}

const root = createRoot(document.getElementById("root"))
root.render(
    <GlowbuzzerApp
        appName="awtube-l2"
        persistenceConfiguration={persistence}
        autoOpEnabled
        connectionConfiguration={connectionConfiguration}
        userModel={userModel}
    >
        <SerialCommunicationsProvider>
            <App />
        </SerialCommunicationsProvider>
    </GlowbuzzerApp>
)
