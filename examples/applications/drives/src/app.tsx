/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React from "react"
import {
    ConfigEditTileDefinition,
    ConnectTileDefinition,
    DigitalInputsTileDefinition,
    DigitalOutputsTileDefinition,
    DockLayout,
    DockLayoutProvider,
    DockTileDefinitionBuilder,
    EmStatTileDefinition,
    FeedRateTileDefinition,
    JointDroTileDefinition,
    JointJogTileDefinition,
    TelemetryTileDefinition
} from "@glowbuzzer/controls"
import { ExampleAppMenu } from "../../../util/ExampleAppMenu"

import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { DrivesOscillatingMoveTileDefinition, SerialCommsTileDefinition } from "./tiles"
import { DrivesTileDefinition } from "../../../util/drives/DrivesTileDefinition"

const TelemetryMiddleCol = DockTileDefinitionBuilder(TelemetryTileDefinition)
    .placement(1, 1)
    .build()

export const App = () => {
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
                SerialCommsTileDefinition,
                DrivesOscillatingMoveTileDefinition,
                DigitalInputsTileDefinition,
                DigitalOutputsTileDefinition,
                EmStatTileDefinition
            ]}
        >
            <ExampleAppMenu title="Drives" />
            <DockLayout />
        </DockLayoutProvider>
    )
}
