import * as THREE from "three"
import { Matrix4, Quaternion, Vector3 } from "three"

export type FrameConfig = {
    translation: THREE.Vector3
    rotation: THREE.Quaternion
}

export const NULL_FRAME_CONFIG = {
    translation: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(0, 0, 0, 1)
}

function makeFrameConfig(): FrameConfig {
    return {
        translation: new Vector3(),
        rotation: new Quaternion(0, 0, 0, 1)
    }
}

export type Frame = {
    index: number
    text: string
    children?: Frame[]
    level: number
    absolute: FrameConfig
    relative: FrameConfig
}

function to_m4(f: FrameConfig) {
    return new THREE.Matrix4().compose(f.translation, f.rotation, new Vector3(1, 1, 1))
}

function decompose(matrix: Matrix4): FrameConfig {
    const result = makeFrameConfig()
    matrix.decompose(result.translation, result.rotation, new Vector3(1, 1, 1))

    return result
}

export function add_frame_config(f1: FrameConfig, f2: FrameConfig): FrameConfig {
    const m1 = to_m4(f1)
    const m2 = to_m4(f2)

    return decompose(m1.multiply(m2))
}
