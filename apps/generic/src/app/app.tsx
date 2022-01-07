import {
    AnalogInputsTile,
    AnalogOutputsTile,
    CartesianDro,
    ConnectTile,
    DevToolsTile,
    DigitalInputsTile,
    DigitalOutputsTile,
    FeedRateTile,
    FrameOverrideDialog,
    GCodeTile,
    GlowbuzzerApp,
    IntegerInputsTile,
    IntegerOutputsTile,
    JogTile,
    JointDroTile,
    PreferencesDialog,
    ToolPathTile
} from "@glowbuzzer/controls"
import styled from "styled-components"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"

import { Button } from "antd"
import { SimpleTileDefinition, SimpleTileLayout, Tile } from "@glowbuzzer/layout"
import React, { useState } from "react"
import { JointSpinnersTile } from "./JointSpinnersTile"

//tutorial
import "react-grid-layout/css/styles.css"

const StyledApp = styled.div``

const PrefsButton = () => {
    const [visible, setVisible] = useState(false)

    return (
        <>
            <Button onClick={() => setVisible(true)}>Preferences</Button>
            <PreferencesDialog visible={visible} onClose={() => setVisible(false)} />
        </>
    )
}

const FrameOverridesButton = () => {
    const [visible, setVisible] = useState(false)

    return (
        <>
            <Button onClick={() => setVisible(true)}>Frame Overrides</Button>
            <FrameOverrideDialog visible={visible} onClose={() => setVisible(false)} />
        </>
    )
}

export function App() {
    const tiles: SimpleTileDefinition[][] = [
        [
            { render: <ConnectTile />, height: 2, title: "Connection" },
            {
                render: (
                    <Tile title="Cartesian DRO">
                        <CartesianDro kinematicsConfigurationIndex={0} />
                    </Tile>
                ),
                height: 2,
                title: "Cartesian DRO"
            },
            { render: <FeedRateTile />, height: 2, title: "Feedrate" },
            { render: <JogTile />, height: 4, title: "Jogging" },
            { render: <JointDroTile />, height: 4, title: "Joint Indicators" },
            { render: <DevToolsTile />, height: 3, title: "Dev Tools" }
        ],
        [
            { render: <JointSpinnersTile />, height: 8, title: "Joints" },
            { render: <ToolPathTile />, height: 8, title: "Toolpath" },
            { render: <GCodeTile />, height: 4, title: "GCode" }
        ],
        [
            { render: <DigitalOutputsTile />, height: 4, title: "Digital Outputs" },
            { render: <DigitalInputsTile />, height: 4, title: "Digital Inputs" },
            { render: <AnalogOutputsTile />, height: 4, title: "Analog Outputs" },
            { render: <AnalogInputsTile />, height: 4, title: "Analog Inputs" },
            { render: <IntegerOutputsTile />, height: 4, title: "Integer Outputs" },
            { render: <IntegerInputsTile />, height: 4, title: "Integer Inputs" }
        ]
    ]

    return (
        <StyledApp>
            <GlowbuzzerApp>
                <div>
                    <PrefsButton /> <FrameOverridesButton />
                </div>
                <SimpleTileLayout appId="generic" tiles={tiles} widths={[2, 4, 2]} />
            </GlowbuzzerApp>
        </StyledApp>
    )
}

export default App
