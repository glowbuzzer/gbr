/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode } from "react"

import {
    DockLayout,
    DockLayoutContext,
    DockPerspective,
    DockTileDefinitionBuilder,
    GlowbuzzerStandaloneApp,
    StatusTrayProvider,
    StyledDockLayout,
    useAppName,
    useDockContext,
    useDockLayoutContext,
    useDockViewMenu
} from "@glowbuzzer/controls"
import { createRoot } from "react-dom/client"

import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { Button, Menu } from "antd"

function SampleTile() {
    return <div>Sample Tile!</div>
}

const SampleTileDefinition = DockTileDefinitionBuilder()
    .id("sample")
    .name("Sample Tile")
    .render(() => <SampleTile />)
    .placement(0, 0)
    .build()

const AppMenu = () => {
    const viewMenu = useDockViewMenu()
    return <Menu mode="horizontal" selectedKeys={[]} items={[viewMenu]} />
}

function App() {
    const appName = useAppName()

    // create a single 'default' perspective
    const perspective: DockPerspective = {
        id: "default",
        name: "Default"
    }

    const context = useDockContext([SampleTileDefinition], [perspective], "default", appName)

    return (
        <StyledDockLayout>
            <StatusTrayProvider>
                <DockLayoutContext.Provider value={context}>
                    {/* You can add content like a menu above the dock layout */}
                    <AppMenu />
                    {/* The dock layout itself */}
                    <DockLayout />
                    {/* You can add content like a status bar below the dock layout here */}
                </DockLayoutContext.Provider>
            </StatusTrayProvider>
        </StyledDockLayout>
    )
}

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerStandaloneApp appName="standalone">
            <App />
        </GlowbuzzerStandaloneApp>
    </StrictMode>
)
