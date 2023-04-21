/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React from "react"
import { useScale } from "@glowbuzzer/controls"
import { Plane } from "@react-three/drei"

export const PlaneShinyMetal = () => {
    const { extent } = useScale()
    const distance = extent * 2

    return (
        <Plane args={[distance, distance]} position={[0, 0, -1]}>
            <meshPhysicalMaterial envMapIntensity={1} metalness={0.05} roughness={0.1} />
        </Plane>
    )
}
