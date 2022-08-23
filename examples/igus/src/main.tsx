/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode, useState } from "react"
import {
    CartesianDroTile,
    ConnectTile,
    FeedRateTile,
    GCodeTile,
    GlowbuzzerApp,
    JogTile,
    JointDroTile,
    PreferencesDialog,
    RobotModel,
    ToolPathTile,
    ToolsTile
} from "@glowbuzzer/controls"
import { Button, Modal, Space, Switch } from "antd"
import styled from "styled-components"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import { Euler, Vector3 } from "three"
import { useConfig } from "@glowbuzzer/store"
import { createRoot } from "react-dom/client"
import { DemoMoveTile, HIGH_BLOCK_Z } from "./DemoMoveTile"

const StyledApp = styled.div`
    padding: 20px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 20px;

    nav.left {
        flex-basis: 450px;
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

const IGUS_MODEL: RobotModel = {
    name: "igus",
    config: [
        { alpha: -DEG90, limits: [-180, 180] },
        { alpha: -DEG90, teta: -DEG90, link_length: 0.35, limits: [-70, 110] },
        { alpha: DEG90, offset: 0.0119 },
        { alpha: DEG90, link_length: 0.27, limits: [-10, 145], skip_link: true },
        { alpha: -DEG90, offset: -0.0165 },
        { alpha: DEG90, link_length: 0.17, limits: [-15, 145], skip_link: true },
        { teta: DEG90 },
        { alpha: DEG90, skip_link: true },
        { teta: -DEG90, limits: [-180, 180], skip_link: true }
    ],
    offset: new Vector3(0, 0, 275),
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
                    <ToolPathTile model={showRobot && IGUS_MODEL} hideTrace hidePreview>
                        {["red", "green", "blue"].map((colour, index) => (
                            <mesh position={[500, (index - 1) * 200, 75]}>
                                <boxGeometry args={[150, 150, 150]} />
                                <meshStandardMaterial color={colour} />
                            </mesh>
                        ))}
                        <mesh position={[600, 0, HIGH_BLOCK_Z]}>
                            <boxGeometry args={[150, 150, 150]} />
                            <meshStandardMaterial color={"hotpink"} />
                        </mesh>
                        <mesh
                            position={[500, 500, HIGH_BLOCK_Z]}
                            rotation={new Euler(0, 0, Math.PI / 4)}
                        >
                            <boxGeometry args={[150, 150, 150]} />
                            <meshStandardMaterial color={"yellow"} />
                        </mesh>
                    </ToolPathTile>
                </section>
                <nav className="right">
                    <FeedRateTile />
                    <DemoMoveTile />
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
