/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode } from "react"

import { Euler } from "three"
import { createRoot } from "react-dom/client"
import { DemoMoveTile, HIGH_BLOCK_Z } from "./DemoMoveTile"
import {
    CartesianDroTileDefinition,
    CartesianJogTileDefinition,
    ConnectTileDefinition,
    DockLayout,
    DockLayoutProvider,
    DockTileDefinition,
    DockTileDefinitionBuilder,
    FeedRateTileDefinition,
    GlowbuzzerApp,
    JointDroTileDefinition,
    JointJogTileDefinition,
    ThreeDimensionalSceneTile,
    ThreeDimensionalSceneTileDefinition
} from "@glowbuzzer/controls"

import { ExampleAppMenu } from "../../../util/ExampleAppMenu"

import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { config } from "./config"
import { PlaneShinyMetal } from "../../../util/PlaneShinyMetal"
import { DefaultEnvironment } from "../../../util/DefaultEnvironment"
import { IgusRobot } from "./IgusRobot"

const Custom3dSceneTile = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return (
            <ThreeDimensionalSceneTile hideTrace hidePreview>
                <IgusRobot />

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

                <PlaneShinyMetal />
                <DefaultEnvironment />
            </ThreeDimensionalSceneTile>
        )
    })
    .build()

const demoMoveTile: DockTileDefinition = DockTileDefinitionBuilder()
    .id("demo-move")
    .name("Demo Move")
    .render(() => <DemoMoveTile />)
    .placement(0, 1)
    .build()

export function App() {
    return (
        <DockLayoutProvider
            tiles={[
                ConnectTileDefinition,
                FeedRateTileDefinition,
                JointJogTileDefinition,
                JointDroTileDefinition,
                CartesianJogTileDefinition,
                CartesianDroTileDefinition,
                demoMoveTile,
                Custom3dSceneTile
            ]}
        >
            <ExampleAppMenu />
            <DockLayout />
        </DockLayoutProvider>
    )
}

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp appName="igus" configuration={config}>
            <App />
        </GlowbuzzerApp>
    </StrictMode>
)
