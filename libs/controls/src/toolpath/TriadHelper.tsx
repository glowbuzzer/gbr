/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as THREE from "three"

export const triadArrowVectors = [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, 1)
]
export const triadArrowColors = [0xff0000, 0x00ff00, 0x0000ff]

/**
 * @ignore - internal to the tool path tile
 */
export const TriadHelper = ({ size }) => {
    return (
        <>
            {triadArrowVectors.map((v, i) => (
                <arrowHelper
                    key={i}
                    args={[v, undefined, size, triadArrowColors[i], undefined, size / 10]}
                />
            ))}
        </>
    )
}
