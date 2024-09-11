/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { useEnvelopeProvider } from "./provider"
import { useMemo, useRef } from "react"
import {
    InstancedMesh,
    Matrix4,
    MeshBasicMaterial,
    Quaternion,
    SphereGeometry,
    Vector3
} from "three"
import { useFrame } from "@react-three/fiber"

export const EnvelopePoints = () => {
    const { points } = useEnvelopeProvider()
    const meshRef = useRef<InstancedMesh>()

    const [geo, materials] = useMemo(() => {
        const geo = new SphereGeometry(1, 32, 32) // Create a sphere geometry
        const materials = {
            defined: new MeshBasicMaterial({ color: "green" }),
            singular: new MeshBasicMaterial({ color: "red" }),
            default: new MeshBasicMaterial({ color: "grey" })
        }

        return [geo, materials]
    }, [])

    useFrame(() => {
        const mesh = meshRef.current!
        if (mesh) {
            points.forEach((p, i) => {
                const scale = p.singularity !== undefined ? (p.singularity ? 10 : 3) : 3
                const matrix = new Matrix4().compose(
                    new Vector3(p.x, p.y, p.z),
                    new Quaternion(),
                    new Vector3(scale, scale, scale)
                )
                mesh.setMatrixAt(i, matrix)
                mesh.setColorAt(
                    i,
                    p.singularity !== undefined
                        ? p.singularity
                            ? materials.singular.color
                            : materials.defined.color
                        : materials.default.color
                )
            })
            mesh.instanceMatrix.needsUpdate = true
            mesh.instanceColor.needsUpdate = true
        }
    })

    return (
        <instancedMesh ref={meshRef} args={[geo, null, points.length]}>
            <meshBasicMaterial />
        </instancedMesh>
    )
}
