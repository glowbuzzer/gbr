/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { Box3, Line3, Plane, Vector3 } from "three"

type FaceInfo = { plane: Plane; size: number[]; offset: number[] }

export function avoid(box_orig: Box3, start: Vector3, end: Vector3, clearance: number): Vector3[] {
    const box = box_orig.clone().expandByVector(new Vector3(clearance, clearance, clearance))
    const centre = box.getCenter(new Vector3())
    const box_edges = edges(box)
    const face_info = faces(box)

    const result = [start]
    do {
        const line = new Line3(result[result.length - 1], end)
        if (line.distance() === 0) {
            // we must be at the end of the line
            break
        }
        const intersection_point = face_info.reduce((closest, face) => {
            const point = face.plane.intersectLine(line, new Vector3())
            const intersects = point && box.containsPoint(point)
            if (!intersects) {
                return closest
            }
            const distance = point.distanceTo(start)
            if (!closest) {
                return point
            }
            return distance < closest.distanceTo(start) ? point : closest
        }, null as Vector3)

        if (!intersection_point) {
            // no intersection, so we're done
            result.push(end)
            break
        }

        const { point, index } = box_edges.reduce(
            (prev, edge, index) => {
                const point = edge.closestPointToPoint(line.start, true, new Vector3())
                const distance = point.distanceTo(intersection_point)
                if (distance >= prev.distance) {
                    return prev
                }
                const vector = new Vector3().subVectors(point, centre).normalize()
                const buffered_point = point.clone().addScaledVector(vector, 1)
                return distance < prev.distance ? { point: buffered_point, distance, index } : prev
            },
            { point: null, distance: Infinity, index: -1 }
        )

        box_edges.splice(index, 1)
        result.push(point)
        // console.log("add point", point)
    } while (box_edges.length)

    console.log(result)
    return result
}

function edges(box3: Box3): Line3[] {
    const min = box3.min
    const max = box3.max

    return [
        new Line3(new Vector3(min.x, min.y, min.z), new Vector3(min.x, min.y, max.z)),
        new Line3(new Vector3(min.x, max.y, min.z), new Vector3(min.x, max.y, max.z)),
        new Line3(new Vector3(max.x, min.y, min.z), new Vector3(max.x, min.y, max.z)),
        new Line3(new Vector3(max.x, max.y, min.z), new Vector3(max.x, max.y, max.z))
    ]
}

export function faces(box3: Box3): FaceInfo[] {
    const min = box3.min
    const max = box3.max
    const size = box3.getSize(new Vector3())

    return [
        {
            plane: new Plane().setFromNormalAndCoplanarPoint(new Vector3(-1, 0, 0), min),
            size: [size.z, size.y],
            offset: [-size.x / 2, 0, 0]
        },
        {
            plane: new Plane().setFromNormalAndCoplanarPoint(new Vector3(1, 0, 0), max),
            size: [size.z, size.y],
            offset: [size.x / 2, 0, 0]
        },
        {
            plane: new Plane().setFromNormalAndCoplanarPoint(new Vector3(0, -1, 0), min),
            size: [size.x, size.z],
            offset: [0, -size.y / 2, 0]
        },
        {
            plane: new Plane().setFromNormalAndCoplanarPoint(new Vector3(0, 1, 0), max),
            size: [size.x, size.z],
            offset: [0, size.y / 2, 0]
        }
        // {
        //     plane: new Plane().setFromNormalAndCoplanarPoint(new Vector3(0, 0, -1), min),
        //     size: [size.x, size.y],
        //     offset: [0, 0, -size.z / 2]
        // },
        // {
        //     plane: new Plane().setFromNormalAndCoplanarPoint(new Vector3(0, 0, 1), max),
        //     size: [size.x, size.y],
        //     offset: [0, 0, size.z / 2]
        // }
    ].slice(0 /*, 1*/)
}
