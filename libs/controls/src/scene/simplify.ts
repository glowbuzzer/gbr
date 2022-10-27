/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

/*
 (c) 2013, Vladimir Agafonkin
 Simplify.js, a high-performance JS polyline simplification library
 mourner.github.io/simplify-js
*/

// hacked about by Alfie

// square distance from a point to a segment
function getSquareSegmentDistance(p, p1, p2) {
    let x = p1.x,
        y = p1.y,
        z = p1.z,
        dx = p2.x - x,
        dy = p2.y - y,
        dz = p2.z - z

    if (dx !== 0 || dy !== 0 || dz !== 0) {
        const t = ((p.x - x) * dx + (p.y - y) * dy + (p.z - z) * dz) / (dx * dx + dy * dy + dz * dz)

        if (t > 1) {
            x = p2.x
            y = p2.y
            z = p2.z
        } else if (t > 0) {
            x += dx * t
            y += dy * t
            z += dz * t
        }
    }

    dx = p.x - x
    dy = p.y - y
    dz = p.z - z

    return dx * dx + dy * dy + dz * dz
}

// simplification using optimized Douglas-Peucker algorithm with recursion elimination
function simplifyDouglasPeucker(points, sqTolerance) {
    const len = points.length
    const MarkerArray = typeof Uint8Array !== "undefined" ? Uint8Array : Array
    const markers = new MarkerArray(len)
    const stack = []
    const newPoints = []
    let first = 0
    let index = 0
    let last = len - 1
    let i
    let maxSqDist
    let sqDist

    markers[first] = markers[last] = 1

    while (last) {
        maxSqDist = 0

        for (i = first + 1; i < last; i++) {
            sqDist = getSquareSegmentDistance(points[i], points[first], points[last])

            if (sqDist > maxSqDist) {
                index = i
                maxSqDist = sqDist
            }
        }

        if (maxSqDist > sqTolerance) {
            markers[index] = 1
            stack.push(first, index, index, last)
        }

        last = stack.pop()
        first = stack.pop()
    }

    for (i = 0; i < len; i++) {
        if (markers[i]) {
            newPoints.push(points[i])
        }
    }

    return newPoints
}

type Point = {
    x: number
    y: number
    z: number
}
export default function simplify(points: Point[], tolerance): Point[] {
    const sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1
    return simplifyDouglasPeucker(points, sqTolerance)
}
