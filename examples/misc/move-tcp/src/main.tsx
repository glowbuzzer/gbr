/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode, Suspense, useState } from "react"
import { createRoot } from "react-dom/client"
import {
    CartesianDroTileDefinition,
    CartesianJogTileDefinition,
    ConfigEditTileDefinition,
    ConnectTileDefinition,
    DockLayout,
    DockLayoutProvider,
    DockTileDefinitionBuilder,
    FeedRateTileDefinition,
    FramesTileDefinition,
    GlowbuzzerApp,
    JointDroTileDefinition,
    JointJogTileDefinition,
    PointsTileDefinition,
    ThreeDimensionalSceneTile,
    ThreeDimensionalSceneTileDefinition,
    ToolsTileDefinition
} from "@glowbuzzer/controls"
import { ExampleAppMenu } from "../../../util/ExampleAppMenu"

import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import "./styles.css"
import { config } from "./config"
import { Controls } from "./Controls"
import { DraggableStaubliRobot } from "./DraggableStaubliRobot"

const SceneWrapper = () => {
    const [freeMovement, setFreeMovement] = useState(true)
    const [waist, setWaist] = useState(0)
    const [elbow, setElbow] = useState(0)
    const [wrist, setWrist] = useState(0)
    const [activeConfiguration, setActiveConfiguration] = useState(0)
    const [tcpControlsActive, setTcpControlsActive] = useState(false)

    return (
        <>
            <ThreeDimensionalSceneTile>
                <Suspense fallback={null}>
                    <DraggableStaubliRobot
                        freeMovement={freeMovement}
                        waist={waist}
                        elbow={elbow}
                        wrist={wrist}
                        setActiveConfiguration={setActiveConfiguration}
                        tcpControlsActive={tcpControlsActive}
                    />
                </Suspense>

                {["red", "green", "blue"].map((colour, index) => (
                    <mesh position={[500, (index - 1) * 200, 75]}>
                        <boxGeometry args={[150, 150, 150]} />
                        <meshStandardMaterial color={colour} />
                    </mesh>
                ))}
            </ThreeDimensionalSceneTile>
            <Controls
                controls={{
                    freeMovement,
                    setFreeMovement,
                    waist,
                    setWaist,
                    elbow,
                    setElbow,
                    wrist,
                    setWrist,
                    activeConfiguration,
                    setActiveConfiguration,
                    tcpControlsActive,
                    setTcpControlsActive
                }}
            />
        </>
    )
}

const CustomSceneTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return <SceneWrapper />
    })
    .build()

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp appName={"move tcp"} configuration={config}>
            <DockLayoutProvider
                tiles={[
                    ConnectTileDefinition,
                    CartesianJogTileDefinition,
                    CartesianDroTileDefinition,
                    JointJogTileDefinition,
                    JointDroTileDefinition,
                    ToolsTileDefinition,
                    PointsTileDefinition,
                    FramesTileDefinition,
                    ConfigEditTileDefinition,
                    FeedRateTileDefinition,
                    CustomSceneTileDefinition
                ]}
            >
                <ExampleAppMenu title="Move TCP" />
                <DockLayout />
            </DockLayoutProvider>
        </GlowbuzzerApp>
    </StrictMode>
)
