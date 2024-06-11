/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { edgeTable, triTable as triTableOrig } from "three-stdlib"
import {
    BufferGeometry,
    DoubleSide,
    Float32BufferAttribute,
    Mesh,
    MeshLambertMaterial,
    MeshStandardMaterial,
    Vector3
} from "three"

// @ts-ignore
import singularities from "./singularities.json"

const { minAxis, maxAxis, step, data } = singularities
const mid = (maxAxis - minAxis) / 2 / step

// re-create simple boolean array from the bit-packed data
export const values = data.flatMap((d: number) => {
    return Array.from({ length: 16 }).map((_, i) => {
        return !!(d & (1 << i))
    })
})

export function is_near_singularity(x: number, y: number, z: number): boolean {
    // test all adjacent points to the given point
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            for (let k = z - 1; k <= z + 1; k++) {
                const value = values[i + j * count + k * count * count]
                if (value || value === undefined) {
                    return true
                }
            }
        }
    }
    return false
}

export function find_safe_z(position: Vector3): number {
    const min_limit = minAxis / step + 1 + mid
    const max_limit = maxAxis / step - 1 + mid

    const x = Math.round(position.x / step) + mid
    const y = Math.round(position.y / step) + mid
    const z_slot = Math.round(position.z / step) + mid
    const z_base = Math.min(Math.max(z_slot, min_limit), max_limit)

    // we can't evaluate if outside of the grid in the x-y plane
    if (x < min_limit || x > max_limit || y < min_limit || y > max_limit) {
        throw new Error("Position out of bounds of the robot in the X-Y plane")
    }

    // test if we need to move the lift at all
    if (!is_near_singularity(x, y, z_base)) {
        return position.z
    }

    const minmax = [Math.max(min_limit, z_base), Math.min(max_limit, z_base)]

    const search = [min_limit, max_limit].map((limit, index) => ({
        z: minmax[index],
        singularity: true,
        distance: 0,
        increment: index === 0 ? -1 : 1,
        limit
    }))
    while (search.some(s => s.z !== s.limit && s.singularity)) {
        search
            .filter(s => s.z !== s.limit && s.singularity)
            .forEach(s => {
                s.z += s.increment
                s.distance = Math.abs(s.z - z_base)
                if (s.singularity) {
                    s.singularity = is_near_singularity(x, y, s.z)
                }
            })
    }
    const solution = search
        .filter(s => !s.singularity)
        .sort((a, b) => a.distance - b.distance)
        .shift()

    if (!solution) {
        console.error("FAILED TO FIND SAFE Z!")
        return 0
    }

    return (solution.z - mid) * step
}

// generate x,y,z coords in the same order as they were created, for easy lookup by index
function* generator() {
    for (let z = minAxis; z <= maxAxis; z += step) {
        for (let y = minAxis; y <= maxAxis; y += step) {
            for (let x = minAxis; x <= maxAxis; x += step) {
                yield new Vector3(x, y, z)
            }
        }
    }
}

const count = (maxAxis - minAxis) / step + 1
const count2 = count * count
export const points = Array.from(generator())

// threejs voodoo
const triTable = triTableOrig as unknown as number[]

export function create_mesh() {
    const positions = [] // Array to store vertex positions
    const indices = [] // Array to store indices of vertices for faces

    const vlist = new Array(12)

    // Marching Cubes Algorithm
    // https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Marching-Cubes.html

    let vertexIndex = 0

    for (var z = 0; z < count - 1; z++)
        for (var y = 0; y < count - 1; y++)
            for (var x = 0; x < count - 1; x++) {
                // index of base point, and also adjacent points on cube
                var p = x + count * y + count2 * z,
                    px = p + 1,
                    py = p + count,
                    pxy = py + 1,
                    pz = p + count2,
                    pxz = px + count2,
                    pyz = py + count2,
                    pxyz = pxy + count2

                // store scalar values corresponding to vertices
                var value0 = values[p],
                    value1 = values[px],
                    value2 = values[py],
                    value3 = values[pxy],
                    value4 = values[pz],
                    value5 = values[pxz],
                    value6 = values[pyz],
                    value7 = values[pxyz]

                // place a "1" in bit positions corresponding to vertices whose
                //   isovalue is less than given constant.

                var isolevel = 0

                var cubeindex = 0
                if (value0 /*< isolevel*/) cubeindex |= 1
                if (value1 /*< isolevel*/) cubeindex |= 2
                if (value2 /*< isolevel*/) cubeindex |= 8
                if (value3 /*< isolevel*/) cubeindex |= 4
                if (value4 /*< isolevel*/) cubeindex |= 16
                if (value5 /*< isolevel*/) cubeindex |= 32
                if (value6 /*< isolevel*/) cubeindex |= 128
                if (value7 /*< isolevel*/) cubeindex |= 64

                // bits = 12 bit number, indicates which edges are crossed by the isosurface
                var bits = edgeTable[cubeindex] as unknown as number

                // if none are crossed, proceed to next iteration
                if (bits === 0) continue

                // check which edges are crossed, and estimate the point location
                //    using a weighted average of scalar values at edge endpoints.
                // store the vertex in an array for use later.
                var mu = 0.5

                // bottom of the cube
                if (bits & 1) {
                    mu = (isolevel - value0) / (value1 - value0)
                    vlist[0] = points[p].clone().lerp(points[px], mu)
                }
                if (bits & 2) {
                    mu = (isolevel - value1) / (value3 - value1)
                    vlist[1] = points[px].clone().lerp(points[pxy], mu)
                }
                if (bits & 4) {
                    mu = (isolevel - value2) / (value3 - value2)
                    vlist[2] = points[py].clone().lerp(points[pxy], mu)
                }
                if (bits & 8) {
                    mu = (isolevel - value0) / (value2 - value0)
                    vlist[3] = points[p].clone().lerp(points[py], mu)
                }
                // top of the cube
                if (bits & 16) {
                    mu = (isolevel - value4) / (value5 - value4)
                    vlist[4] = points[pz].clone().lerp(points[pxz], mu)
                }
                if (bits & 32) {
                    mu = (isolevel - value5) / (value7 - value5)
                    vlist[5] = points[pxz].clone().lerp(points[pxyz], mu)
                }
                if (bits & 64) {
                    mu = (isolevel - value6) / (value7 - value6)
                    vlist[6] = points[pyz].clone().lerp(points[pxyz], mu)
                }
                if (bits & 128) {
                    mu = (isolevel - value4) / (value6 - value4)
                    vlist[7] = points[pz].clone().lerp(points[pyz], mu)
                }
                // vertical lines of the cube
                if (bits & 256) {
                    mu = (isolevel - value0) / (value4 - value0)
                    vlist[8] = points[p].clone().lerp(points[pz], mu)
                }
                if (bits & 512) {
                    mu = (isolevel - value1) / (value5 - value1)
                    vlist[9] = points[px].clone().lerp(points[pxz], mu)
                }
                if (bits & 1024) {
                    mu = (isolevel - value3) / (value7 - value3)
                    vlist[10] = points[pxy].clone().lerp(points[pxyz], mu)
                }
                if (bits & 2048) {
                    mu = (isolevel - value2) / (value6 - value2)
                    vlist[11] = points[py].clone().lerp(points[pyz], mu)
                }

                // construct triangles -- get correct vertices from triTable.
                var i = 0
                cubeindex <<= 4 // multiply by 16...
                // "Re-purpose cubeindex into an offset into triTable."
                //  since each row really isn't a row.

                // the while loop should run at most 5 times,
                //   since the 16th entry in each row is a -1.
                while (triTable[cubeindex + i] != -1) {
                    var index1 = triTable[cubeindex + i]
                    var index2 = triTable[cubeindex + i + 1]
                    var index3 = triTable[cubeindex + i + 2]

                    positions.push(vlist[index1].x, vlist[index1].y, vlist[index1].z)
                    positions.push(vlist[index2].x, vlist[index2].y, vlist[index2].z)
                    positions.push(vlist[index3].x, vlist[index3].y, vlist[index3].z)

                    indices.push(vertexIndex, vertexIndex + 1, vertexIndex + 2)

                    // geometry.faceVertexUvs[0].push([
                    //   new THREE.Vector2(0, 0),
                    //   new THREE.Vector2(0, 1),
                    //   new THREE.Vector2(1, 1),
                    // ]);

                    vertexIndex += 3
                    i += 3
                }
            }

    const geometry = new BufferGeometry()

    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3))
    geometry.setIndex(indices)
    geometry.computeVertexNormals()

    const colorMaterial = new MeshLambertMaterial({
        color: 0x00ff00,
        opacity: 0.4,
        transparent: true
        // side: DoubleSide
    })

    return new Mesh(geometry, colorMaterial)
}
