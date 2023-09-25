/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useFrame, useJointPositions, useKinematicsConfiguration } from "@glowbuzzer/store"
import { useGLTF } from "@react-three/drei"
import React, { useMemo } from "react"
import { Quaternion, Vector3 } from "three"

export const Puma560Robot = ({ children = null }) => {
    const { frameIndex } = useKinematicsConfiguration(0)

    const [j0, j1, j2, j3, j4, j5] = useJointPositions(0)

    const { translation, rotation } = useFrame(frameIndex, false)

    // load the parts of the robot (links)
    const [p0, p1, p2, p3, p4, p5] = useMemo(
        () => useGLTF([0, 1, 2, 3, 4, 5].map(j => `/assets/puma_560/L${j}.glb`)).map(m => m.scene),
        []
    )

    // we don't actually use the client-side FK/IK currently, but this is how you would do it

    // useEffect(() => {
    //     const pos = new THREE.Vector3()
    //     parts[5].localToWorld(pos)
    //
    //     console.log(pos)
    // }, [jointPositions])

    // const fk = fk_puma([0, 0, 0, 0, 0, 0], puma_560_dh)

    // const fk = fk_puma(
    //     [
    //         jointPositions[0],
    //         jointPositions[1],
    //         jointPositions[2],
    //         jointPositions[3],
    //         jointPositions[4],
    //         jointPositions[5]
    //     ],
    //     puma_560_params
    // )
    // console.log("fk", fk.position)
    // const ik = ik_puma(0, fk.position, fk.orientation, puma_560_params)
    // console.log("ik", ik)

    const DEG90 = Math.PI / 2
    const DEG180 = Math.PI

    const position = new Vector3().copy(translation as any)
    const quaternion = new Quaternion().copy(rotation as any)

    return (
        <group position={position} quaternion={quaternion} scale={1000}>
            <primitive object={p0} />
            <group position={[0, 0, -0.62357]} rotation={[Math.PI, 0, 0]}>
                <group rotation={[0, 0, j0 - DEG90]}>
                    <primitive object={p1} />
                    <group position={[-0.16764, 0, 0]} rotation={[Math.PI, DEG90, 0]}>
                        <group rotation={[0, 0, j1 + DEG180]}>
                            <primitive object={p2} />
                            <group position={[0, 0.4318, 0.0762]}>
                                <group rotation={[0, 0, j2 + DEG180]}>
                                    <primitive object={p3} />
                                    <group
                                        position={[0.37211, 0, -0.0381]}
                                        rotation={[0, DEG90, 0]}
                                    >
                                        <group rotation={[0, 0, j3]}>
                                            <primitive object={p4} />
                                            <group
                                                position={[0, 0, 0.05994]}
                                                rotation={[DEG90, 0, 0]}
                                            >
                                                <group rotation={[0, 0, j4 + Math.PI]}>
                                                    <primitive object={p5} />
                                                    <group rotation={[DEG90, 0, 0]}>
                                                        <group
                                                            position={[0, 0, 0.065]}
                                                            rotation={[0, 0, j5 + DEG90]}
                                                            scale={1 / 1000}
                                                        >
                                                            {children}
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
