/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import {
    DockTileDefinition,
    DockLayout,
    DockPerspectiveLayoutProvider,
    DockPerspective,
    GlowbuzzerApp,
    GlowbuzzerTileIdentifiers
} from "@glowbuzzer/controls"
import { digitalInputEnhancer, DigitalInputMockProvider } from "@glowbuzzer/store"
import { AppContextProvider } from "./AppContext"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { AppMenu } from "./AppMenu"
import { TestMotionTile } from "../components/TestMotionTile"
import { ConveyorsTile } from "../components/ConveyorsTile"
import { DevelopmentTile } from "../components/DevelopmentTile"
import { TriggersTile } from "./TriggersTile"
import { GlowbuzzerTileDefinitions } from "@glowbuzzer/controls"
import { ExampleAppMenu } from "../../../util/ExampleAppMenu"

enum AppDockComponent {
    TEST_MOTION_TILE = "TEST_MOTION_TILE",
    DIGITAL_INPUT_OVERRIDES_TILE = "DIGITAL_INPUT_OVERRIDES_TILE",
    CONVEYORS_TILE = "CONVEYORS_TILE",
    TRIGGERS_TILE = "TRIGGERS_TILE",
    DEVELOPMENT_TILE = "DEVELOPMENT_TILE"
}

const AVAILABLE_COMPONENTS: DockTileDefinition[] = [
    GlowbuzzerTileDefinitions.CONNECT,
    GlowbuzzerTileDefinitions.JOINT_JOG,
    GlowbuzzerTileDefinitions.DIGITAL_OUTPUTS,
    GlowbuzzerTileDefinitions.DIGITAL_INPUTS,
    GlowbuzzerTileDefinitions.ANALOG_INPUTS,
    {
        id: AppDockComponent.TEST_MOTION_TILE,
        name: "Test Motion",
        render: () => <TestMotionTile />,
        defaultPlacement: {
            column: 1,
            row: 1
        }
    },
    {
        id: AppDockComponent.CONVEYORS_TILE,
        name: "Conveyors",
        render: () => <ConveyorsTile />,
        defaultPlacement: {
            column: 1,
            row: 0
        }
    },
    {
        id: AppDockComponent.DEVELOPMENT_TILE,
        name: "Development",
        render: () => <DevelopmentTile />,
        defaultPlacement: {
            column: 1,
            row: 0
        }
    },
    {
        id: AppDockComponent.TRIGGERS_TILE,
        name: "Triggers",
        render: () => <TriggersTile />,
        defaultPlacement: {
            column: 1,
            row: 1
        }
    }
]

const perspectives: DockPerspective[] = [
    {
        id: "commissioning",
        name: "Commissioning",
        defaultVisible: [
            AppDockComponent.TEST_MOTION_TILE,
            AppDockComponent.CONVEYORS_TILE,
            GlowbuzzerTileIdentifiers.STATE_MACHINE_TOOLS,
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
            AppDockComponent.DIGITAL_INPUT_OVERRIDES_TILE,
            AppDockComponent.DEVELOPMENT_TILE,
            AppDockComponent.TRIGGERS_TILE,
            GlowbuzzerTileIdentifiers.STATE_MACHINE_TOOLS
        ]
    }
]

export function App() {
    return (
        <GlowbuzzerApp storeEnhancers={[digitalInputEnhancer]}>
            <DockPerspectiveLayoutProvider
                appName={"convmc"}
                tiles={AVAILABLE_COMPONENTS}
                perspectives={perspectives}
                defaultPerspective="commissioning"
            >
                <DigitalInputMockProvider>
                    <AppContextProvider>
                        <ExampleAppMenu title="Conveyors" />
                        <DockLayout />
                    </AppContextProvider>
                </DigitalInputMockProvider>
            </DockPerspectiveLayoutProvider>
        </GlowbuzzerApp>
    )
}

export default App
