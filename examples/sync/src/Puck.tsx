/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React from "react"
import { Euler, Vector3 } from "three"

export const Puck = () => {
    return (
        <mesh rotation={new Euler(Math.PI / 2, 0, 0)} position={new Vector3(0, 0, 5)}>
            <cylinderBufferGeometry attach="geometry" args={[50, 50, 10, 16]} />
            <meshBasicMaterial attach="material" color="grey" />
        </mesh>
    )
}
