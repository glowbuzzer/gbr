/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React from "react"
import {
    ConfigEditTileDefinition,
    ConnectTileDefinition,
    DockLayout,
    DockLayoutProvider,
    DockTileDefinitionBuilder,
    FeedRateTileDefinition,
    JointDroTileDefinition,
    JointJogTileDefinition,
    TelemetryTileDefinition,
    DigitalInputsTileDefinition,
    DigitalOutputsTileDefinition,
    SafetyTileDefinition,
    SafetyDigitalInputsTileDefinition,
    SafetyDigitalOutputsTileDefinition,
    JointTorqueModesTile,
    JointTorqueModesTileDefinition,
    useGbdbMenu
} from "@glowbuzzer/controls"
import { ExampleAppMenu } from "../../../util/ExampleAppMenu"

import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { DrivesOscillatingMoveTileDefinition } from "./tiles"
import { DrivesTileDefinition } from "../../../util/drives/DrivesTileDefinition"
import { EmStatTileDefinition } from "@glowbuzzer/controls"

const TelemetryMiddleCol = DockTileDefinitionBuilder(TelemetryTileDefinition)
    .placement(1, 1)
    .build()

export const App = () => {
    const { menuItems, menuContext } = useGbdbMenu("project", true)
    return (
        <DockLayoutProvider
            tiles={[
                ConnectTileDefinition,
                JointJogTileDefinition,
                JointDroTileDefinition,
                ConfigEditTileDefinition,
                FeedRateTileDefinition,
                TelemetryMiddleCol,
                DrivesTileDefinition,
                DrivesOscillatingMoveTileDefinition,
                DigitalInputsTileDefinition,
                DigitalOutputsTileDefinition,
                SafetyTileDefinition,
                SafetyDigitalInputsTileDefinition,
                SafetyDigitalOutputsTileDefinition,
                EmStatTileDefinition,
                JointTorqueModesTileDefinition
            ]}
        >
            <ExampleAppMenu title="Drives FSoE" fileExtra={menuItems} />
            {menuContext}
            <DockLayout />
        </DockLayoutProvider>
    )
}
