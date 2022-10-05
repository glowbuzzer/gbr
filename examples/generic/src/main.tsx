/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode } from "react"

import {
    AnalogInputsTile,
    AnalogOutputsTile,
    CartesianDroTile,
    ConnectTile,
    DigitalInputsTile,
    DigitalOutputsTile,
    FeedRateTile,
    GCodeTile,
    GlowbuzzerApp,
    IntegerInputsTile,
    IntegerOutputsTile,
    JogTile,
    JointDroTile,
    SimpleTileDefinition,
    SimpleTileLayout,
    StateMachineToolsTile,
    ToolPathTile,
    ToolsTile
} from "@glowbuzzer/controls"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import { JointSpinnersTile } from "./JointSpinnersTile"

import "react-grid-layout/css/styles.css"
import { GCodeContextProvider, SoloActivityApi } from "@glowbuzzer/store"
import { createRoot } from "react-dom/client"
import { SpindleTile } from "../../../libs/controls/src/spindle/SpindleTile"
import { StandardButtons } from "../../util/StandardButtons"

function App() {
    const tiles: SimpleTileDefinition[][] = [
        [
            { render: <ConnectTile />, height: 2, title: "Connection" },
            {
                render: <CartesianDroTile kinematicsConfigurationIndex={0} clipboardMode={true} />,
                height: 2,
                title: "Cartesian DRO"
            },
            { render: <FeedRateTile />, height: 2, title: "Feedrate" },
            { render: <JogTile />, height: 4, title: "Jogging" },
            { render: <JointDroTile />, height: 4, title: "Joint Indicators" },
            { render: <ToolsTile />, height: 4, title: "Tools" },
            { render: <StateMachineToolsTile />, height: 3, title: "State Machine Tools" }
        ],
        [
            { render: <JointSpinnersTile />, height: 8, title: "Joints" },
            { render: <ToolPathTile />, height: 8, title: "Toolpath" },
            { render: <GCodeTile />, height: 4, title: "GCode" }
        ],
        [
            { render: <SpindleTile />, height: 4, title: "Spindle" },
            { render: <DigitalOutputsTile />, height: 4, title: "Digital Outputs" },
            { render: <DigitalInputsTile />, height: 4, title: "Digital Inputs" },
            { render: <AnalogOutputsTile />, height: 4, title: "Analog Outputs" },
            { render: <AnalogInputsTile />, height: 4, title: "Analog Inputs" },
            { render: <IntegerOutputsTile />, height: 4, title: "Integer Outputs" },
            { render: <IntegerInputsTile />, height: 4, title: "Integer Inputs" }
        ]
    ]

    function handleToolChange(
        kinematicsConfigurationIndex: number,
        current: number,
        next: number,
        api: SoloActivityApi
    ) {
        console.log("TOOL CHANGE!")
        return [api.moveToPosition(null, null, 50), api.setToolOffset(next), api.dwell(500)]
    }

    return (
        <GCodeContextProvider value={{ handleToolChange }}>
            <StandardButtons />
            <SimpleTileLayout appId="generic" tiles={tiles} widths={[2, 4, 2]} />
        </GCodeContextProvider>
    )
}

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp>
            <App />
        </GlowbuzzerApp>
    </StrictMode>
)
