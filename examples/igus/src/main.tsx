/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode } from "react"

import { Euler, Vector3 } from "three"
import { createRoot } from "react-dom/client"
import { DemoMoveTile, HIGH_BLOCK_Z } from "./DemoMoveTile"
import {
    DockLayout,
    DockLayoutProvider,
    GlowbuzzerApp,
    RobotModel,
    ToolPathTile,
    DockTileDefinitionBuilder,
    DockTileDefinition
} from "@glowbuzzer/controls"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { GlowbuzzerTileDefinitions } from "@glowbuzzer/controls"
import { ExampleAppMenu } from "../../util/ExampleAppMenu"

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

const DEMO_MOVE_COMPONENT: DockTileDefinition = {
    id: "demo-move",
    name: "Demo Move",
    render: DemoMoveTile,
    defaultPlacement: {
        column: 0,
        row: 1
    }
}

const toolpathTile = DockTileDefinitionBuilder(GlowbuzzerTileDefinitions.THREE_DIMENSIONAL_SCENE)
    .render(() => (
        <ToolPathTile model={IGUS_MODEL} hideTrace hidePreview>
            {["red", "green", "blue"].map((colour, index) => (
                <mesh key={colour} position={[500, (index - 1) * 200, 75]}>
                    <boxGeometry args={[150, 150, 150]} />
                    <meshStandardMaterial color={colour} />
                </mesh>
            ))}
            <mesh position={[600, 0, HIGH_BLOCK_Z]}>
                <boxGeometry args={[150, 150, 150]} />
                <meshStandardMaterial color={"hotpink"} />
            </mesh>
            <mesh position={[500, 500, HIGH_BLOCK_Z]} rotation={new Euler(0, 0, Math.PI / 4)}>
                <boxGeometry args={[150, 150, 150]} />
                <meshStandardMaterial color={"yellow"} />
            </mesh>
        </ToolPathTile>
    ))
    .build()

const AVAILABLE_COMPONENTS = [GlowbuzzerTileDefinitions.CONNECT, DEMO_MOVE_COMPONENT, toolpathTile]

export function App() {
    return (
        <DockLayoutProvider appName={"igus"} tiles={AVAILABLE_COMPONENTS}>
            <ExampleAppMenu />
            <DockLayout />
        </DockLayoutProvider>
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
