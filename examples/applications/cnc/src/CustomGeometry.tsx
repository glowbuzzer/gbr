/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { BufferGeometry, Float32BufferAttribute, Line3, Vector3 } from "three"
import { mod } from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements"

export class CustomGeometry extends BufferGeometry {
    private readonly resolution: number
    private readonly depth: number
    constructor(width: number, height: number, depth: number, resolution: number) {
        super()

        this.resolution = resolution
        this.depth = depth

        const indices = []
        const vertices = []
        const normals = []
        const uvs = []

        let numberOfVertices = 0

        buildPlane("x", "y", "z", 1, -1, width, height, depth, resolution) // pz
        buildPlane("z", "y", "x", -1, -1, depth, height, width, 1) // px
        buildPlane("z", "y", "x", 1, -1, depth, height, -width, 1) // nx
        buildPlane("x", "z", "y", 1, 1, width, depth, height, 1) // py
        buildPlane("x", "z", "y", 1, -1, width, depth, -height, 1) // ny
        buildPlane("x", "y", "z", -1, -1, width, height, -depth, 1) // nz

        // build geometry

        this.setIndex(indices)
        this.setAttribute("position", new Float32BufferAttribute(vertices, 3))
        this.setAttribute("normal", new Float32BufferAttribute(normals, 3))
        // this.setAttribute("uv", new Float32BufferAttribute(uvs, 2))

        function buildPlane(u, v, w, udir, vdir, width, height, depth, grid) {
            const segmentWidth = width / grid
            const segmentHeight = height / grid

            const widthHalf = width / 2
            const heightHalf = height / 2
            const depthHalf = depth / 2

            let vertexCounter = 0

            const vector = new Vector3()

            // generate vertices, normals and uvs

            for (let iy = 0; iy <= grid; iy++) {
                const y = iy * segmentHeight - heightHalf

                for (let ix = 0; ix <= grid; ix++) {
                    const x = ix * segmentWidth - widthHalf

                    // set values to correct vector component

                    vector[u] = x * udir
                    vector[v] = y * vdir
                    vector[w] = depthHalf

                    // now apply vector to vertex buffer
                    vertices.push(vector.x, vector.y, vector.z)

                    // set values to correct vector component

                    vector[u] = 0
                    vector[v] = 0
                    vector[w] = depth > 0 ? 1 : -1

                    // now apply vector to normal buffer

                    normals.push(vector.x, vector.y, vector.z)

                    // uvs

                    uvs.push(ix / grid)
                    uvs.push(1 - iy / grid)

                    // counters

                    vertexCounter += 1
                }
            }

            for (let iy = 0; iy < grid; iy++) {
                for (let ix = 0; ix < grid; ix++) {
                    const a = numberOfVertices + ix + (grid + 1) * iy
                    const b = numberOfVertices + ix + (grid + 1) * (iy + 1)
                    const c = numberOfVertices + (ix + 1) + (grid + 1) * (iy + 1)
                    const d = numberOfVertices + (ix + 1) + (grid + 1) * iy

                    // faces

                    indices.push(a, b, d)
                    indices.push(b, c, d)

                    // increase counter

                    // groupCount += 6;
                }
            }

            numberOfVertices += vertexCounter
        }
    }

    addSegment(start: Vector3, end: Vector3, width: number, depth: number) {
        const vertices = this.getAttribute("position")

        console.log("add segment", start, end)

        const grid = this.resolution
        const line = new Line3(start, end)
        const point = new Vector3()
        const point_on_line = new Vector3()
        let modified = false
        for (let iy = 0; iy <= grid; iy++) {
            for (let ix = 0; ix <= grid; ix++) {
                const index = ix + (grid + 1) * iy
                const x = vertices.getX(index)
                const y = vertices.getY(index)

                point.set(x, y, 0)
                line.closestPointToPoint(point, true, point_on_line)
                const d = point_on_line.distanceTo(point)

                if (d < width) {
                    modified = true
                    vertices.setZ(index, Math.min(depth, vertices.getZ(index)))
                }
            }
        }
        vertices.needsUpdate = modified
        if (modified) {
            this.computeVertexNormals()
        }
    }

    reset() {
        const vertices = this.getAttribute("position")
        const grid = this.resolution
        for (let i = 0; i < grid * grid; i++) {
            vertices.setZ(i, this.depth / 2)
        }
        vertices.needsUpdate = true
        this.computeVertexNormals()
    }
}
