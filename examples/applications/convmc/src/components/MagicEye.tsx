/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useMemo } from "react"
import { useGLTF } from "@react-three/drei"
import { Euler, Vector3 } from "three"

const ROTATION = new Euler(Math.PI, 0, Math.PI / 12)
const BASE_POSITION = new Vector3(0.25, -0.08, 0.36)
const RHS_POSITION = new Vector3(0.05, 0.255, 0)

/**
 * Simple component to display the magic eye sensor. The animated part is the laser beam which is a separate component
 */
export const MagicEye = () => {
    const [lhs, rhs] = useMemo(
        () =>
            useGLTF(
                [
                    "75M-PE-1-LHS.glb",
                    "75M-PE-1-RHS.glb"
                    // @ts-ignore
                ].map(j => `${import.meta.env.BASE_URL}assets/${j}`)
            ).map(m => m.scene.clone()),
        []
    )

    return (
        <group rotation={ROTATION} position={BASE_POSITION}>
            <primitive object={lhs} />
            <primitive object={rhs} position={RHS_POSITION} />
        </group>
    )
}
