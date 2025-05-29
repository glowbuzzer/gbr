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
export const TriadHelper = ({
    size,
    opacity = 1,
    include = [0, 1, 2]
}: {
    size: number
    opacity?: number
    include?: number[]
}) => {
    return (
        <group>
            {include.map(axis => {
                const v = triadArrowVectors[axis]
                return (
                    <arrowHelperWithOpacity
                        key={axis + ":" + size}
                        args={[
                            v,
                            undefined,
                            size,
                            triadArrowColors[axis],
                            opacity,
                            undefined,
                            size / 10
                        ]}
                    />
                )
            })}
        </group>
    )
}
