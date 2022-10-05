/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, {StrictMode, useState} from "react"
import {
    CartesianDroTile,
    ConnectTile,
    FeedRateTile,
    GCodeTile,
    GlowbuzzerApp,
    JogTile,
    JointDroTile,
    RobotModel,
    ToolPathTile,
    ToolsTile
} from "@glowbuzzer/controls"
import {Space, Switch} from "antd"
import styled from "styled-components"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import {Vector3} from "three"
import {createRoot} from "react-dom/client"
import {StandardButtons} from "../../util/StandardButtons"

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
            <StandardButtons>
                <Space>
                    <Switch defaultChecked={true} onChange={setShowRobot} />
                    <div>Show robot</div>
                </Space>
            </StandardButtons>
            <StyledApp>
                <nav className="left">
                    <ConnectTile />
                    <JogTile />
                    <CartesianDroTile clipboardMode={true} />
                    <JointDroTile />
                    <ToolsTile />
                </nav>
                <section>
                    <ToolPathTile model={showRobot && TX40_MODEL}>
                        {["red", "green", "blue"].map((colour, index) => (
                            <mesh position={[500, (index - 1) * 200, 75]}>
                                <boxGeometry args={[150, 150, 150]} />
                                <meshStandardMaterial color={colour} />
                            </mesh>
                        ))}
                    </ToolPathTile>
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
