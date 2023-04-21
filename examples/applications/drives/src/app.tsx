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
    TelemetryTileDefinition
} from "@glowbuzzer/controls"
import { ExampleAppMenu } from "../../../util/ExampleAppMenu"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { DrivesTileDefinition } from "./tiles"

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
                DrivesTileDefinition
            ]}
        >
            <ExampleAppMenu title="Drives" />
            <DockLayout />
        </DockLayoutProvider>
    )
}
