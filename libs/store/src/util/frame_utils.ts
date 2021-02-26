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
    parentIndex?: number
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

/**
 * Provides a convenience 'useFrames' method that can be used to get frame information from the config
 * and convert between frames
 */

function vectorOf(t): Vector3 {
    return t ? new Vector3(t.x, t.y, t.z) : NULL_FRAME_CONFIG.translation
}

function quatOf(r): Quaternion {
    return r ? new Quaternion(r.x, r.y, r.z, r.w) : NULL_FRAME_CONFIG.rotation
}

/**
 * Build a tree of frames from the raw config and calculate the relative and absolute transformation matrices for each frame
 *
 * @param frames The raw list of frames in the config containing translation and rotation (quaternion) info
 */
export function build_tree(frames: any, overrides) {
    const rootFrames = [] as Frame[]
    const parents = [] as Frame[]

    let index = 0
    for (const k of Object.keys(frames)) {
        const def = frames[k]
        const relative = {
            translation: vectorOf(def.translation),
            rotation: quatOf(def.rotation)
        }
        if (overrides[index]) {
            relative.translation.setX(overrides[index][0])
            relative.translation.setY(overrides[index][1])
            relative.translation.setZ(overrides[index][2])
        }
        const item: Frame = {
            index: index,
            parentIndex: def.parent,
            text: k,
            level: 0,
            absolute: relative, // will be modified if parent specified
            relative
        }
        if (def.absRel) {
            // frame is relative to parent frame
            const parent_index = def.parent
            const parent = parents[parent_index]
            if (!parent) {
                throw new Error("Invalid parent frame - forward refs not supported")
            }
            if (!parent.children) {
                parent.children = []
            }
            parent.children.push(item)
            item.level = parent.level + 1

            item.absolute = add_frame_config(parent.absolute, relative)
        } else {
            rootFrames.push(item)
        }
        parents.push(item)
        index++
    }
    return rootFrames
}

/**
 * Take the tree of
 * @param asTree
 */
export function build_list(asTree: Frame[]) {
    const result: Frame[] = []

    function walk(items: Frame[]) {
        for (const i of items) {
            result.push(i)
            if (i.children) {
                walk(i.children)
            }
        }
    }

    walk(asTree)
    return result
}

function decompose2(matrix: THREE.Matrix4) {
    const translation = new THREE.Vector3()
    const rotation = new THREE.Quaternion()
    const scale = new THREE.Vector3()
    matrix.decompose(translation, rotation, scale)
    return { translation, rotation, scale }
}

const UNIT_SCALE = new THREE.Vector3(1, 1, 1)
const IDENTITY_MATRIX = new THREE.Matrix4()

function log_translation(f: Matrix4, ...msg) {
    const translation = new Vector3()
    f.decompose(translation, new Quaternion(), new Vector3())
    const { x, y, z } = translation
    console.log(...msg, "X=", x, "Y=", y, "Z=", z)
}

/**
 * Take a point (including orientation) in one frome and determine it's position and orientation with respect to
 * another frame.
 *
 * @param frames The list of all frames
 * @param position The cartesian position to be changed
 * @param orientation The quaternion orientation to be changed
 * @param fromIndex The reference frame of the input pose
 * @param toIndex The desired reference frame of the output pose
 */
export function change_reference_frame(
    frames: Frame[],
    position: THREE.Vector3,
    orientation: THREE.Quaternion,
    fromIndex: number | "world",
    toIndex?: number | "world"
): { position: THREE.Vector3; orientation: THREE.Quaternion } {
    if (toIndex === fromIndex) {
        // console.log("NULL FRAME CONVERSION, SAME FROM AND TO FRAME", toIndex)
        return { position, orientation }
    }

    function matrixOf(index: number) {
        // convenience function to construct matrix4 from frame info
        const f = frames.find(f => f.index === index)
        if (!f) {
            console.warn("Invalid frame requested", index, frames)
            return IDENTITY_MATRIX
        }
        return new THREE.Matrix4().compose(f.absolute.translation, f.absolute.rotation, UNIT_SCALE)
    }

    const fromMatrix = fromIndex === "world" ? IDENTITY_MATRIX : matrixOf(fromIndex)
    // log_translation(fromMatrix, "FROM TRANSLATION")

    const toMatrix = toIndex === "world" || toIndex === undefined ? IDENTITY_MATRIX : matrixOf(toIndex)
    // log_translation(toMatrix, "TO TRANSLATION")

    const transformation = new THREE.Matrix4().getInverse(toMatrix).multiply(fromMatrix)

    // log_translation(transformation, "RESULT")

    // we can apply the transformation matrix to the input position directly
    const transformed_pose = position.clone().applyMatrix4(transformation)

    // console.log("Transform", position, "to", transformed_pose)

    return {
        position: transformed_pose,
        // sum the rotation due to the transformation and the 'mobile' orientation of the input position
        orientation: decompose2(transformation).rotation.multiply(orientation)
    }
}
