/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { ThreeDimensionalSceneTile } from "@glowbuzzer/controls"
import { CutterSimulation } from "./CutterSimulation"
import React, { useMemo } from "react"
import { ToolHolder } from "./ToolHolder"
import { DefaultEnvironment } from "../../../util/DefaultEnvironment"
import { Spindle } from "./Spindle"
import { useGLTF } from "@react-three/drei"
import { useToolList } from "@glowbuzzer/store"
import { tools } from "../../../../test/src/tests/tools"
import { Vector3 } from "three"

const default_camera_pos = new Vector3(-300, -300, 300)

export const CncScene = () => {
    return (
        <ThreeDimensionalSceneTile initialCameraPosition={default_camera_pos}>
            <ToolHolder />
            <Spindle />
            <CutterSimulation />
            <DefaultEnvironment />
        </ThreeDimensionalSceneTile>
    )
}
