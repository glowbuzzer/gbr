/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { AwTubeLoadedRobotParts } from "../../types"
import React from "react"

export const AwTubeBaseLink = ({ parts }: { parts: AwTubeLoadedRobotParts }) => {
    const { b0, j0 } = parts

    return (
        <primitive
            object={b0.object}
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, 0, -j0.moveableFlangeFromCentreLine - b0.thickness]}
        />
    )
}
