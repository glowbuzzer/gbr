/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { AwTubeLoadedRobotParts } from "../../types"
import React from "react"

export const AwTubeLink4 = ({ parts }: { parts: AwTubeLoadedRobotParts }) => {
    const { j3, l1, j4, p1 } = parts
    return (
        <group>
            <group position={[0, 0, j3.moveableFlangeFromCentreLine]}>
                <primitive object={p1.object} rotation={[-Math.PI / 2, 0, 0]} />

                <group>
                    <primitive
                        object={l1.object}
                        rotation={[Math.PI / 2, 0, 0]}
                        position={[0, 0, 0.0042]}
                    />

                    <group position={[0, 0, l1.length]}>
                        <group
                            position={[0, 0, j4.fixedFlangeFromCentreLine]}
                            rotation={[Math.PI / 2, 0, -Math.PI / 2]}
                        >
                            <primitive object={j4.object} rotation={[Math.PI / 2, 0, 0]} />
                        </group>
                    </group>
                </group>
            </group>
        </group>
    )
}
