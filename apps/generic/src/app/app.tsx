import {
    AnalogInputsTile,
    AnalogOutputsTile,
    CartesianDro,
    ConnectTile,
    DevToolsTile,
    DigitalInputsTile,
    DigitalOutputsTile,
    FeedRateTile,
    GCodeTile,
    GlowbuzzerApp,
    IntegerInputsTile,
    IntegerOutputsTile,
    JogTile,
    PreferencesDialog,
    ToolPathTile
} from "@glowbuzzer/controls"
import styled from "@emotion/styled"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"

import { Button } from "antd"
import { SimpleTileDefinition, SimpleTileLayout, Tile } from "@glowbuzzer/layout"
import React, { useState } from "react"
import { JointSpinnersTile } from "./JointSpinnersTile"

//tutorial
import { TutorialDoToggleTile } from "./tutorial/TutorialDoToggleTile"
import { TutorialOscillatingMoveTile } from "./tutorial/TutorialOscillatingMoveTile"

import "react-grid-layout/css/styles.css"

const StyledApp = styled.div``

const PrefsButton = () => {
    const [visible, setVisible] = useState(false)

    return (
        <div>
            <Button onClick={() => setVisible(true)}>Preferences</Button>
            <PreferencesDialog visible={visible} onClose={() => setVisible(false)} />
        </div>
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
            { render: <IntegerInputsTile />, height: 4, title: "Integer Inputs" },
            {
                render: <TutorialDoToggleTile />,
                height: 4,
                title: "Tutorial Digital Output Toggle"
            },
            {
                render: <TutorialOscillatingMoveTile />,
                height: 4,
                title: "Tutorial Oscillating Move"
            }
        ]
    ]

    return (
        <StyledApp>
            <GlowbuzzerApp>
                <PrefsButton />
                <SimpleTileLayout appId="generic" tiles={tiles} widths={[1, 2, 1]} />
            </GlowbuzzerApp>
        </StyledApp>
    )
}

export default App
