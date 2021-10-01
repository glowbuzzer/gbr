/*
 (c) 2013, Vladimir Agafonkin
 Simplify.js, a high-performance JS polyline simplification library
 mourner.github.io/simplify-js
*/

// to suit your point format, run search/replace for '.x', '.y' and '.z';
// (configurability would draw significant performance overhead)

// square distance between 2 points
function getSquareDistance(p1, p2) {
    const dx = p1.x - p2.x,
        dy = p1.y - p2.y,
        dz = p1.z - p2.z

    return dx * dx + dy * dy + dz * dz
}

// square distance from a point to a segment
function getSquareSegmentDistance(p, p1, p2) {
    // function safe(v, defaultValue) {
    //     function isNumber(x) {
    //         return x !== null && x !== undefined
    //     }
    //
    //     return isNumber(v) ? v : isNumber(defaultValue) ? defaultValue : 0
    // }
    let x = p1.x || 0,
        y = p1.y || 0,
        z = p1.z || 0,
        dx = p2.x ? p2.x - x : 0,
        dy = p2.y ? p2.y - y : 0,
        dz = p2.z ? p2.z - z : 0

    if (dx !== 0 || dy !== 0 || dz !== 0) {
        let t = ((p.x - x) * dx + (p.y - y) * dy + (p.z - z) * dz) / (dx * dx + dy * dy + dz * dz)

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

    dx = p.x ? p.x - x : p1.x - x
    dy = p.y ? p.y - y : p1.y - y
    dz = p.z ? p.z - z : p1.z - z

    return dx * dx + dy * dy + dz * dz
}

// the rest of the code doesn't care for the point format

// basic distance-based simplification
function simplifyRadialDistance(points, sqTolerance) {
    let prevPoint = points[0],
        newPoints = [prevPoint],
        point

    for (let i = 1, len = points.length; i < len; i++) {
        point = points[i]

        if (getSquareDistance(point, prevPoint) > sqTolerance) {
            newPoints.push(point)
            prevPoint = point
        }
    }

    if (prevPoint !== point) {
        newPoints.push(point)
    }

    return newPoints
}

// simplification using optimized Douglas-Peucker algorithm with recursion elimination
function simplifyDouglasPeucker(points_with_nulls, sqTolerance) {
    const tracker = { x: null, y: null, z: null }
    // keep tabs on the absolute position
    const points = points_with_nulls.map(p => {
        Object.assign(tracker, {
            x: p.x === null ? tracker.x : p.x,
            y: p.y === null ? tracker.y : p.y,
            z: p.z == null ? tracker.z : p.z,
            orig: p
        })
        return { ...tracker }
    })
    let len = points.length,
        MarkerArray = typeof Uint8Array !== "undefined" ? Uint8Array : Array,
        markers = new MarkerArray(len),
        first = 0,
        last = len - 1,
        stack = [],
        newPoints = [],
        i,
        maxSqDist,
        sqDist,
        index = 0

    markers[first] = markers[last] = 1

    while (last) {
        maxSqDist = 0

        const p1 = points[first]
        const p2 = points[last]

        if (
            (p1.x === null && p2.x !== null) ||
            (p1.y === null && p2.y !== null) ||
            (p1.z === null && p2.z !== null)
        ) {
            // we can't know the distance between p1 and p2, so we can't determine square segment distance
            if (first !== last - 1) {
                index = first + 1
                markers[index] = 1
                stack.push(first, index, index, last)
            }
        } else {
            for (i = first + 1; i < last; i++) {
                sqDist = getSquareSegmentDistance(points[i], p1, p2)

                if (sqDist > maxSqDist) {
                    index = i
                    maxSqDist = sqDist
                }
            }

            if (maxSqDist > sqTolerance) {
                markers[index] = 1
                stack.push(first, index, index, last)
            }
        }

        last = stack.pop()
        first = stack.pop()
    }

    for (i = 0; i < len; i++) {
        if (markers[i]) {
            newPoints.push(points[i])
        }
    }

    return newPoints // .map(p => p.orig)
}

// both algorithms combined for awesome performance
export function simplify(points, tolerance, highestQuality) {
    const sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1

    // TODO: do we care about the high quality pass (if so needs to be adapted to handle nulls!)
    // points = highestQuality ? points : simplifyRadialDistance(points, sqTolerance)
    points = simplifyDouglasPeucker(points, sqTolerance)

    return points
}
