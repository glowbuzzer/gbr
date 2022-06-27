/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

/*
 (c) 2013, Vladimir Agafonkin
 Simplify.js, a high-performance JS polyline simplification library
 mourner.github.io/simplify-js

 Modified by glowbuzzer to add z-axis and handle null values (eg. relative gcode)
*/

function safe(v) {
    return v || 0
}

// square distance from a point to a segment
function getSqSegDist(p, p1, p2) {
    let x = safe(p1.x),
        y = safe(p1.y),
        z = safe(p1.z),
        dx = safe(p2.x) - x,
        dy = safe(p2.y) - y,
        dz = safe(p2.z) - z

    if (dx !== 0 || dy !== 0 || dz !== 0) {
        const t = ((p.x - x) * dx + (p.y - y) * dy + (p.z - z) * dz) / (dx * dx + dy * dy + dz * dz)

        if (t > 1) {
            x = safe(p2.x)
            y = safe(p2.y)
            z = safe(p2.z)
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

function can_simplify(p1, p2 /*, p3*/) {
    const points = [
        [p1.x, p2.x /*, p3.x*/],
        [p1.y, p2.y /*, p3.y*/],
        [p1.z, p2.z /*, p3.z*/]
    ]

    // can only simplify if every axis is either all null or all non-null
    return points.every(axis => axis.every(p => p === null) || !axis.some(p => p === null))
}

function simplifyDPStep(points, first, last, sqTolerance, simplified) {
    let maxSqDist = -1,
        index = first + 1

    if (can_simplify(points[first], points[last])) {
        for (let i = first + 1; i < last; i++) {
            const sqDist = getSqSegDist(points[i], points[first], points[last])

            if (sqDist > maxSqDist) {
                index = i
                maxSqDist = sqDist
            }
        }
    }

    if (maxSqDist < 0 || maxSqDist > sqTolerance) {
        if (index - first > 1) {
            simplifyDPStep(points, first, index, sqTolerance, simplified)
        }

        simplified.push(points[index])

        if (last - index > 1) {
            simplifyDPStep(points, index, last, sqTolerance, simplified)
        }
    }
}

// simplification using Ramer-Douglas-Peucker algorithm
function simplifyDouglasPeucker(points, sqTolerance) {
    if (points.length <= 2) {
        // need more than two points to simplify!
        return points
    }
    const last = points.length - 1
    const simplified = [points[0]]

    simplifyDPStep(points, 0, last, sqTolerance, simplified)

    simplified.push(points[last])
    return simplified
}

// both algorithms combined for awesome performance
export function simplify(points, tolerance) {
    const sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1

    // TODO: do we care about the high quality pass (if so needs to be adapted to handle nulls!)
    // points = highestQuality ? points : simplifyRadialDistance(points, sqTolerance)
    points = simplifyDouglasPeucker(points, sqTolerance)

    return points
}
