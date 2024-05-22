// noinspection JSUnresolvedReference

/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { Quaternion, Vector3 } from "three"
import { CartesianPosition } from "@glowbuzzer/store"

export type TriangulatedPoint = {
    mark_1: Vector3
    mark_2: Vector3
    mark_3: Vector3
}

/**
 * Convert the raw XML nodes from jawMotion file to the upper jaw position and the triangulated points of motion
 */
export function load_jaw_motion(obj: any) {
    const info = obj.dental_measurement
    const tracks: any[] = info.movements.movement.tracks.track
    if (tracks.length !== 3) {
        throw new Error("Invalid number of tracks, expected 3 but was " + tracks.length)
    }

    // check that the size property of all tracks is the same
    if (tracks.some(track => track.size !== tracks[0].size)) {
        throw new Error("Invalid track sizes, all tracks must have the same number of elements")
    }

    if (!tracks.every((track, index) => ["mark_1", "mark_2", "mark_3"][index] === track.id)) {
        throw new Error("Invalid track ids found, expected 'mark_1', 'mark_2' and 'mark_3'")
    }

    console.log("jaw motion", obj)

    const size = tracks[0].size
    const points: TriangulatedPoint[] = Array.from({ length: size }, (_, i) => {
        return {
            mark_1: new Vector3(
                tracks[0].quants.quant[i].x,
                tracks[0].quants.quant[i].y,
                tracks[0].quants.quant[i].z
            ),
            mark_2: new Vector3(
                tracks[1].quants.quant[i].x,
                tracks[1].quants.quant[i].y,
                tracks[1].quants.quant[i].z
            ),
            mark_3: new Vector3(
                tracks[2].quants.quant[i].x,
                tracks[2].quants.quant[i].y,
                tracks[2].quants.quant[i].z
            )
        }
    })

    const upperPosition = Object.fromEntries(
        Object.entries<Vector3>(info.upper_position.points).map(([key, value]) => [
            key as keyof TriangulatedPoint,
            new Vector3().copy(value as any)
        ])
    ) as unknown as TriangulatedPoint

    return { upperPosition, points }
}

export function calc_centroid(points: Vector3[]) {
    // return the centroid of the points given (the three reference marks)
    const sum = points.reduce((acc, p) => acc.add(p), new Vector3())
    return sum.divideScalar(points.length)
}

/**
 * Convert triangulated point to a cartesian position in glowbuzzer API form (translation and rotation)
 *
 * @param point
 */
const edge1 = new Vector3()
const edge2 = new Vector3()
const normal = new Vector3()
const quaternion = new Quaternion()
const up_vector = new Vector3(0, 0, 1)
export function calc_cartesian_position(point: TriangulatedPoint): CartesianPosition {
    const { mark_1: A, mark_2: B, mark_3: C } = point

    // Calculate normal of the plane formed by points A, B, C
    edge1.subVectors(B, A)
    edge2.subVectors(C, A)
    normal.crossVectors(edge1, edge2).normalize()

    // quaternion representing the orientation of the plane, with Z up
    quaternion.setFromUnitVectors(up_vector, normal)

    const centroid = calc_centroid([A, B, C]) // centroid of the triangle

    const { x, y, z } = centroid
    const { x: qx, y: qy, z: qz, w: qw } = quaternion

    return {
        translation: { x, y, z: z + 350 },
        rotation: { x: qx, y: qy, z: qz, w: qw }
    }
}

/**
 * Interpolate triangulated points according to frame rate of the points and the GBC bus frequency.
 *
 * The points are interpolated linearly between each frame, ready to be streamed to GBC.
 *
 * @param points
 * @param frameRateHz
 * @param busFrequencyMs
 */
// statics (threejs performance)
const current_mark_1 = new Vector3()
const current_mark_2 = new Vector3()
const current_mark_3 = new Vector3()
const next_mark_1 = new Vector3()
const next_mark_2 = new Vector3()
const next_mark_3 = new Vector3()
export function* interpolate(
    points: TriangulatedPoint[],
    frameRateHz: number,
    busFrequencyMs: number
): IterableIterator<CartesianPosition> {
    const frame_time_ms = 1000 / frameRateHz
    const total_time = points.length * frame_time_ms

    for (let time = 0; time <= total_time; time += busFrequencyMs) {
        const current_frame = Math.floor(time / frame_time_ms)
        const next_frame = Math.min(current_frame + 1, points.length - 1)
        const frame_time = time % frame_time_ms
        current_mark_1.copy(points[current_frame].mark_1)
        current_mark_2.copy(points[current_frame].mark_2)
        current_mark_3.copy(points[current_frame].mark_3)
        next_mark_1.copy(points[next_frame].mark_1)
        next_mark_2.copy(points[next_frame].mark_2)
        next_mark_3.copy(points[next_frame].mark_3)
        const interpolated_mark = {
            mark_1: current_mark_1.lerp(next_mark_1, frame_time / frame_time_ms),
            mark_2: current_mark_2.lerp(next_mark_2, frame_time / frame_time_ms),
            mark_3: current_mark_3.lerp(next_mark_3, frame_time / frame_time_ms)
        }

        yield calc_cartesian_position(interpolated_mark)
    }
}

export function* chunk<T>(iterator: Iterator<T>, chunkSize: number): Generator<T[]> {
    let chunk: T[] = []
    let result = iterator.next()

    while (!result.done) {
        chunk.push(result.value)

        if (chunk.length >= chunkSize) {
            yield chunk
            chunk = []
        }

        result = iterator.next()
    }

    // Yield any remaining items
    if (chunk.length > 0) {
        yield chunk
    }
}
