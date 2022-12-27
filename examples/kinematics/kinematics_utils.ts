import { Euler, Matrix4, Quaternion, Vector3 } from "three"

export type ForwardKinResult = {
    position: [number, number, number] // Vector3
    orientation: [number, number, number, number] // Quaternion
    aot: number // angle of tool (igus)
    rot: number // rotation of tool (igus)
}

export type ForwardKinFunction = (thetas: number[]) => ForwardKinResult
export type InverseKinFunction = (
    position: [number, number, number],
    orientation: [number, number, number, number],
    aot?: number,
    rot?: number
) => number[][]

function toMatrix4(R: number[][]) {
    return new Matrix4().fromArray(R.flat()).transpose() // convert row major to column major order
}

export function toEuler(R: number[][]): [number, number, number] {
    const euler = new Euler().setFromRotationMatrix(toMatrix4(R))
    const { x, y, z } = euler
    return [x, y, z]
}

export function toQuat(R: number[][]): [number, number, number, number] {
    const m = toMatrix4(R)
    const quat = new Quaternion()
    m.decompose(new Vector3(), quat, new Vector3())
    const { x, y, z, w } = quat
    return [x, y, z, w]
}

// takes a sequence of generators (of junction angles) and produces the cross product (all combinations therein)
export function* generate_configs(
    current_generator_index,
    current_sequence,
    generators,
    index?: number
): IterableIterator<number[]> {
    if (current_generator_index === generators.length) {
        yield current_sequence
        return
    }
    const next_values = generators[current_generator_index](current_sequence, index)
    for (let n = 0; n < next_values.length; n++) {
        const value = next_values[n]
        const next_sequence = [...current_sequence, value]
        yield* generate_configs(current_generator_index + 1, next_sequence, generators, n)
    }
}
