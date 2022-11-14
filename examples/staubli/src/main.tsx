/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode } from "react"
import {
    DockLayout,
    DockLayoutProvider,
    DockTileDefinitionBuilder,
    GlowbuzzerApp,
    GlowbuzzerTileDefinitions,
    RobotModel,
    ThreeDimensionalSceneTile
} from "@glowbuzzer/controls"

import { Vector3 } from "three"
import { createRoot } from "react-dom/client"
import { ExampleAppMenu } from "../../util/ExampleAppMenu"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"

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

const CustomSceneTile = DockTileDefinitionBuilder(GlowbuzzerTileDefinitions.THREE_DIMENSIONAL_SCENE)
    .render(() => (
        <ThreeDimensionalSceneTile model={TX40_MODEL}>
            {["red", "green", "blue"].map((colour, index) => (
                <mesh position={[500, (index - 1) * 200, 75]}>
                    <boxGeometry args={[150, 150, 150]} />
                    <meshStandardMaterial color={colour} />
                </mesh>
            ))}
        </ThreeDimensionalSceneTile>
    ))
    .build()

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp>
            <DockLayoutProvider
                appName={"staubli"}
                tiles={[
                    GlowbuzzerTileDefinitions.CONNECT,
                    GlowbuzzerTileDefinitions.CARTESIAN_JOG,
                    GlowbuzzerTileDefinitions.CARTESIAN_DRO,
                    GlowbuzzerTileDefinitions.JOINT_JOG,
                    GlowbuzzerTileDefinitions.JOINT_DRO,
                    GlowbuzzerTileDefinitions.TOOLS,
                    GlowbuzzerTileDefinitions.POINTS,
                    GlowbuzzerTileDefinitions.FRAMES,
                    GlowbuzzerTileDefinitions.CONFIG_EDIT,
                    GlowbuzzerTileDefinitions.FEEDRATE,
                    CustomSceneTile
                ]}
            >
                <ExampleAppMenu title="Staubli TX40" />
                <DockLayout />
            </DockLayoutProvider>
        </GlowbuzzerApp>
    </StrictMode>
)
