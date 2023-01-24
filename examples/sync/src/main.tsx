/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode, Suspense } from "react"

import {
    DockLayout,
    DockLayoutProvider,
    DockTileDefinitionBuilder,
    Frustum,
    GlowbuzzerApp,
    GlowbuzzerTileDefinitionList,
    ThreeDimensionalSceneTile,
    ThreeDimensionalSceneTileDefinition,
    TrackPosition
} from "@glowbuzzer/controls"
import { GCodeContextProvider, SoloActivityApi } from "@glowbuzzer/store"
import { createRoot } from "react-dom/client"

import { ExampleAppMenu } from "../../util/ExampleAppMenu"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { ControlsTileDefinition } from "./ControlsTile"

const CustomSceneTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return (
            <ThreeDimensionalSceneTile>
                <TrackPosition kinematicsConfigurationIndex={0}>
                    <Frustum />
                </TrackPosition>
                <TrackPosition kinematicsConfigurationIndex={1}>
                    <Frustum />
                </TrackPosition>
            </ThreeDimensionalSceneTile>
        )
    })
    .build()

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
            <DockLayoutProvider
                tiles={[
                    ...GlowbuzzerTileDefinitionList.filter(
                        t => t.id !== CustomSceneTileDefinition.id
                    ), // standard components minus the 3d scene
                    CustomSceneTileDefinition,
                    ControlsTileDefinition
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
