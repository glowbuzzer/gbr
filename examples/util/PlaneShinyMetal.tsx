/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React from "react"
import { useScale } from "@glowbuzzer/controls"
import { Plane } from "@react-three/drei"
import { useTheme } from "styled-components"

export const PlaneShinyMetal = () => {
    const { extent } = useScale()
    const distance = extent * 2

    const theme = useTheme()

    return (
        <Plane args={[distance, distance]} position={[0, 0, -1]}>
            <meshPhysicalMaterial
                color={theme.colorPrimaryBg}
                envMapIntensity={1}
                metalness={0.05}
                roughness={0.1}
            />
        </Plane>
    )
}
