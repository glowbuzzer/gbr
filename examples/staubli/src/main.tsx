import ReactDOM from "react-dom"
import React, { useState } from "react"
import {
    CartesianDroTile,
    ConnectTile,
    GCodeTile,
    GlowbuzzerApp,
    JogTile,
    JointDroTile,
    PreferencesDialog,
    RobotModel,
    ToolPathTile
} from "@glowbuzzer/controls"
import { Button, Modal, Space, Switch } from "antd"
import styled from "styled-components"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import { Vector3 } from "three"
import { useConfig } from "@glowbuzzer/store"

const StyledApp = styled.div`
    padding: 20px;
    display: flex;
    width: 100%;
    gap: 20px;

    nav {
        min-width: 300px;
    }

    nav,
    section {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    section {
        flex-grow: 1;
        min-height: 1200px;
        display: flex;
        flex-direction: row;

        > div:first-child {
            flex-grow: 1;
        }
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
                <nav>
                    <ConnectTile />
                    <JogTile />
                    <CartesianDroTile clipboardMode={true} />
                    <JointDroTile />
                </nav>
                <section>
                    <ToolPathTile model={showRobot && TX40_MODEL} />
                    <GCodeTile />
                </section>
            </StyledApp>
        </>
    )
}

ReactDOM.render(
    <GlowbuzzerApp>
        <App />
    </GlowbuzzerApp>,
    document.getElementById("root")
)
