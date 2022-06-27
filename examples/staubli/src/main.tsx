/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import ReactDOM from "react-dom"
import React, { StrictMode, useState } from "react"
import {
    CartesianDroTile,
    ConnectTile,
    GCodeTile,
    GlowbuzzerApp,
    JogTile,
    JointDroTile,
    PreferencesDialog,
    RobotModel,
    ToolsTile,
    ToolPathTile,
    FeedRateTile
} from "@glowbuzzer/controls"
import { Button, Modal, Space, Switch } from "antd"
import styled from "styled-components"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import { Vector3 } from "three"
import { useConfig } from "@glowbuzzer/store"
import { createRoot } from "react-dom/client"

const StyledApp = styled.div`
    padding: 20px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 20px;

    nav.left {
        flex-basis: 350px;
    }

    nav.right {
        flex-basis: 500px;
    }

    nav,
    section {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    section {
        flex-grow: 1;
    }
`

const PrefsButton = () => {
    const [visible, setVisible] = useState(false)

    return (
        <div>
            <Button onClick={() => setVisible(true)}>Preferences</Button>
            <PreferencesDialog visible={visible} onClose={() => setVisible(false)} />
        </div>
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

const DEG90 = Math.PI / 2

const TX40_MODEL: RobotModel = {
    name: "tx40",
    config: [
        { alpha: -DEG90, limits: [-270, 270] },
        { alpha: 0, link_length: 0.225, teta: -DEG90, limits: [-270, 270] },
        { alpha: DEG90, offset: 0.035, teta: DEG90, limits: [-270, 270] },
        { alpha: -DEG90, offset: 0.225, limits: [-270, 270] },
        { alpha: DEG90, limits: [-270, 270] },
        { offset: 0.065, limits: [-270, 270] }
    ],
    offset: new Vector3(0, 0, 325),
    scale: 1000
}

export function App() {
    const [showRobot, setShowRobot] = useState(true)

    return (
        <>
            <Space>
                <PrefsButton />
                <ConfigButton />
                <Space>
                    <Switch defaultChecked={true} onChange={setShowRobot} />
                    <div>Show robot</div>
                </Space>
            </Space>
            <StyledApp>
                <nav className="left">
                    <ConnectTile />
                    <JogTile />
                    <CartesianDroTile clipboardMode={true} />
                    <JointDroTile />
                    <ToolsTile />
                </nav>
                <section>
                    <ToolPathTile model={showRobot && TX40_MODEL} />
                </section>
                <nav className="right">
                    <FeedRateTile />
                    <GCodeTile />
                </nav>
            </StyledApp>
        </>
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
