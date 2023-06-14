/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { Canvas, useThree } from "@react-three/fiber"
import { useEffect } from "react"
import { BoxGeometry, BufferGeometry, Mesh, MeshBasicMaterial, Vector3 } from "three"
import { OrbitControls } from "@react-three/drei"
import styled from "styled-components"
import { Face3, Geometry, GeometryUtils } from "three-stdlib"
import * as THREE from "three"

function generateCuboid(width, height, depth, grid) {
    let geometry = new Geometry()

    // Generate bottom and sides (5 faces)
    geometry.vertices.push(
        new Vector3(0, 0, 0), // 0 - Bottom face vertices
        new Vector3(width, 0, 0), // 1
        new Vector3(width, 0, depth), // 2
        new Vector3(0, 0, depth), // 3
        new Vector3(0, height, 0), // 4 - Side face vertices
        new Vector3(width, height, 0), // 5
        new Vector3(width, height, depth), // 6
        new Vector3(0, height, depth) // 7
    )

    geometry.faces.push(
        new Face3(0, 1, 2), // Bottom face
        new Face3(0, 2, 3),
        new Face3(0, 1, 5), // Side faces
        new Face3(0, 5, 4),
        new Face3(1, 2, 6),
        new Face3(1, 6, 5),
        new Face3(2, 3, 7),
        new Face3(2, 7, 6),
        new Face3(3, 0, 4),
        new Face3(3, 4, 7)
    )

    // Generate top face (grid)
    let dx = width / (grid - 1)
    let dz = depth / (grid - 1)
    for (let i = 0; i < grid; i++) {
        for (let j = 0; j < grid; j++) {
            geometry.vertices.push(new Vector3(i * dx, height, j * dz))
        }
    }

    let offset = 8 // We have already added 8 vertices for the bottom and sides
    for (let i = 0; i < grid - 1; i++) {
        for (let j = 0; j < grid - 1; j++) {
            let topLeft = i * grid + j + offset
            let topRight = topLeft + 1
            let bottomLeft = (i + 1) * grid + j + offset
            let bottomRight = bottomLeft + 1

            geometry.faces.push(new Face3(topLeft, bottomLeft, topRight))
            geometry.faces.push(new Face3(bottomLeft, bottomRight, topRight))
        }
    }

    geometry.computeFaceNormals()
    geometry.computeVertexNormals()

    return geometry.toBufferGeometry()
}

const BoxWithCutout = () => {
    const { scene } = useThree()

    useEffect(() => {
        const box = generateCuboid(1, 1, 1, 10)
        const material = new MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
        const mesh = new Mesh(box, material)
        scene.add(mesh)
    }, [])

    return null
}

const StyledDiv = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
`

export const Demo = () => {
    return (
        <StyledDiv>
            <h1>Test</h1>
            <Canvas>
                <OrbitControls />
                <ambientLight />
                <BoxWithCutout />
            </Canvas>
        </StyledDiv>
    )
}
