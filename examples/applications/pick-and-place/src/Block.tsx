/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { Vector3 } from "three"
import { Box, Edges } from "@react-three/drei"
import React from "react"

export const Block = ({ position }: { position: Vector3 }) => {
    return (
        <Box position={position} scale={new Vector3(100, 100, 100)}>
            <meshPhysicalMaterial envMapIntensity={1} metalness={1} roughness={0.2} />
            <Edges />
        </Box>
    )
}
