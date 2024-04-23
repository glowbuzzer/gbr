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
    TelemetryTileDefinition,
    useGbdbMenu
} from "@glowbuzzer/controls"
import { ExampleAppMenu } from "../../../util/ExampleAppMenu"

import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { DrivesOscillatingMoveTileDefinition } from "./tiles"
import { DrivesTileDefinition } from "../../../util/drives/DrivesTileDefinition"
import { SerialCommunicationsTileDefinition } from "@glowbuzzer/controls"

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
                FeedRateTileDefinition,
                TelemetryMiddleCol,
                DrivesTileDefinition,
                SerialCommunicationsTileDefinition,
                DrivesOscillatingMoveTileDefinition,
                DigitalInputsTileDefinition,
                DigitalOutputsTileDefinition,
                EmStatTileDefinition
            ]}
        >
            <ExampleAppMenu title="Drives" fileExtra={menuItems} />
            {menuContext}
            <DockLayout />
        </DockLayoutProvider>
    )
}
