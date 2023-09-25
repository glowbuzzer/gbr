// noinspection DuplicatedCode

import { Cos, List, Power, Sin, Sqrt } from "./mathematica"
import { Matrix3, Matrix4, Quaternion, Vector3 } from "three"
import { generate_configs, toQuat } from "./kinematics_utils"
import * as math from "mathjs"
import { DhMatrix } from "./KinChainParams"
import { degToRad } from "three/src/math/MathUtils"

/*
function toEuler(R: number[][]): [number, number, number] {
    const m: any = {}
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            m[`c${i + 1}${j + 1}`] = R[i][j]
        }
    }

    const y = Math.asin(MathUtils.clamp(m.c13, -1, 1))

    if (Math.abs(m.c13) < 0.99999) {
        return [atan2(-m.c23, m.c33), y, atan2(-m.c12, m.c11)]
    } else {
        return [atan2(m.c32, m.c22), y, 0]
    }
}
*/

export function fk_tx40(
    thetas: number[],
    dh: DhMatrix[]
): {
    orientation: [number, number, number, number]
    position: [number, number, number]
    matrix: number[][]
} {
    const [theta1, theta2, theta3, theta4, theta5, theta6] = thetas.map(
        (t, i) => t + degToRad(dh[i].beta)
    )

    const sing_theta2 = theta2 - Math.PI / 2
    const sing_theta3 = theta3 + Math.PI / 2

    // theta2 -= Math.PI / 2
    // theta3 += Math.PI / 2

    // console.log("SING THETA2", sing_theta2)
    //
    // console.log("SING THETA3", sing_theta3)

    const forearm_internal = 225 * Sin(sing_theta2 + theta3) + 225 * Cos(sing_theta2)
    // console.log("FOREARM INTERNAL", forearm_internal)

    if (Math.abs(sing_theta3) < 0.01) {
        // console.log("FOREARM BOUNDARY SING", sing_theta3)
    }
    if (Math.abs(forearm_internal) < 0.01) {
        // console.log("FOREARM INTERNAL SING", forearm_internal)
    }
    if (Math.abs(theta5) < 0.01) {
        // console.log("WRIST SING", theta5)
    }

    // const d1 = 225
    // const d2 = 225
    // const dh_d3 = 35

    // const dh_a2 = 225
    // const dh_d4 = 225

    // const delta = 2 * dh_a2 *Cos(theta1)* Cos(theta2) - dh_d3 *Sin(theta1);

    // if ((350+d1*Sin(theta2) + d2*Sin(theta2+theta3) + delta ) < 0){
    //     console.log ("WAIST=0")
    // }
    // else {
    //     console.log ("WAIST=1")
    // }

    const dh_a1 = dh[0].a
    const dh_a2 = dh[1].a
    // const dh_d1 = dh[0].d
    const dh_d3 = dh[2].d
    const dh_d4 = dh[3].d
    const dh_d6 = dh[5].d

    // console.log("a1", dh_a1)
    // console.log("a2", dh_a2)
    // console.log("d1", dh_d1)
    // console.log("d3", dh_d3)
    // console.log("d4", dh_d4)
    // console.log("d6", dh_d6)

    const delta = dh_d4 * Sin(theta2 + theta3) + dh_a2 * Cos(theta2)

    // console.log("DELTA", delta)

    if (delta < 0) {
        // console.log ("RIGHTY")
    } else {
        // console.log ("LEFTY")
    }

    if (theta3 < 0) {
        // console.log ("ELBOW NEGATIVE")
    } else {
        // console.log ("ELBOW POSITIVE")
    }

    if (theta5 < 0) {
        // console.log ("WRIST NEGATIVE")
    } else {
        // console.log ("WRIST POSITIVE")
    }

    const M = List(
        List(
            Cos(theta6) *
                (Cos(theta5) *
                    (Cos(theta4) *
                        (Cos(theta1) * Cos(theta2) * Cos(theta3) -
                            Cos(theta1) * Sin(theta2) * Sin(theta3)) -
                        Sin(theta1) * Sin(theta4)) +
                    (-(Cos(theta1) * Cos(theta3) * Sin(theta2)) -
                        Cos(theta1) * Cos(theta2) * Sin(theta3)) *
                        Sin(theta5)) +
                (-(Cos(theta4) * Sin(theta1)) -
                    (Cos(theta1) * Cos(theta2) * Cos(theta3) -
                        Cos(theta1) * Sin(theta2) * Sin(theta3)) *
                        Sin(theta4)) *
                    Sin(theta6),
            Cos(theta6) *
                (-(Cos(theta4) * Sin(theta1)) -
                    (Cos(theta1) * Cos(theta2) * Cos(theta3) -
                        Cos(theta1) * Sin(theta2) * Sin(theta3)) *
                        Sin(theta4)) -
                (Cos(theta5) *
                    (Cos(theta4) *
                        (Cos(theta1) * Cos(theta2) * Cos(theta3) -
                            Cos(theta1) * Sin(theta2) * Sin(theta3)) -
                        Sin(theta1) * Sin(theta4)) +
                    (-(Cos(theta1) * Cos(theta3) * Sin(theta2)) -
                        Cos(theta1) * Cos(theta2) * Sin(theta3)) *
                        Sin(theta5)) *
                    Sin(theta6),
            -(
                Cos(theta5) *
                (-(Cos(theta1) * Cos(theta3) * Sin(theta2)) -
                    Cos(theta1) * Cos(theta2) * Sin(theta3))
            ) +
                (Cos(theta4) *
                    (Cos(theta1) * Cos(theta2) * Cos(theta3) -
                        Cos(theta1) * Sin(theta2) * Sin(theta3)) -
                    Sin(theta1) * Sin(theta4)) *
                    Sin(theta5),
            dh_a1 * Cos(theta1) +
                dh_a2 * Cos(theta1) * Cos(theta2) -
                dh_d3 * Sin(theta1) +
                dh_d4 *
                    (Cos(theta1) * Cos(theta3) * Sin(theta2) +
                        Cos(theta1) * Cos(theta2) * Sin(theta3)) +
                dh_d6 *
                    (-(
                        Cos(theta5) *
                        (-(Cos(theta1) * Cos(theta3) * Sin(theta2)) -
                            Cos(theta1) * Cos(theta2) * Sin(theta3))
                    ) +
                        (Cos(theta4) *
                            (Cos(theta1) * Cos(theta2) * Cos(theta3) -
                                Cos(theta1) * Sin(theta2) * Sin(theta3)) -
                            Sin(theta1) * Sin(theta4)) *
                            Sin(theta5))
        ),
        List(
            Cos(theta6) *
                (Cos(theta5) *
                    (Cos(theta4) *
                        (Cos(theta2) * Cos(theta3) * Sin(theta1) -
                            Sin(theta1) * Sin(theta2) * Sin(theta3)) +
                        Cos(theta1) * Sin(theta4)) +
                    (-(Cos(theta3) * Sin(theta1) * Sin(theta2)) -
                        Cos(theta2) * Sin(theta1) * Sin(theta3)) *
                        Sin(theta5)) +
                (Cos(theta1) * Cos(theta4) -
                    (Cos(theta2) * Cos(theta3) * Sin(theta1) -
                        Sin(theta1) * Sin(theta2) * Sin(theta3)) *
                        Sin(theta4)) *
                    Sin(theta6),
            Cos(theta6) *
                (Cos(theta1) * Cos(theta4) -
                    (Cos(theta2) * Cos(theta3) * Sin(theta1) -
                        Sin(theta1) * Sin(theta2) * Sin(theta3)) *
                        Sin(theta4)) -
                (Cos(theta5) *
                    (Cos(theta4) *
                        (Cos(theta2) * Cos(theta3) * Sin(theta1) -
                            Sin(theta1) * Sin(theta2) * Sin(theta3)) +
                        Cos(theta1) * Sin(theta4)) +
                    (-(Cos(theta3) * Sin(theta1) * Sin(theta2)) -
                        Cos(theta2) * Sin(theta1) * Sin(theta3)) *
                        Sin(theta5)) *
                    Sin(theta6),
            -(
                Cos(theta5) *
                (-(Cos(theta3) * Sin(theta1) * Sin(theta2)) -
                    Cos(theta2) * Sin(theta1) * Sin(theta3))
            ) +
                (Cos(theta4) *
                    (Cos(theta2) * Cos(theta3) * Sin(theta1) -
                        Sin(theta1) * Sin(theta2) * Sin(theta3)) +
                    Cos(theta1) * Sin(theta4)) *
                    Sin(theta5),
            dh_d3 * Cos(theta1) +
                dh_a1 * Sin(theta1) +
                dh_a2 * Cos(theta2) * Sin(theta1) +
                dh_d4 *
                    (Cos(theta3) * Sin(theta1) * Sin(theta2) +
                        Cos(theta2) * Sin(theta1) * Sin(theta3)) +
                dh_d6 *
                    (-(
                        Cos(theta5) *
                        (-(Cos(theta3) * Sin(theta1) * Sin(theta2)) -
                            Cos(theta2) * Sin(theta1) * Sin(theta3))
                    ) +
                        (Cos(theta4) *
                            (Cos(theta2) * Cos(theta3) * Sin(theta1) -
                                Sin(theta1) * Sin(theta2) * Sin(theta3)) +
                            Cos(theta1) * Sin(theta4)) *
                            Sin(theta5))
        ),
        List(
            Cos(theta6) *
                (Cos(theta4) *
                    Cos(theta5) *
                    (-(Cos(theta3) * Sin(theta2)) - Cos(theta2) * Sin(theta3)) +
                    (-(Cos(theta2) * Cos(theta3)) + Sin(theta2) * Sin(theta3)) * Sin(theta5)) -
                (-(Cos(theta3) * Sin(theta2)) - Cos(theta2) * Sin(theta3)) *
                    Sin(theta4) *
                    Sin(theta6),
            -(
                Cos(theta6) *
                (-(Cos(theta3) * Sin(theta2)) - Cos(theta2) * Sin(theta3)) *
                Sin(theta4)
            ) -
                (Cos(theta4) *
                    Cos(theta5) *
                    (-(Cos(theta3) * Sin(theta2)) - Cos(theta2) * Sin(theta3)) +
                    (-(Cos(theta2) * Cos(theta3)) + Sin(theta2) * Sin(theta3)) * Sin(theta5)) *
                    Sin(theta6),
            -(Cos(theta5) * (-(Cos(theta2) * Cos(theta3)) + Sin(theta2) * Sin(theta3))) +
                Cos(theta4) *
                    (-(Cos(theta3) * Sin(theta2)) - Cos(theta2) * Sin(theta3)) *
                    Sin(theta5),
            -dh_a2 * Sin(theta2) +
                dh_d4 * (Cos(theta2) * Cos(theta3) - Sin(theta2) * Sin(theta3)) +
                dh_d6 *
                    (-(Cos(theta5) * (-(Cos(theta2) * Cos(theta3)) + Sin(theta2) * Sin(theta3))) +
                        Cos(theta4) *
                            (-(Cos(theta3) * Sin(theta2)) - Cos(theta2) * Sin(theta3)) *
                            Sin(theta5))
        ),
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

// export function matprint(title, mat: number[][]) {
//     const shape = [mat.length, mat[0].length]
//
//     function col(mat, i) {
//         return mat.map(row => row[i])
//     }
//
//     const colMaxes: number[] = []
//     for (let i = 0; i < shape[1]; i++) {
//         colMaxes.push(
//             Math.max.apply(
//                 null,
//                 col(mat, i).map(n => (n ? n.toFixed(3).length : 10))
//             )
//         )
//     }
//
//     for (let n = 0; n < mat.length; n++) {
//         const row = mat[n]
//         const args = row
//             .map(
//                 (val, j) =>
//                     new Array(colMaxes[j] - val.toFixed(3).length + 1).join(" ") +
//                     val.toFixed(3) +
//                     "  "
//             )
//             .join("")
//     }
// }

// angles must be in RADs!
export function ik_tx40(
    position: [number, number, number],
    orientation: [number, number, number, number],
    dh: DhMatrix[],
    configuration: number
): { all: number[][]; matching: number[] } {
    const [x, y, z] = position
    const [i, j, k, w] = orientation

    // console.log("RUN IK", x, y, z, w, i, j, k)

    const dhAlpha = [-90, 0, 90]

    const dh_a1 = dh[0].a
    const dh_a2 = dh[1].a
    // const dh_d1 = dh[0].d
    const dh_d3 = dh[2].d
    const dh_d4 = dh[3].d
    const dh_d6 = dh[5].d

    // const dh_d3 = 35
    // const dh_d4 = 225
    // const dh_d6 = 65
    // const dh_a1 = 0
    // const dh_a2 = 225

    const T06 = new Matrix4().compose(
        new Vector3(x, y, z),
        new Quaternion(i, j, k, w),
        new Vector3(1, 1, 1)
    )

    // log.debug("a,b,c=", a, b, c);
    // const T06 = [
    //     [Cos(b) * Cos(c), -Cos(b) * Sin(c), Sin(b), x],
    //     [Cos(c) * Sin(a) * Sin(b) + Cos(a) * Sin(c), Cos(a) * Cos(c) - Sin(a) * Sin(b) * Sin(c), -Cos(b) * Sin(a), y],
    //     [-Cos(a) * Cos(c) * Sin(b) + Sin(a) * Sin(c), Cos(c) * Sin(a) + Cos(a) * Sin(b) * Sin(c), Cos(a) * Cos(b), z],
    //     [0, 0, 0, 1]
    // ];

    const wcp = new Vector3(0, 0, -dh_d6)
    wcp.applyMatrix4(T06)

    // matprint("T06", T06);

    // const wcpXyz = math.multiply(T06, wcpOffset) as number[];

    const { x: wx, y: wy, z: wz } = wcp

    function gen_rot_matrix(theta: number, alpha_deg: number) {
        const alpha = (alpha_deg * Math.PI) / 180
        return [
            [Cos(theta), -Sin(theta) * Cos(alpha), Sin(theta) * Sin(alpha)],
            [Sin(theta), Cos(theta) * Cos(alpha), -Cos(theta) * Sin(alpha)],
            [0, Sin(alpha), Cos(alpha)]
        ]
    }

    function dot_all(matrices: any) {
        let r: any = undefined
        for (const m of matrices) {
            if (!r) {
                r = m
            } else {
                r = math.multiply(r, m)
            }
        }
        return r
    }

    const [A, B, C, D, E, F, G, H, I] = new Matrix3().setFromMatrix4(T06).elements
    // convert to math lib format
    const R06 = [
        [A, D, G],
        [B, E, H],
        [C, F, I]
    ]
    // const R06 = math.subset(T06, math.index([0, 1, 2], [0, 1, 2])) as number[][];

    const theta1 = () => {
        const theta1a = Math.atan2(wy, wx)
        const sqrt = wx * wx + wy * wy - dh_d3 * dh_d3
        const theta1c = Math.sqrt(Math.max(sqrt, 0))
        return [theta1a - Math.atan2(dh_d3, +theta1c), theta1a - Math.atan2(dh_d3, -theta1c)]
    }

    const theta2 = (c: number[]) => {
        const [theta1] = c
        const t1 =
            (Power(wx * Cos(theta1) + wy * Sin(theta1) - dh_a1, 2) +
                Power(dh_a2, 2) -
                Power(dh_d4, 2) +
                Power(wz, 2)) /
            (2 * dh_a2)
        const theta2a = Math.atan2(wx * Cos(theta1) + wy * Sin(theta1) - dh_a1, wz)
        const sqrt = Power(wx * Cos(theta1) + wy * Sin(theta1) - dh_a1, 2) + wz * wz - t1 * t1
        const theta2c = Math.sqrt(Math.max(sqrt, 0))
        return [theta2a - Math.atan2(t1, -theta2c), theta2a - Math.atan2(t1, +theta2c)]
    }

    const theta3 = (c: number[]) => {
        const [theta1, theta2] = c
        const atan_y = wx * Cos(theta1) + wy * Sin(theta1) - dh_a1 - dh_a2 * Cos(theta2)
        const atan_x = wz + dh_a2 * Sin(theta2)
        return [Math.atan2(atan_y, atan_x) - theta2]
    }

    const theta5 = (c: number[]) => {
        const R03 = dot_all([0, 1, 2].map(m => gen_rot_matrix(c[m], dhAlpha[m])))
        const R03T = math.transpose(R03) as number[][]
        const R36 = math.multiply(R03T, R06)
        const theta5a = R36[2][2]
        const theta5b = Sqrt(Power(R36[2][0], 2) + Power(R36[2][1], 2))

        return [Math.atan2(+theta5b, theta5a), Math.atan2(-theta5b, theta5a)]
    }

    const theta4 = (c: number[]) => {
        const [, , , theta5] = c
        const R03 = dot_all([0, 1, 2].map(m => gen_rot_matrix(c[m], dhAlpha[m])))
        const R03T = math.transpose(R03) as number[][]
        const R36 = math.multiply(R03T, R06)

        return [Math.atan2(R36[0][2] / Sin(theta5), -R36[1][2] / Sin(theta5)) - Math.PI / 2]
    }

    const theta6 = (c: number[]) => {
        const [, , , theta5] = c
        const R03 = dot_all([0, 1, 2].map(m => gen_rot_matrix(c[m], dhAlpha[m])))
        const R03T = math.transpose(R03) as number[][]
        const R36 = math.multiply(R03T, R06) as number[][]
        return [Math.atan2(R36[2][1] / Sin(theta5), -R36[2][0] / Sin(theta5))]
    }

    const sequence = [theta1, theta2, theta3, theta5, theta4, theta6]
    const result = Array.from(generate_configs(0, [], sequence))

    const all = result.map(r => {
        const tmp = r[3]
        r[3] = r[4]
        r[4] = tmp
        // add joint corrections
        return r.map((v, i) => v - degToRad(dh[i].beta))
    })

    // // hack to fix up resulting matrix
    // result.forEach(l => {
    //     // fix up based on home angles in DH matrix
    //     l[1] += Math.PI / 2 // TODO: use DH matrix
    //     l[2] -= Math.PI / 2
    //     // swap theta4 and theta5
    //     const tmp = l[3]
    //     l[3] = l[4]
    //     l[4] = tmp
    // })

    // const rdeg = result.map(r => r.map(c => c * 180 / Math.PI));
    // matprint("Result (degs)", rdeg);
    // matprint("Result (rads)", result);

    /*
    000=0
    001=1
    010=2
    011=3
    100=1

     */
    return { all, matching: all[configuration] }
}

export function find_configuration_tx40(thetas: number[], dh: DhMatrix[]): number {
    const [_theta1, theta2, theta3, _theta4, theta5, _theta6] = thetas.map(
        (t, i) => t + degToRad(dh[i].beta)
    )

    // theta2 -= Math.PI / 2
    // theta3 += Math.PI / 2

    // const dh_a1 = dh[0].a
    const dh_a2 = dh[1].a
    // const dh_d1 = dh[0].d
    // const dh_d3 = dh[2].d
    const dh_d4 = dh[3].d
    // const dh_d6 = dh[5].d

    const delta = dh_d4 * Math.sin(theta2 + theta3) + dh_a2 * Math.cos(theta2)

    let configurationNumber = 0

    if (delta < 0) {
        // BIT_SET(conf, 2);
        configurationNumber += 1
    }

    if (theta3 < 0) {
        configurationNumber += 2
        // BIT_SET(conf, 1);
    }

    if (theta5 < 0) {
        configurationNumber += 4
        // BIT_SET(conf, 0);
    }

    return configurationNumber
}
