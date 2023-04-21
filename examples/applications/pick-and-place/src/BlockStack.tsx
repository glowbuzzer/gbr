/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React from "react"
import { Vector3 } from "three"
import { Edges } from "@react-three/drei"
import { Block } from "./Block"

export const BlockStack = ({ count, position }) => {
    const blocks = Array.from({ length: count }, (_, i) => i)
    const [x, y, z] = position
    return (
        <group>
            {blocks.map(block => (
                <Block key={block} position={new Vector3(x, y, z + block * 100)} />
            ))}
        </group>
    )
}
