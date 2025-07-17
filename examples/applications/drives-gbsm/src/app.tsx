/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React from "react"
import {
    DiagnosticsTileDefinition,
    DiagnosticsTileStepMasterDefinition,
    DigitalInputsTileDefinition,
    DigitalOutputsTileDefinition,
    DockLayout,
    DockLayoutContext,
    DockPerspective,
    FeedRateTileDefinition,
    JointDroTileDefinition,
    JointJogTileDefinition,
    StatusTrayProvider,
    StyledDockLayout,
    TelemetryTileDefinition,
    useAppName,
    useDockContext
} from "@glowbuzzer/controls"
import { ExampleAppMenu } from "../../../util/ExampleAppMenu"
import { DrivesOscillatingMoveTileDefinition } from "./tiles"
import { DrivesTileDefinition } from "../../../util/drives/DrivesTileDefinition"

import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { StatusTray } from "../../../../libs/controls/src/status/StatusTray"
import { StatusBar } from "./StatusBarGbsm"

export const App = () => {
    const appName = useAppName()
    const statusBarRef = React.useRef<HTMLDivElement>(null)

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

    const perspective: DockPerspective = {
        id: "default",
        name: "Default"
    }
    const context = useDockContext(tiles, [perspective], "default", appName)

    return (
        <StyledDockLayout>
            <StatusTrayProvider statusBarElement={statusBarRef.current}>
                <DockLayoutContext.Provider value={context}>
                    <ExampleAppMenu title="Drives GBSM" />
                    <DockLayout />
                    <StatusBar ref={statusBarRef} />
                    <StatusTray statusBarRef={statusBarRef} />
                </DockLayoutContext.Provider>
            </StatusTrayProvider>
        </StyledDockLayout>
    )
}
