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
    DiagnosticsTileDefinition,
    FeedRateTileDefinition,
    JointDroTileDefinition,
    JointJogTileDefinition,
    JointTorqueModesTileDefinition,
    ModbusDigitalInputsTileDefinition,
    ModbusDigitalOutputsTileDefinition,
    ModbusIntegerInputsTileDefinition,
    ModbusIntegerOutputsTileDefinition,
    SafetyDigitalInputsTileDefinition,
    SafetyDigitalOutputsTileDefinition,
    SafetyTileDefinition,
    TelemetryTileDefinition
} from "@glowbuzzer/controls"

import { AppStatusBar } from "./AppStatusBar"
import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { DrivesOscillatingMoveTileDefinition, VirtualHmiTileDefinition } from "./tiles"
import { DrivesTileDefinition } from "../../../util/drives/DrivesTileDefinition"
import { InnoboticsJogTileWrapper, InnoboticsModeProvider } from "@glowbuzzer/awlib"

const TelemetryMiddleCol = DockTileDefinitionBuilder(TelemetryTileDefinition)
    .placement(1, 1)
    .build()

export const App = () => {
    // const { menuItems, menuContext } = useGbdbMenu("project", true)
    return (
        <InnoboticsModeProvider>
            <DockLayoutProvider
                tiles={[
                    ConnectTileDefinition,
                    DockTileDefinitionBuilder(JointJogTileDefinition)
                        .wrap(InnoboticsJogTileWrapper)
                        .build(),
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
                    DiagnosticsTileDefinition,
                    JointTorqueModesTileDefinition,
                    ModbusDigitalInputsTileDefinition,
                    ModbusIntegerInputsTileDefinition,
                    ModbusDigitalOutputsTileDefinition,
                    ModbusIntegerOutputsTileDefinition,
                    VirtualHmiTileDefinition
                ]}
                statusBarExtra={<AppStatusBar />}
            >
                {/*<ExampleAppMenu title="Drives FSoE" fileExtra={menuItems} />*/}
                {/*{menuContext}*/}
                <DockLayout />
            </DockLayoutProvider>
        </InnoboticsModeProvider>
    )
}
