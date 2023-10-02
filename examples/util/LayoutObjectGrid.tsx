/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { TriadHelper } from "@glowbuzzer/controls"
import React from "react"

export const LayoutObjectGrid = ({ objects }) => {
    return (
        <group position={[-1800, -1300, 100]} scale={1000}>
            {objects.map((object, index) => {
                const col = index % 3
                const row = Math.floor(index / 3)
                return (
                    <group key={index} position={[col * 0.4, row * 0.6, 0]}>
                        <TriadHelper size={0.4} />
                        <primitive object={object.clone()} />
                    </group>
                )
            })}
        </group>
    )
}
