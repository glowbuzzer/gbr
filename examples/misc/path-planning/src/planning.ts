/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { Box3, Line3, Plane, Vector3 } from "three"

type FaceInfo = { plane: Plane; size: number[]; offset: number[] }

/**
 * Plan a new path avoiding the box obstacle.
 * @param box_orig The box to avoid, without clearance added
 * @param start The start point
 * @param end The end point
 * @param clearance Clearance/buffer to add to the box
 * @param route Preferred route, as a bitmask on the boxes edges
 */
export function avoid(
    box_orig: Box3,
    start: Vector3,
    end: Vector3,
    clearance: number,
    route: number
): Vector3[] {
    // increase the box size by the clearance
    const box = box_orig.clone().expandByVector(new Vector3(clearance, clearance, clearance))
    const centre = box.getCenter(new Vector3())
    // get a list of the edges, according to the preferred route
    const box_edges = edges(box, route)
    // get a list of faces we want to test against
    const face_info = faces(box)

    // we're going to build a new path, starting with the start point
    const result = [start]
    // this is a basic path planning algorithm
    // we want to repeatedly test if the line from the last point to the end point intersects with any of the faces of the expanded box
    // if it does, we find the closest edge along the preferred route and find the point on that edge that is closest to the intersection point
    // we then remove that edge from the list of edges to use, and add the new point on the edge to the path
    do {
        const line = new Line3(result[result.length - 1], end)
        if (line.distance() === 0) {
            // we must be at the end of the line
            break
        }
        // find the closest intersection point on any of the faces
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
            // no intersection, so we're safe to head straight to the end point
            result.push(end)
            break
        }

        // now we want to find the closest edge
        const { point, index } = box_edges.reduce(
            (prev, edge, index) => {
                const point = edge.closestPointToPoint(intersection_point, true, new Vector3())
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

        // console.log("point", point, "index", index)
        box_edges.splice(index, 1)
        result.push(point)
        // console.log("add point", point)
    } while (box_edges.length)

    if (!box_edges.length) {
        // this is the case where all edges are exhausted, so we need to add the end point
        result.push(end)
    }

    // console.log("result", result.slice())
    return result
}

function edges(box3: Box3, mask: number): Line3[] {
    const min = box3.min
    const max = box3.max

    return [
        new Line3(new Vector3(min.x, min.y, min.z), new Vector3(min.x, min.y, max.z)),
        new Line3(new Vector3(min.x, max.y, min.z), new Vector3(min.x, max.y, max.z)),
        new Line3(new Vector3(max.x, min.y, min.z), new Vector3(max.x, min.y, max.z)),
        new Line3(new Vector3(max.x, max.y, min.z), new Vector3(max.x, max.y, max.z)),
        new Line3(new Vector3(min.x, min.y, max.z), new Vector3(max.x, min.y, max.z)),
        new Line3(new Vector3(min.x, max.y, max.z), new Vector3(max.x, max.y, max.z))
    ].filter((_, index) => mask & (1 << index))
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
        },
        // we don't bother to include the bottom face, since we're not planning to go below the box
        // {
        //     plane: new Plane().setFromNormalAndCoplanarPoint(new Vector3(0, 0, -1), min),
        //     size: [size.x, size.y],
        //     offset: [0, 0, -size.z / 2]
        // },
        {
            plane: new Plane().setFromNormalAndCoplanarPoint(new Vector3(0, 0, 1), max),
            size: [size.x, size.y],
            offset: [0, 0, size.z / 2]
        }
    ].slice(0 /*, 1*/)
}
