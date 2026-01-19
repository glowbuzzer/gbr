/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useRef } from "react"
import { Plane } from "@react-three/drei"
import { useScale } from "../util"

export const DefaultLighting = () => {
    const pointLightRef = useRef(null)
    const { extent } = useScale()
    const distance = extent * 2

    return (
        <>
            <ambientLight color={"grey"} />
            <pointLight
                position={[0, 0, distance]}
                color={"white"}
                ref={pointLightRef}
                castShadow={false}
                distance={distance * 2}
                shadow-mapSize-height={512}
                shadow-mapSize-width={512}
                shadow-radius={10}
                shadow-bias={-0.0001}
            />
            <Plane receiveShadow position={[0, -1, 0]} args={[distance, distance]}>
                <shadowMaterial attach="material" opacity={0.1} />
            </Plane>
        </>
    )
}
