/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { Cone, Cylinder } from "@react-three/drei"
import React from "react"
import { transparent_material } from "../util"

export const PointedCylinder = ({ length, rotation = [0, 0, 0], doubleEnded = false }) => {
    const points_length = doubleEnded ? 20 : 10
    if (length < points_length) {
        // cannot fit cone on top
        return null
    }
    const cylinderLength = length - points_length
    return (
        <group rotation={rotation as any}>
            {doubleEnded && (
                <Cone
                    args={[10, 10, 32]}
                    material={transparent_material}
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, 0, 5]}
                />
            )}

            <Cylinder
                args={[10, 10, cylinderLength, 32]}
                material={transparent_material}
                position={[0, 0, cylinderLength / 2 + (doubleEnded ? 10 : 0)]}
                rotation={[Math.PI / 2, 0, 0]}
            />

            <Cone
                args={[10, 10, 32]}
                material={transparent_material}
                position={[0, 0, cylinderLength + (doubleEnded ? 15 : 5)]}
                rotation={[Math.PI / 2, 0, 0]}
            />
        </group>
    )
}
