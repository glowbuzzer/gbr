/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useLayoutEffect, useMemo, useRef } from "react"
import { Vector3 } from "three"
import { CustomGeometry } from "./CustomGeometry"
import {
    MachineState,
    useFrames,
    useKinematicsConfiguration,
    useMachine,
    useToolConfig,
    useToolIndex,
    useTrace
} from "@glowbuzzer/store"

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

const BLOCK_DEPTH = 20

export const CutterSimulation = () => {
    const { currentState } = useMachine()
    const { convertToFrame } = useFrames()
    const toolIndex = useToolIndex(0)
    const { diameter } = useToolConfig(toolIndex)
    const { frameIndex } = useKinematicsConfiguration(0)
    const prev = useRef<Vector3>()
    const { last, path } = useTrace(0)

    const geometry = useMemo(() => {
        const customGeometry = new CustomGeometry(300, 200, BLOCK_DEPTH, 400)
        customGeometry.computeVertexNormals()
        return customGeometry
    }, [])

    useLayoutEffect(() => {
        if (last) {
            const pos_world = convertToFrame(
                last.position.translation,
                { x: 0, y: 0, z: 0, w: 1 },
                frameIndex,
                "world"
            )
            const p = new Vector3()
            const { x, y, z } = pos_world.translation
            p.set(x, y, 0)
            if (prev.current) {
                const depth = Math.min(z, prev.current.z)
                if (depth < BLOCK_DEPTH) {
                    const s = prev.current.clone().setZ(0)
                    geometry.addSegment(s, p, diameter / 2, depth - BLOCK_DEPTH / 2)
                }
            }
            prev.current = p.setZ(z)
        }
    }, [last, geometry])

    useLayoutEffect(() => {
        if (currentState === MachineState.OPERATION_ENABLED) {
            geometry.reset()
        }
    }, [geometry, currentState])

    return (
        <mesh geometry={geometry} position={[0, 0, BLOCK_DEPTH / 2]}>
            <meshPhysicalMaterial
                color={"#cccccc"}
                envMapIntensity={0.1}
                metalness={0.5}
                roughness={0.5}
            />
        </mesh>
    )
}
