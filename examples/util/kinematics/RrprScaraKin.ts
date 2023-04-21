import * as THREE from "three"
import { toQuat } from "./kinematics_utils"
import { List } from "./mathematica"
import { DhMatrix } from "./KinChainParams"

// const a1 = 220
// const a2 = 240
// const d1 = 0
// const d4 = 0

export function fk_RrprScara(
    theta1: number,
    theta2: number,
    q3: number,
    theta4: number,
    dh: DhMatrix[]
): {
    orientation: [number, number, number, number]
    position: [number, number, number]
    matrix: number[][]
} {
    const d1 = dh[0].d
    const d4 = dh[3].d
    const a1 = dh[0].a
    const a2 = dh[1].a

    const C1_2_4 = Math.cos(theta1 + theta2 + theta4)
    const S1_2_4 = Math.sin(theta1 + theta2 + theta4)
    const C1 = Math.cos(theta1)
    const S1 = Math.sin(theta1)

    const C1_2 = Math.cos(theta1 + theta2)
    const S1_2 = Math.sin(theta1 + theta2)

    const M = List(
        List(C1_2_4, S1_2_4, 0, a1 * C1 + a2 * C1_2),
        List(S1_2_4, -C1_2_4, 0, a1 * S1 + a2 * S1_2),
        List(0, 0, -1, d1 + q3 - d4),
        List(0, 0, 0, 1)
    )

    const matrix = [
        [M[0][0], M[1][0], M[2][0]],
        [M[0][1], M[1][1], M[2][1]],
        [M[0][2], M[1][2], M[2][2]]
    ]

    return {
        orientation: toQuat(M),
        position: [M[0][3], M[1][3], M[2][3]],
        matrix
    }
}

export function ik_RrprScara(
    position: [number, number, number],
    orientation: [number, number, number, number],
    dh: DhMatrix[]
): number[][] {
    const [x, y, z] = position
    const [i, j, k, w] = orientation

    const dh_d1 = dh[0].d
    const dh_d4 = dh[3].d
    const dh_a1 = dh[0].a
    const dh_a2 = dh[1].a
    console.log("ik", "dh_a1", dh_a1, "dh_a2", dh_a2, "dh_d1", dh_d1, "dh_d4", dh_d4)

    const cosine_joint_2 = (x * x + y * y - dh_a1 * dh_a1 - dh_a2 * dh_a2) / (2 * dh_a1 * dh_a2)

    const sine_joint_2_absolute = Math.sqrt(1 - cosine_joint_2 * cosine_joint_2)
    const sine_joint_2_1 = sine_joint_2_absolute
    const sine_joint_2_2 = -sine_joint_2_absolute
    const theta2_1 = Math.atan2(sine_joint_2_1, cosine_joint_2)
    const theta2_2 = Math.atan2(sine_joint_2_2, cosine_joint_2)

    const alpha = Math.atan2(y, x)
    const beta_1 = Math.atan2(dh_a2 * sine_joint_2_1, dh_a1 + dh_a2 * cosine_joint_2)
    const theta1_1 = alpha - beta_1
    const beta_2 = Math.atan2(dh_a2 * sine_joint_2_2, dh_a1 + dh_a2 * cosine_joint_2)
    const theta1_2 = alpha - beta_2

    // console.log("theta1_1", (theta1_1 * 180) / Math.PI)
    // console.log("theta1_2", (theta1_2 * 180) / Math.PI)

    const rotQ = new THREE.Quaternion(i, j, k, w)
    const rotE = new THREE.Euler().setFromQuaternion(rotQ)

    const q3 = dh_d1 - dh_d4 + z

    // console.log("q3", q3)

    const theta4_1 = -(rotE.z + theta1_1 + theta2_1)
    const theta4_2 = rotE.z + theta1_1 + theta2_1

    // console.log("theta4_1", (theta4_1 * 180) / Math.PI)
    // console.log("theta4_2",theta4_2)

    return [
        [theta1_1, theta2_1, q3, theta4_1],
        [theta1_2, theta2_2, q3, theta4_2]
    ]
}
