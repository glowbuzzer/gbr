/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { MeshPhysicalMaterial } from "three"
import { Box } from "@react-three/drei"

export const InertiaCuboidHelper = ({ size, values }) => {
    const material = new MeshPhysicalMaterial({ color: "pink", transparent: true, opacity: 0.5 })

    return (
        <group scale={size}>
            <Box args={values.map(v => Math.pow(v * 1000000, 1 / 3))} material={material} />
        </group>
    )
}
