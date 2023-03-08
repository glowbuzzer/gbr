/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode, Suspense } from "react"

import {
    ConnectTileDefinition,
    DockLayout,
    DockLayoutProvider,
    DockTileDefinitionBuilder,
    Frustum,
    GCodeTile,
    GCodeTileDefinition,
    GlowbuzzerApp,
    GlowbuzzerTileDefinitionList,
    RobotKinematicsChainElement,
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
import { DemoTileDefinition } from "./DemoTile"
import { Puck } from "./Puck"
import { StaubliRobot } from "./StaubliRobot"

const CustomSceneTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return (
            <ThreeDimensionalSceneTile hidePreview hideTrace>
                <Suspense fallback={null}>
                    <StaubliRobot />
                </Suspense>
                <TrackPosition kinematicsConfigurationIndex={1}>
                    <Puck />
                </TrackPosition>
            </ThreeDimensionalSceneTile>
        )
    })
    .build()

const GCodeTileDefinition3Axis = DockTileDefinitionBuilder(GCodeTileDefinition)
    .render(() => {
        return <GCodeTile kinematicsConfigurationIndex={0} />
    })
    .name("GCode 3-Axis")
    .id("gcode-3-axis")
    .build()

const GCodeTileDefinition2Axis = DockTileDefinitionBuilder(GCodeTileDefinition)
    .render(() => {
        return <GCodeTile kinematicsConfigurationIndex={1} />
    })
    .name("GCode 2-Axis")
    .id("gcode-2-axis")
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
                        t =>
                            t.id !== CustomSceneTileDefinition.id && t.id !== GCodeTileDefinition.id
                    ), // standard components minus the 3d scene and gcode tile
                    CustomSceneTileDefinition,
                    GCodeTileDefinition3Axis,
                    GCodeTileDefinition2Axis,
                    DemoTileDefinition
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
