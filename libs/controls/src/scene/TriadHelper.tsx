/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import * as THREE from "three"
import { extend, ReactThreeFiber } from "@react-three/fiber"
import { ArrowHelperWithOpacity } from "./ArrowHelperWithOpacity"

export const triadArrowVectors = [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, 1)
]
export const triadArrowColors = [0xff0000, 0x00ff00, 0x0000ff]

extend({ ArrowHelperWithOpacity })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            arrowHelperWithOpacity: ReactThreeFiber.Object3DNode<
                ArrowHelperWithOpacity,
                typeof ArrowHelperWithOpacity
            >
        }
    }
}

/**
 * The TriadHelper component renders a simple triad of colored arrows showing orientation.
 */
export const TriadHelper = ({ size, opacity = 1 }: { size: number; opacity?: number }) => {
    return (
        <group>
            {triadArrowVectors.map((v, i) => (
                <arrowHelperWithOpacity
                    key={i + ":" + size}
                    args={[v, undefined, size, triadArrowColors[i], opacity, undefined, size / 10]}
                />
            ))}
        </group>
    )
}
