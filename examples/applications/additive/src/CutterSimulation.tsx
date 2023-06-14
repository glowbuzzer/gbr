/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import {
    BoxGeometry,
    BufferGeometry,
    CylinderGeometry,
    Euler,
    Mesh,
    Quaternion,
    Vector3
} from "three"
import { Brush, Evaluator, SUBTRACTION } from "three-bvh-csg"
import { useKinematicsCartesianPosition } from "@glowbuzzer/store"

function estimateBytesUsed(geometry) {
    // Return the estimated memory used by this geometry in bytes
    // Calculate using itemSize, count, and BYTES_PER_ELEMENT to account
    // for InterleavedBufferAttributes.
    let mem = 0
    for (const name in geometry.attributes) {
        const attr = geometry.getAttribute(name)
        mem += attr.count * attr.itemSize * attr.array.BYTES_PER_ELEMENT
    }

    const indices = geometry.getIndex()
    mem += indices ? indices.count * indices.itemSize * indices.array.BYTES_PER_ELEMENT : 0
    return mem
}

export const CutterSimulation = () => {
    const { position } = useKinematicsCartesianPosition(0)
    const rootRef = useRef<Brush>(new Brush(new BoxGeometry(400, 300, 100)))
    const cutterRef = useRef<Brush>(new Brush(new CylinderGeometry(1, 1, 30, 10)))
    const evRef = useRef<Evaluator>(Object.assign(new Evaluator(), { useGroups: false }))
    const [geometry, setGeometry] = useState<BufferGeometry>(new BoxGeometry(300, 200, 100))
    const meshRef = useRef<Mesh>()

    useLayoutEffect(() => {
        const rotation = new Quaternion().setFromEuler(new Euler(Math.PI / 2, 0, 0))
        const scale = new Vector3(1, 1, 1)
        const { x, y, z } = position.translation
        const pos = new Vector3(x, y, z)

        cutterRef.current.matrixWorld.compose(pos, rotation, scale)
        evRef.current.evaluate(rootRef.current, cutterRef.current, SUBTRACTION, rootRef.current)
        meshRef.current.geometry.dispose()
        meshRef.current.geometry = rootRef.current.geometry

        console.log(estimateBytesUsed(rootRef.current.geometry))
    }, [position])

    return (
        <mesh ref={meshRef}>
            <meshPhysicalMaterial
                color={"#999999"}
                envMapIntensity={1}
                metalness={0.05}
                roughness={0.1}
            />
        </mesh>
    )
}
