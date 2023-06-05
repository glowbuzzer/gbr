/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useFrame, useThree } from "@react-three/fiber"
import React, { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { Mesh } from "three"
import { PneumaticCylinder } from "./PneumaticCylinder"
import { useGLTF } from "@react-three/drei"
import { useRawJointPositions } from "@glowbuzzer/store"

export const ConveyorBelt = ({ position }) => {
    const meshRef = useRef<Mesh>()
    const SPACED_POINTS = 200
    const BELT_LENGTH = 17.25

    const texture = useMemo(() => {
        const c = document.createElement("canvas")
        c.width = c.height = 256
        const ctx = c.getContext("2d")
        ctx.fillStyle = "#c0c0c0"
        ctx.fillRect(0, 0, c.width, c.height)
        ctx.strokeStyle = "white"
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineWidth = 100
        ctx.lineTo(c.width, c.height)
        ctx.stroke()

        const texture = new THREE.CanvasTexture(c)
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.MirroredRepeatWrapping
        texture.repeat.set(10, 2)

        return texture
    }, [])

    useEffect(() => {
        if (meshRef.current) {
            // @ts-ignore
            meshRef.current.material.map.offset.x = -position / 170
            meshRef.current.matrixWorldNeedsUpdate = true
        }
    }, [position])

    const path = new THREE.Path()
    path.absarc(BELT_LENGTH, 0, 1, Math.PI * 0.5, Math.PI * 1.5, true)
    path.absarc(-BELT_LENGTH, 0, 1, Math.PI * 1.5, Math.PI * 0.5, true)
    path.closePath()
    const basePts = path.getSpacedPoints(SPACED_POINTS).reverse()
    const geometry = new THREE.PlaneGeometry(1, 1, SPACED_POINTS, 1)

    basePts.forEach((p, idx) => {
        geometry.attributes.position.setXYZ(idx, p.x, p.y, -2)
        geometry.attributes.position.setXYZ(idx + SPACED_POINTS + 1, p.x, p.y, 2)
    })

    return (
        <mesh ref={meshRef} geometry={geometry}>
            <meshBasicMaterial attach="material" side={THREE.BackSide} map={texture} />
        </mesh>
    )
}

export const Conveyor = ({ jointIndex, rotateConveyor = false, rotateBelt = false }) => {
    const jointPos = useRawJointPositions()[jointIndex] || 0

    const [conveyor] = useMemo(
        () =>
            useGLTF(
                [
                    "D1042976122V2-PM_CONVEYOR.glb"
                    // "D1042976122V2-PM_CONVEYOR_NO_BELT.glb"
                    // @ts-ignore
                ].map(j => `${import.meta.env.BASE_URL}assets/${j}`)
            ).map(m => m.scene.clone()),
        []
    )

    const conveyor_rotation = rotateConveyor ? [0, Math.PI, 0] : [Math.PI, 0, 0]
    const factor = rotateBelt ? 1 : -1

    return (
        <group position={[0, 0, 0.3]}>
            <primitive object={conveyor} rotation={conveyor_rotation} />
            <group
                scale={[0.022, 0.022, 0.02]}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[factor * 0.338, 0, -0.003]}
            >
                <ConveyorBelt position={jointPos} />
            </group>
        </group>
    )
}
