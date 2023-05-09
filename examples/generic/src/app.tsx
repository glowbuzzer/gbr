/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { ActivityApi, GCodeContextProvider } from "@glowbuzzer/store"
import { DockLayout, DockLayoutProvider, GlowbuzzerTileDefinitionList } from "@glowbuzzer/controls"
import { ExampleAppMenu } from "../../util/ExampleAppMenu"
import React from "react"

export function App() {
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
                    ...GlowbuzzerTileDefinitionList // standard components
                ]}
            >
                <ExampleAppMenu />
                <DockLayout />
            </DockLayoutProvider>
        </GCodeContextProvider>
    )
}
