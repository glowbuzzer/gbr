/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useFrame, useJointPositions, useKinematicsConfiguration } from "@glowbuzzer/store"
import React, { useMemo } from "react"
import { useGLTF } from "@react-three/drei"
import { Quaternion, Vector3 } from "three"
import { TriadHelper } from "@glowbuzzer/controls"

export const IgusRobot = () => {
    const { frameIndex } = useKinematicsConfiguration(0)
    const { translation, rotation } = useFrame(frameIndex, false)

    const [j0, j1, j2, j3, j4] = useJointPositions(0)

    // load the parts of the robot (links)
    const [p0, p1, p2, p3, p4, p5] = useMemo(
        () => useGLTF([0, 1, 2, 3, 4, 5].map(j => `/assets/igus/L${j}.glb`)).map(m => m.scene),
        []
    )

    const position = new Vector3().copy(translation as any)
    const quaternion = new Quaternion().copy(rotation as any)

    const DEG90 = Math.PI / 2
    const DEG180 = Math.PI

    return (
        <group position={position} quaternion={quaternion} scale={1000}>
            <primitive object={p0} />
            <group rotation={[0, 0, j0]}>
                <primitive object={p1} />
                <group rotation={[-DEG90, 0, 0]}>
                    <group rotation={[0, 0, j1 - DEG90]}>
                        <primitive object={p2} />
                        <group rotation={[-DEG90, 0, 0]} position={[0.35, 0, 0]}>
                            <group rotation={[DEG90, 0, 0]} position={[0, 0, 0.0119]}>
                                <group rotation={[0, 0, j2]}>
                                    <primitive object={p3} />
                                    <group rotation={[DEG90, 0, 0]} position={[0.27, 0, 0]}>
                                        <group rotation={[-DEG90, 0, 0]} position={[0, 0, -0.0165]}>
                                            <group rotation={[0, 0, j3]}>
                                                <primitive object={p4} />
                                                <group
                                                    rotation={[-DEG90, DEG90, 0]}
                                                    position={[0.17, 0, 0]}
                                                >
                                                    <group rotation={[0, 0, j4 - DEG180]}>
                                                        <primitive object={p5} />
                                                        <group scale={1 / 1000}>
                                                            <TriadHelper size={200} />
                                                        </group>
                                                    </group>
                                                </group>
                                            </group>
                                        </group>
                                    </group>
                                </group>
                            </group>
                        </group>
                    </group>
                </group>
            </group>
        </group>
    )
}
