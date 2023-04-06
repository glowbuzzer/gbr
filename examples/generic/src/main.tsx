/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode } from "react"

import {
    DockLayout,
    DockLayoutProvider,
    GlowbuzzerApp,
    GlowbuzzerTileDefinitionList
} from "@glowbuzzer/controls"

import { JointSpinnersTileDefinition } from "../../util/JointSpinnersTile"
import { ActivityApi, GCodeContextProvider } from "@glowbuzzer/store"
import { createRoot } from "react-dom/client"

import { ExampleAppMenu } from "../../util/ExampleAppMenu"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"

function App() {
    function handleToolChange(
        kinematicsConfigurationIndex: number,
        current: number,
        next: number,
        api: ActivityApi
    ) {
        return [api.moveToPosition(null, null, 50), api.setToolOffset(next), api.dwell(500)]
    }

    return (
        <GCodeContextProvider value={{ handleToolChange }}>
            <DockLayoutProvider
                tiles={[
                    ...GlowbuzzerTileDefinitionList, // standard components
                    JointSpinnersTileDefinition
                ]}
            >
                <ExampleAppMenu />
                <DockLayout />
            </DockLayoutProvider>
        </GCodeContextProvider>
    )
}

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp appName="generic">
            <App />
        </GlowbuzzerApp>
    </StrictMode>
)
