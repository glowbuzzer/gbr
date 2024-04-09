/*
 * Copyright (c) 2022-2023. Glowbuzzer. All rights reserved
 *
 * This file contains the main application component. It is responsible for
 * - creating the application menu
 * - creating the application tiles
 * - creating the application layout
 * - rendering the glowbuzzer container and docking layout
 *
 * Multiple perspectives are provided, one for each of the following:
 * - running and visualisation of the sorting job (default perspective)
 * - commissioning of drives, sensors and actuators
 */

import React from "react"
import {
    AnalogInputsTileDefinition,
    ConnectTileDefinition,
    DigitalInputsTileDefinition,
    DigitalOutputsTileDefinition,
    DockLayout,
    DockPerspective,
    DockPerspectiveLayoutProvider,
    DockTileDefinition,
    DockTileDefinitionBuilder,
    GlowbuzzerApp,
    GlowbuzzerTileIdentifiers,
    JointJogTileDefinition,
    ThreeDimensionalSceneTileDefinition
} from "@glowbuzzer/controls"
import { digitalInputEnhancer, DigitalInputMockProvider } from "@glowbuzzer/store"
import { ExampleAppMenu } from "../../../util/ExampleAppMenu"
import { StateViewerTile } from "./state/StateViewerTile"
import { ConveyorsSceneTile } from "./tiles/ConveyorsSceneTile"
import { sortingAppReducers } from "./store"
import { JobSimulationTile } from "./tiles/JobSimulationTile"
import { SimulationController } from "./SimulationController"
import { DrivesTileDefinition } from "../../../util/drives/DrivesTileDefinition"

import { sortingAppConfig } from "./sortingAppConfig"

import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { StatusTray } from "../../../../libs/controls/src/status/StatusTray"
import { StatusTrayProvider } from "../../../../libs/controls/src/status/StatusTrayProvider"

// custom tiles for this app
enum AppTile {
    STATE_VIEWER_TILE = "STATE_VIEWER_TILE",
    JOB_SIMULATION_TILE = "JOB_SIMULATION_TILE"
}

// all available components that can be shown
const AVAILABLE_COMPONENTS: DockTileDefinition[] = [
    ConnectTileDefinition,
    JointJogTileDefinition,
    DigitalOutputsTileDefinition,
    DigitalInputsTileDefinition,
    AnalogInputsTileDefinition,
    DrivesTileDefinition,
    DockTileDefinitionBuilder()
        .id(AppTile.STATE_VIEWER_TILE)
        .name("State Viewer")
        .render(() => <StateViewerTile />)
        .enableWithoutConnection()
        .build(),
    DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
        .render(() => <ConveyorsSceneTile />)
        .build(),
    DockTileDefinitionBuilder()
        .id(AppTile.JOB_SIMULATION_TILE)
        .name("Sorting Job")
        .placement(1, 2)
        .render(() => <JobSimulationTile />)
        .build()
]

// define the perspectives (views) that can be selected
const perspectives: DockPerspective[] = [
    {
        id: "commissioning",
        name: "Commissioning",
        defaultVisible: [
            DrivesTileDefinition.id,
            GlowbuzzerTileIdentifiers.DIGITAL_OUTPUTS,
            GlowbuzzerTileIdentifiers.DIGITAL_INPUTS,
            GlowbuzzerTileIdentifiers.ANALOG_INPUTS,
            GlowbuzzerTileIdentifiers.JOG_JOINT
        ]
    },
    {
        id: "development",
        name: "Development",
        defaultVisible: [
            AppTile.STATE_VIEWER_TILE,
            AppTile.JOB_SIMULATION_TILE,
            GlowbuzzerTileIdentifiers.THREE_DIMENSIONAL_SCENE
        ]
    }
]

/**
 * The main application component. The `digitalInputEnhancer` is used to simulate a digital input,
 * in this case the pnuematic cylinder (pusher) having being extended and retracted. In actual operation these are
 * the real inputs from the sensors.
 *
 * The `additionalReducers` property is used to add a Redux Toolkit slice specific to the application.
 *
 * The `configuration` property is used to configure the application. This configuration will be sent
 * to GBC on connection.
 */
export const App = () => {
    return (
        <GlowbuzzerApp
            storeEnhancers={[digitalInputEnhancer]}
            appName="convmc"
            additionalReducers={sortingAppReducers}
            configuration={sortingAppConfig}
        >
            <DigitalInputMockProvider>
                <SimulationController />
                <DockPerspectiveLayoutProvider
                    tiles={AVAILABLE_COMPONENTS}
                    perspectives={perspectives}
                    defaultPerspective="development"
                >
                    <ExampleAppMenu title="Conveyors" />
                    <DockLayout />
                </DockPerspectiveLayoutProvider>
            </DigitalInputMockProvider>
        </GlowbuzzerApp>
    )
}
