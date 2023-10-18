/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as THREE from "three"
import React from "react"
import { Html } from "@react-three/drei"

export const InertiaTriadHelper = ({ size, moments }) => {
    const triadArrowVectors = [
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 1)
    ]
    return (
        <group>
            {triadArrowVectors.map((v, i) => (
                <group key={i}>
                    <arrowHelper args={[v, undefined, size, "pink", undefined, size / 10]} />
                    <Html
                        position={v.clone().multiplyScalar(size)}
                        style={{ color: "pink", width: "300px", userSelect: "none" }}
                    >
                        I{["x", "y", "z"][i]}
                        {moments[i].toFixed(4)}
                    </Html>
                </group>
            ))}
        </group>
    )
}
