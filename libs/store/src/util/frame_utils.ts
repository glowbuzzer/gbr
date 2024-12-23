/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as THREE from "three"
import { GlowbuzzerConfig, POSITIONREFERENCE, Quat, Vector3 } from "../gbc"

type FrameConfig = {
    translation: THREE.Vector3
    rotation: THREE.Quaternion
}

export const NULL_FRAME_CONFIG = {
    translation: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(0, 0, 0, 1)
}

function makeFrameConfig(): FrameConfig {
    return {
        translation: new THREE.Vector3(),
        rotation: new THREE.Quaternion(0, 0, 0, 1)
    }
}

export type Frame = {
    index: number
    name: string
    children?: Frame[]
    parent?: Frame
    parentFrameIndex?: number
    level: number
    absolute: FrameConfig
    relative: FrameConfig
    positionReference: POSITIONREFERENCE
    workspaceOffset: number
}

function to_m4(f: FrameConfig) {
    return new THREE.Matrix4().compose(f.translation, f.rotation, new THREE.Vector3(1, 1, 1))
}

function decompose(matrix: THREE.Matrix4): FrameConfig {
    const result = makeFrameConfig()
    matrix.decompose(result.translation, result.rotation, new THREE.Vector3(1, 1, 1))

    return result
}

function add_frame_config(f1: FrameConfig, f2: FrameConfig): FrameConfig {
    const m1 = to_m4(f1)
    const m2 = to_m4(f2)

    return decompose(m1.multiply(m2))
}

function vectorOf(t?: Vector3): THREE.Vector3 {
    return t ? new THREE.Vector3(t.x, t.y, t.z) : NULL_FRAME_CONFIG.translation.clone()
}

function quatOf(r?: Quat): THREE.Quaternion {
    return r ? new THREE.Quaternion(r.x, r.y, r.z, r.w) : NULL_FRAME_CONFIG.rotation.clone()
}

type Subset<K> = {
    [attr in keyof K]?: K[attr] extends object
        ? Subset<K[attr]>
        : K[attr] extends object | null
        ? Subset<K[attr]> | null
        : K[attr] extends object | null | undefined
        ? Subset<K[attr]> | null | undefined
        : K[attr]
}

/**
 * Build a tree of frames from the raw config and calculate the relative and absolute transformation matrices for each frame
 *
 * @param frames The raw list of frames in the config containing translation and rotation (quaternion) info
 */
export function build_tree2(frames: GlowbuzzerConfig["frames"]): Frame[] {
    // we want to build a valid tree of frames, with no cycles and where forward refs are allowed

    function link(frame: Subset<Frame>, parent: Subset<Frame>) {
        function has_cycle(node?: Subset<Frame>): boolean {
            if (!node) {
                return false
            }
            if (node.index === frame.index) {
                return true
            }
            return has_cycle(node.parent)
        }

        if (!has_cycle(parent)) {
            parent.children.push(frame)
            frame.parent = parent
        } else {
            // ignore the link if it would create a cycle
            delete frame.parent
        }
    }

    const result: Subset<Frame>[] = []

    frames.forEach((f, i) => {
        const relative = {
            translation: vectorOf(f.translation),
            rotation: quatOf(f.rotation)
        }

        result[i] = Object.assign(result[i] || {}, {
            index: i,
            children: [],
            ...result[i], // may already exist with children due to forward ref
            name: f.name,
            workspaceOffset: f.workspaceOffset,
            relative,
            absolute: relative
        })

        if (f.positionReference === POSITIONREFERENCE.RELATIVE) {
            const parentIndex = f.parentFrameIndex
            if (result[parentIndex]) {
                // parent already exists (backward ref), check for cycles
                link(result[i], result[parentIndex])
            } else {
                // parent doesn't exist yet (forward ref)
                result[parentIndex] = {
                    index: parentIndex,
                    children: []
                }
                // pretty sure we don't need to check for cycles on forward refs
                link(result[i], result[parentIndex])
            }
        }
    })

    // now we need to calculate the absolute and relative transforms
    function resolve(node: Frame, level = 0) {
        node.level = level
        if (node.parent) {
            node.absolute = add_frame_config(node.parent.absolute, node.relative)
        }
        node.children.forEach(child => {
            resolve(child, level + 1)
        })
        return node
    }

    // find the root nodes and walk them to work out the absolute transforms,
    // and return only the root nodes
    return result.filter(f => !f.parent).map(resolve)
}

/**
 * Take a tree of frames and return a flat list of frames
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

/*
function log_translation(f: Matrix4, ...msg) {
    const translation = new Vector3()
    f.decompose(translation, new Quaternion(), new Vector3())
    const { x, y, z } = translation
    console.log(...msg, "X=", x, "Y=", y, "Z=", z)
}
*/

/**
 * Take a point (including orientation) in one frome and determine its position and orientation with respect to
 * another frame.
 *
 * @param frames The list of all frames
 * @param translation The cartesian position to be changed
 * @param rotation The quaternion orientation to be changed
 * @param fromIndex The reference frame of the input pose
 * @param toIndex The desired reference frame of the output pose
 */
export function change_reference_frame(
    frames: Frame[],
    translation: Vector3,
    rotation: Quat,
    fromIndex: number | "world",
    toIndex?: number | "world"
): { translation: Vector3; rotation: Quat } {
    if (toIndex === fromIndex) {
        // console.log("NULL FRAME CONVERSION, SAME FROM AND TO FRAME", toIndex)
        return { translation, rotation }
    }

    function matrixOf(index: number) {
        // convenience function to construct matrix4 from frame info
        const f = frames.find(f => f.index === index)
        if (!f) {
            // console.warn("Invalid frame requested", index, frames)
            return IDENTITY_MATRIX
        }
        return new THREE.Matrix4().compose(f.absolute.translation, f.absolute.rotation, UNIT_SCALE)
    }

    const fromMatrix = fromIndex === "world" ? IDENTITY_MATRIX : matrixOf(fromIndex)
    // log_translation(fromMatrix, "FROM TRANSLATION")

    const toMatrix =
        toIndex === "world" || toIndex === undefined ? IDENTITY_MATRIX : matrixOf(toIndex)
    // log_translation(toMatrix, "TO TRANSLATION")

    const transformation = toMatrix.clone().invert().multiply(fromMatrix)

    // log_translation(transformation, "RESULT")

    // we can apply the transformation matrix to the input position directly
    const transformed_translation = vectorOf(translation).clone().applyMatrix4(transformation)

    // console.log("Transform", position, "to", transformed_pose)

    return {
        translation: transformed_translation,
        // sum the rotation due to the transformation and the 'mobile' orientation of the input position
        rotation: decompose2(transformation).rotation.multiply(quatOf(rotation))
    }
}

export function apply_offset(
    position: {
        translation: Vector3
        rotation: Quat
    },
    offset: { translation?: Vector3; rotation?: Quat },
    invert = false
): { translation: THREE.Vector3; rotation: THREE.Quaternion } {
    const p = new THREE.Matrix4().compose(
        vectorOf(position.translation),
        quatOf(position.rotation),
        new THREE.Vector3(1, 1, 1)
    )
    const q = new THREE.Matrix4().compose(
        vectorOf(offset.translation),
        quatOf(offset.rotation),
        new THREE.Vector3(1, 1, 1)
    )

    if (invert) {
        q.invert()
        p.multiply(q)
    } else {
        p.multiply(q)
    }

    const translation = new THREE.Vector3()
    const rotation = new THREE.Quaternion()
    p.decompose(translation, rotation, new THREE.Vector3())

    return { translation, rotation }
}
