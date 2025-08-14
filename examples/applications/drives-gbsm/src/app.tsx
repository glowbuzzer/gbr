/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React from "react"
import {
    DiagnosticsTileStepMasterDefinition,
    DigitalInputsTileDefinition,
    DigitalOutputsTileDefinition,
    DockLayout,
    DockLayoutProvider,
    FeedRateTileDefinition,
    JointDroTileDefinition,
    JointJogTileDefinition,
    TelemetryTileDefinition
} from "@glowbuzzer/controls"
import { ExampleAppMenu } from "../../../util/ExampleAppMenu"
import { DrivesOscillatingMoveTileDefinition } from "./tiles"
import { DrivesTileDefinition } from "../../../util/drives/DrivesTileDefinition"

import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { StatusTray } from "../../../../libs/controls/src/status/StatusTray"

export const App = () => {
    const tiles = [
        JointJogTileDefinition,
        JointDroTileDefinition,
        FeedRateTileDefinition,
        TelemetryTileDefinition,
        DrivesTileDefinition,
        DrivesOscillatingMoveTileDefinition,
        DigitalInputsTileDefinition,
        DigitalOutputsTileDefinition,
        DiagnosticsTileStepMasterDefinition
    ]

    return (
        <DockLayoutProvider tiles={tiles}>
            <ExampleAppMenu title="Drives GBSM" />
            <DockLayout />
        </DockLayoutProvider>
    )
}
