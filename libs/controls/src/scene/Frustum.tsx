/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { DoubleSide, Euler, Vector3 } from "three"
import { useKinematicsExtents } from "@glowbuzzer/store"

type FrustumProps = {
    scale?: number
}

/**
 * The Frustum component renders a conical frustum with a given scale. You can use this to represent the position of a tool
 * at the end of a kinematics chain. The frustum is rendered with a semi-transparent material.
 */
export const Frustum = ({ scale }: FrustumProps) => {
    const { max } = useKinematicsExtents()

    const frustumWidth = 0.05 * (scale || max)
    const frustumHeight = 0.4 * (scale || max)

    const adjusted_position = new Vector3(0, 0, frustumHeight / 2)

    return (
        <mesh position={adjusted_position} rotation={new Euler(-Math.PI / 2, 0, 0)}>
            <coneGeometry args={[frustumWidth, frustumHeight, 3]} />
            <meshPhongMaterial
                color="#000099"
                opacity={0.1}
                transparent={true}
                side={DoubleSide}
                flatShading={true}
            />
        </mesh>
    )
}
