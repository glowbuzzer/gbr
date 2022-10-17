/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode } from "react"

import {
    GlowbuzzerApp,
    GlowbuzzerDockComponent,
    GlowbuzzerDockComponentDefinition,
    GlowbuzzerDockLayout,
    GlowbuzzerDockLayoutProvider,
    GlowbuzzerDockViewMenu
} from "@glowbuzzer/controls"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import { JointSpinnersTile } from "./JointSpinnersTile"

import "react-grid-layout/css/styles.css"
import "flexlayout-react/style/light.css"

import { GCodeContextProvider, SoloActivityApi } from "@glowbuzzer/store"
import { createRoot } from "react-dom/client"
import { Button, Space } from "antd"

const CUSTOM_COMPONENTS: GlowbuzzerDockComponentDefinition[] = [
    {
        id: "spinners",
        name: "Joint Spinners",
        factory: () => <JointSpinnersTile />,
        defaultPlacement: {
            // underneath toolpath tile
            column: 1,
            row: 1
        }
    }
]

function App() {
    function handleToolChange(
        kinematicsConfigurationIndex: number,
        current: number,
        next: number,
        api: SoloActivityApi
    ) {
        return [api.moveToPosition(null, null, 50), api.setToolOffset(next), api.dwell(500)]
    }

    return (
        <GCodeContextProvider value={{ handleToolChange }}>
            <GlowbuzzerDockLayoutProvider
                appName="generic"
                components={CUSTOM_COMPONENTS}
                exclude={[GlowbuzzerDockComponent.ANALOG_INPUTS]}
            >
                <div>
                    <Space>
                        <Button>OTHER MENUS HERE</Button>
                        <GlowbuzzerDockViewMenu />
                    </Space>
                </div>
                <GlowbuzzerDockLayout />
            </GlowbuzzerDockLayoutProvider>
        </GCodeContextProvider>
    )
}

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp>
            <App />
        </GlowbuzzerApp>
    </StrictMode>
)
