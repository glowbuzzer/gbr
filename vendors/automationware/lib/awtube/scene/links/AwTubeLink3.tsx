/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { AwTubeLoadedRobotParts } from "../../types"
import React from "react"

export const AwTubeLink3 = ({ parts }: { parts: AwTubeLoadedRobotParts }) => {
    const { j2, c1, j3 } = parts
    return (
        <group>
            <group position={[0, 0, j2.moveableFlangeFromCentreLine + c1.thickness]}>
                <primitive object={c1.object} rotation={[Math.PI / 2, 0, 0]} />

                <group
                    position={[0, 0, -c1.thickness - j3.fixedFlangeFromCentreLine]}
                    rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
                >
                    <primitive object={j3.object} rotation={[Math.PI / 2, 0, 0]} />
                </group>
            </group>
        </group>
    )
}
