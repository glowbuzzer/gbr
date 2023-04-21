import * as React from "react"
import { useRef, useState, useEffect, useCallback } from "react"
import * as THREE from "three"
import {
    Box,
    Sphere,
    Cylinder,
    useGLTF,
    useTexture,
    PivotControls,
    meshBounds,
    Shadow,
    Html
} from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
// import {useSpring, a} from "@react-spring/web"
import { useSpring } from "@react-spring/core"
import { a } from "@react-spring/three"
import {
    useConnection,
    useFrames,
    useKinematicsCartesianPosition,
    useIntegerOutputState
} from "@glowbuzzer/store"

import niceColors from "nice-color-palettes"

export const ExamplePendulum = () => {
    const bossRef = useRef(null)
    const shaftRef = useRef(null)
    const pendulumGroup = useRef(null)

    const shaftLength: number = 500

    const intOut = useIntegerOutputState(0)

    useFrame(() => {
        pendulumGroup.current.rotation.y = intOut[0].effectiveValue / 10
    })

    return (
        <>
            <Html
                style={{
                    width: "500px"
                }}
                position={[-1000, 1000, 0]}
            >
                <h1>
                    Example 11 - moving an object with a integer input value (set value of integer
                    output #0 to see
                </h1>
            </Html>

            <group ref={pendulumGroup} position={[500, 500, 500]}>
                <Cylinder
                    ref={shaftRef}
                    args={[10, 10, 500, 64]}
                    position={[0, 0, -500 / 2]}
                    rotation={[Math.PI / 2, 0, 0]}
                >
                    <meshStandardMaterial color={niceColors[17][2]} />
                </Cylinder>
                <Cylinder ref={bossRef} args={[50, 50, 50, 64]}>
                    <meshStandardMaterial color={niceColors[17][2]} />
                </Cylinder>
            </group>
        </>
    )
}
