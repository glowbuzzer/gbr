/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { AwTubeLoadedRobotParts } from "../../types"
import React from "react"

export const AwTubeLink4 = ({ parts }: { parts: AwTubeLoadedRobotParts }) => {
    const { j3, f2, l1, f3, j4 } = parts
    return (
        <group>
            <group position={[0, 0, j3.moveableFlangeFromCentreLine]}>
                <primitive object={f2.object} rotation={[-Math.PI / 2, 0, 0]} />

                <group position={[0, 0, f2.offset]}>
                    <primitive object={l1.object} rotation={[-Math.PI / 2, 0, 0]} />

                    <group position={[0, 0, l1.length]}>
                        <primitive
                            object={f3.object}
                            rotation={[Math.PI / 2, 0, 0]}
                            position={[0, 0, f3.offset]}
                        />

                        <group
                            position={[0, 0, f3.offset + j4.fixedFlangeFromCentreLine]}
                            rotation={[Math.PI / 2, 0, -Math.PI / 2]}
                        >
                            <primitive object={j4.object} rotation={[-Math.PI / 2, 0, 0]} />
                        </group>
                    </group>
                </group>
            </group>
        </group>
    )
}
