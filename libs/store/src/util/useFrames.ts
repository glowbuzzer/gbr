import { add_frame_config, Frame, NULL_FRAME_CONFIG } from "./frame_utils"
import { Quaternion, Vector3 } from "three"
import { useConfig } from "../config"
import * as THREE from "three"

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
export function build_tree(frames: any) {
    const rootFrames = [] as Frame[]
    const parents = [] as Frame[]

    let index = 0
    for (const k of Object.keys(frames)) {
        const def = frames[k]
        const relative = {
            translation: vectorOf(def.translation),
            rotation: quatOf(def.rotation)
        }
        const item: Frame = {
            index: index,
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
            parent.children!.push(item)
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
function build_list(asTree: Frame[]) {
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
function change_reference_frame(
    frames: Frame[],
    position: THREE.Vector3,
    orientation: THREE.Quaternion,
    fromIndex: number,
    toIndex?: number | "world"
): { position: THREE.Vector3; orientation: THREE.Quaternion } {
    if (toIndex === undefined || toIndex === fromIndex) {
        return { position, orientation }
    }

    function matrixOf(index: number) {
        // convenience function to construct matrix4 from frame info
        const f = frames.find(f => f.index === index)
        if (!f) {
            throw new Error("Invalid frame index")
        }
        return new THREE.Matrix4().compose(f.absolute.translation, f.absolute.rotation, UNIT_SCALE)
    }

    const fromMatrix = matrixOf(fromIndex)
    const toMatrix = toIndex === "world" ? IDENTITY_MATRIX : matrixOf(toIndex)

    const transformation = new THREE.Matrix4().getInverse(toMatrix).multiply(fromMatrix)

    // we can apply the transformation matrix to the input position directly
    const transformed_pose = position.clone().applyMatrix4(transformation)

    return {
        position: transformed_pose,
        // sum the rotation due to the transformation and the 'mobile' orientation of the input position
        orientation: decompose2(transformation).rotation.multiply(orientation)
    }
}

export const useFrames = () => {
    const config = useConfig()
    const asTree = build_tree(config.frames)
    const asList = build_list(asTree)

    return {
        raw: config.frames,
        asTree,
        asList,
        convertToFrame(position: THREE.Vector3, orientation: THREE.Quaternion, fromIndex: number, toIndex: number) {
            return change_reference_frame(asList, position, orientation, fromIndex, toIndex)
        }
    }
}
