/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { AwTubeLoadedRobotParts } from "../../types"
import React from "react"

export const AwTubeLink5 = ({ parts }: { parts: AwTubeLoadedRobotParts }) => {
    const { j4, m0, j5 } = parts
    return (
        <group position={[0, 0, j4.moveableFlangeFromCentreLine]}>
            <primitive object={m0.object} rotation={[-Math.PI / 2, -Math.PI / 2, 0]} />

            <group
                position={[0, -m0.length, -m0.offset]}
                rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
            >
                <primitive
                    object={j5.object}
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[-j5.fixedFlangeFromCentreLine, 0, 0]}
                />
            </group>
        </group>
    )
}
