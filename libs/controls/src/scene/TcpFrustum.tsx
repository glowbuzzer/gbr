/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { DoubleSide, Euler, Vector3 } from "three"

type TcpFrustumProps = {
    scale: number
    position: Vector3
}

/** @ignore - internal to the tool path tile */
export const TcpFrustum = ({ scale, position }: TcpFrustumProps) => {
    const frustumHeight = 0.4 * scale

    const adjusted_position = position.clone().add(new Vector3(0, 0, frustumHeight / 2))

    return (
        <mesh position={adjusted_position} rotation={new Euler(-Math.PI / 2, 0, 0)}>
            <coneBufferGeometry args={[0.05 * scale, frustumHeight, 3]} />
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
