import * as ReactDOM from "react-dom"
import React, { StrictMode, useState } from "react"

import {
    AnalogInputsTile,
    AnalogOutputsTile,
    CartesianDroTile,
    ConnectTile,
    StateMachineToolsTile,
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
    SimpleTileDefinition,
    SimpleTileLayout,
    ToolPathTile,
    ToolsTile
} from "@glowbuzzer/controls"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"

import { Button, Modal, Space } from "antd"
import { JointSpinnersTile } from "./JointSpinnersTile"

import "react-grid-layout/css/styles.css"
import { GCodeContextProvider, SoloActivityApi, useConfig } from "@glowbuzzer/store"
import styled from "styled-components"

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

const StyledModal = styled(Modal)`
    pre {
        max-height: 400px;
        overflow-y: auto;
    }
`
const ConfigButton = () => {
    const [visible, setVisible] = useState(false)
    const config = useConfig()

    return (
        <div>
            <Button onClick={() => setVisible(true)}>View Config</Button>
            <StyledModal
                title="Configuration"
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={[<Button onClick={() => setVisible(false)}>Close</Button>]}
            >
                <pre>{JSON.stringify(config, null, 2)}</pre>
            </StyledModal>
        </div>
    )
}

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
            <Space>
                <PrefsButton />
                <FrameOverridesButton />
                <ConfigButton />
            </Space>
            <SimpleTileLayout appId="generic" tiles={tiles} widths={[2, 4, 2]} />
        </GCodeContextProvider>
    )
}

ReactDOM.render(
    <StrictMode>
        <GlowbuzzerApp>
            <App />
        </GlowbuzzerApp>
    </StrictMode>,
    document.getElementById("root")
)
