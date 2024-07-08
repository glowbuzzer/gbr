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
    ModbusDigitalInputsTileDefinition,
    ModbusIntegerInputsTileDefinition,
    useGbdbMenu,
    ModbusDigitalOutputsTileDefinition,
    ModbusIntegerOutputsTileDefinition,
    CartesianJogTileDefinition
} from "@glowbuzzer/controls"

import { InnoboticsModeProvider } from "./InnoboticsModeProvider"

import { ExampleAppMenu } from "../../../util/ExampleAppMenu"
import { AppStatusBar } from "./AppStatusBar"
import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { DrivesOscillatingMoveTileDefinition } from "./tiles"
import { VirtualHmiTileDefinition } from "./tiles"
import { DrivesTileDefinition } from "../../../util/drives/DrivesTileDefinition"
import { EmStatTileDefinition } from "@glowbuzzer/controls"
import { InnoboticsJogTileWrapper } from "./InnoboticsJogTileWrapper"

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
                    EmStatTileDefinition,
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
