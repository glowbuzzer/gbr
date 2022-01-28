import ReactDOM from "react-dom"
import React, { StrictMode, useState } from "react"
import {
    CartesianDro,
    ConnectTile,
    GlowbuzzerApp,
    JogTile,
    JointDroTile,
    PreferencesDialog,
    RobotModel,
    ToolPathTile
} from "@glowbuzzer/controls"
import { Button, Space, Switch } from "antd"
import styled from "styled-components"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import { Vector3 } from "three"

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
        //max-width: 1200px;
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
                <Space>
                    <Switch defaultChecked={true} onChange={setShowRobot} />
                    <div>Show robot</div>
                </Space>
            </Space>
            <StyledApp>
                <nav>
                    <ConnectTile />
                    <JogTile />
                    <JointDroTile />
                    <CartesianDro kinematicsConfigurationIndex={0} />
                </nav>
                <section>
                    <ToolPathTile model={showRobot && TX40_MODEL} />
                </section>
            </StyledApp>
        </>
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
