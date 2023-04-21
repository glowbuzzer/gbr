import * as THREE from "three"
import { PumaMatrix } from "./KinChainParams"

const SINGULAR_FUZZ = 0.000001
const FLAG_FUZZ = 0.000001

// /* flags for inverse kinematics */
const PUMA_SHOULDER_RIGHT = 0x01
const PUMA_ELBOW_DOWN = 0x02
const PUMA_WRIST_FLIP = 0x04
const PUMA_SINGULAR = 0x08 /* joints at a singularity */

export function fk_puma(
    thetas: number[],
    configParams: PumaMatrix
): {
    orientation: [number, number, number, number]
    position: [number, number, number]
} {
    const { A2, A3, D3, D4, D6 } = configParams

    let [theta1, theta2, theta3, theta4, theta5, theta6] = thetas

    const hom: THREE.Matrix4 = new THREE.Matrix4()

    /* Calculate sin of joints for future use */
    const s1 = Math.sin(theta1)
    const s2 = Math.sin(theta2)
    const s3 = Math.sin(theta3)
    const s4 = Math.sin(theta4)
    const s5 = Math.sin(theta5)
    const s6 = Math.sin(theta6)

    /* Calculate cos of joints for future use */
    const c1 = Math.cos(theta1)
    const c2 = Math.cos(theta2)
    const c3 = Math.cos(theta3)
    const c4 = Math.cos(theta4)
    const c5 = Math.cos(theta5)
    const c6 = Math.cos(theta6)

    const s23 = c2 * s3 + s2 * c3
    const c23 = c2 * c3 - s2 * s3

    /* Calculate terms to be used in definition of... */
    /* first column of rotation matrix.               */
    const t1_1 = c4 * c5 * c6 - s4 * s6
    const t2_1 = s23 * s5 * c6
    const t3_1 = s4 * c5 * c6 + c4 * s6
    const t4_1 = c23 * t1_1 - t2_1
    const t5_1 = c23 * s5 * c6

    /* Define first column of rotation matrix */
    hom.elements[0] = c1 * t4_1 + s1 * t3_1
    hom.elements[1] = s1 * t4_1 - c1 * t3_1
    hom.elements[2] = -s23 * t1_1 - t5_1

    /* Calculate terms to be used in definition of...  */
    /* second column of rotation matrix.               */
    const t1_2 = -c4 * c5 * s6 - s4 * c6
    const t2_2 = s23 * s5 * s6
    const t3_2 = c4 * c6 - s4 * c5 * s6
    const t4_2 = c23 * t1_2 + t2_2
    const t5_2 = c23 * s5 * s6

    /* Define second column of rotation matrix */
    hom.elements[4] = c1 * t4_2 + s1 * t3_2
    hom.elements[5] = s1 * t4_2 - c1 * t3_2
    hom.elements[6] = -s23 * t1_2 + t5_2

    /* Calculate term to be used in definition of... */
    /* third column of rotation matrix.              */
    const t1_3 = c23 * c4 * s5 + s23 * c5

    /* Define third column of rotation matrix */
    hom.elements[8] = -c1 * t1_3 - s1 * s4 * s5
    hom.elements[9] = -s1 * t1_3 + c1 * s4 * s5
    hom.elements[10] = s23 * c4 * s5 - c23 * c5

    /* Calculate term to be used in definition of...  */
    /* position vector.                               */
    const t1_4 = A2 * c2 + A3 * c23 - D4 * s23

    /* Define position vector */
    hom.elements[12] = c1 * t1_4 - D3 * s1
    hom.elements[13] = s1 * t1_4 + D3 * c1
    hom.elements[14] = -A3 * s23 - A2 * s2 - D4 * c23

    /*  add effect of d6 parameter */
    hom.elements[12] = hom.elements[12] + hom.elements[8] * D6
    hom.elements[13] = hom.elements[13] + hom.elements[9] * D6
    hom.elements[14] = hom.elements[14] + hom.elements[10] * D6

    /* convert hom.rot to world->quat */
    const resultS: THREE.Vector3 = new THREE.Vector3()
    const resultP: THREE.Vector3 = new THREE.Vector3()
    const resultQ: THREE.Quaternion = new THREE.Quaternion()
    hom.decompose(resultP, resultQ, resultS)
    return {
        position: [resultP.x, resultP.y, resultP.z],
        orientation: [resultQ.x, resultQ.y, resultQ.z, resultQ.w]
    }
}

export function ik_puma(
    configuration: number,
    position: [number, number, number],
    orientation: [number, number, number, number],
    configParams: PumaMatrix
): number[] {
    const [x, y, z] = position
    const [qx, qy, qz, qw] = orientation
    const { A2, A3, D3, D4, D6 } = configParams

    const hom: THREE.Matrix4 = new THREE.Matrix4()

    const posV: THREE.Vector3 = new THREE.Vector3(x, y, z)
    const scaleV: THREE.Vector3 = new THREE.Vector3(1, 1, 1)
    const rotQ: THREE.Quaternion = new THREE.Quaternion(qx, qy, qz, qw)
    hom.compose(posV, rotQ, scaleV)

    /* remove effect of d6 parameter */
    const px = hom.elements[12] - D6 * hom.elements[8]
    const py = hom.elements[13] - D6 * hom.elements[9]
    const pz = hom.elements[14] - D6 * hom.elements[10]

    /* Joint 1 (2 independent solutions) */

    /* save sum of squares for this and subsequent calcs */
    const sumSq = px * px + py * py - D3 * D3

    var th1
    /* FIXME-- is use of + sqrt shoulder right or left? */
    if (configuration & PUMA_SHOULDER_RIGHT) {
        th1 = Math.atan2(py, px) - Math.atan2(D3, -Math.sqrt(sumSq))
    } else {
        th1 = Math.atan2(py, px) - Math.atan2(D3, Math.sqrt(sumSq))
    }
    /* save sin, cos for later calcs */
    const s1 = Math.sin(th1)
    const c1 = Math.cos(th1)

    /* Joint 3 (2 independent solutions) */

    const k = (sumSq + pz * pz - A2 * A2 - A3 * A3 - D4 * D4) / (2.0 * A2)

    var th3
    /* FIXME-- is use of + sqrt elbow up or down? */
    if (configuration & PUMA_ELBOW_DOWN) {
        th3 = Math.atan2(A3, D4) - Math.atan2(k, -Math.sqrt(A3 * A3 + D4 * D4 - k * k))
    } else {
        th3 = Math.atan2(A3, D4) - Math.atan2(k, Math.sqrt(A3 * A3 + D4 * D4 - k * k))
    }

    /* compute sin, cos for later calcs */
    const s3 = Math.sin(th3)
    const c3 = Math.cos(th3)

    /* Joint 2 */

    const t1_1 = (-A3 - A2 * c3) * pz + (c1 * px + s1 * py) * (A2 * s3 - D4)
    const t2_1 = (A2 * s3 - D4) * pz + (A3 + A2 * c3) * (c1 * px + s1 * py)
    const t3 = pz * pz + (c1 * px + s1 * py) * (c1 * px + s1 * py)

    const th23 = Math.atan2(t1_1, t2_1)
    const th2 = th23 - th3

    /* compute sin, cos for later calcs */
    const s23 = t1_1 / t3
    const c23 = t2_1 / t3

    /* Joint 4 */

    const t1_2 = -hom.elements[8] * s1 + hom.elements[9] * c1
    const t2_2 = -hom.elements[8] * c1 * c23 - hom.elements[9] * s1 * c23 + hom.elements[10] * s23

    var th4
    if (Math.abs(t1_2) < SINGULAR_FUZZ && Math.abs(t2_2) < SINGULAR_FUZZ) {
        console.error("can't find")
        //        *fflags |= PUMA_REACH;
        //        th4 = joint[3]*PM_PI/180;            /* use current value */
    } else {
        th4 = Math.atan2(t1_2, t2_2)
    }

    /* compute sin, cos for later calcs */
    const s4 = Math.sin(th4)
    const c4 = Math.cos(th4)

    /* Joint 5 */
    const s5 =
        hom.elements[10] * (s23 * c4) -
        hom.elements[8] * (c1 * c23 * c4 + s1 * s4) -
        hom.elements[9] * (s1 * c23 * c4 - c1 * s4)

    const c5 = -hom.elements[8] * (c1 * s23) - hom.elements[9] * (s1 * s23) - hom.elements[10] * c23

    var th5 = Math.atan2(s5, c5)

    /* Joint 6 */
    const s6 =
        hom.elements[2] * (s23 * s4) -
        hom.elements[0] * (c1 * c23 * s4 - s1 * c4) -
        hom.elements[1] * (s1 * c23 * s4 + c1 * c4)

    const c6 =
        hom.elements[0] * ((c1 * c23 * c4 + s1 * s4) * c5 - c1 * s23 * s5) +
        hom.elements[1] * ((s1 * c23 * c4 - c1 * s4) * c5 - s1 * s23 * s5) -
        hom.elements[2] * (s23 * c4 * c5 + c23 * s5)

    var th6 = Math.atan2(s6, c6)

    /* FIXME-- is wrist flip the normal or offset results? */
    if (configuration & PUMA_WRIST_FLIP) {
        th4 = th4 + Math.PI
        th5 = -th5
        th6 = th6 + Math.PI
    }

    return [th1, th2, th3, th4, th5, th6]
}

export function find_configuration_puma(thetas: number[], configParams: PumaMatrix): number {
    const { A2, A3, D3, D4, D6 } = configParams

    let [theta1, theta2, theta3, theta4, theta5, theta6] = thetas

    const hom: THREE.Matrix4 = new THREE.Matrix4()

    /* Calculate sin of joints for future use */
    const s1 = Math.sin(theta1)
    const s2 = Math.sin(theta2)
    const s3 = Math.sin(theta3)
    const s4 = Math.sin(theta4)
    const s5 = Math.sin(theta5)
    const s6 = Math.sin(theta6)

    /* Calculate cos of joints for future use */
    const c1 = Math.cos(theta1)
    const c2 = Math.cos(theta2)
    const c3 = Math.cos(theta3)
    const c4 = Math.cos(theta4)
    const c5 = Math.cos(theta5)
    const c6 = Math.cos(theta6)

    const s23 = c2 * s3 + s2 * c3
    const c23 = c2 * c3 - s2 * s3

    /* Calculate terms to be used in definition of... */
    /* first column of rotation matrix.               */
    const t1_1 = c4 * c5 * c6 - s4 * s6
    const t2_1 = s23 * s5 * c6
    const t3_1 = s4 * c5 * c6 + c4 * s6
    const t4_1 = c23 * t1_1 - t2_1
    const t5_1 = c23 * s5 * c6

    /* Define first column of rotation matrix */
    hom.elements[0] = c1 * t4_1 + s1 * t3_1
    hom.elements[1] = s1 * t4_1 - c1 * t3_1
    hom.elements[2] = -s23 * t1_1 - t5_1

    /* Calculate terms to be used in definition of...  */
    /* second column of rotation matrix.               */
    const t1_2 = -c4 * c5 * s6 - s4 * c6
    const t2_2 = s23 * s5 * s6
    const t3_2 = c4 * c6 - s4 * c5 * s6
    const t4_2 = c23 * t1_2 + t2_2
    const t5_2 = c23 * s5 * s6

    /* Define second column of rotation matrix */
    hom.elements[4] = c1 * t4_2 + s1 * t3_2
    hom.elements[5] = s1 * t4_2 - c1 * t3_2
    hom.elements[6] = -s23 * t1_2 + t5_2

    /* Calculate term to be used in definition of... */
    /* third column of rotation matrix.              */
    const t1_3 = c23 * c4 * s5 + s23 * c5

    /* Define third column of rotation matrix */
    hom.elements[8] = -c1 * t1_3 - s1 * s4 * s5
    hom.elements[9] = -s1 * t1_3 + c1 * s4 * s5
    hom.elements[10] = s23 * c4 * s5 - c23 * c5

    /* Calculate term to be used in definition of...  */
    /* position vector.                               */
    const t1_4 = A2 * c2 + A3 * c23 - D4 * s23

    /* Define position vector */
    hom.elements[12] = c1 * t1_4 - D3 * s1
    hom.elements[13] = s1 * t1_4 + D3 * c1
    hom.elements[14] = -A3 * s23 - A2 * s2 - D4 * c23

    const sumSq =
        hom.elements[12] * hom.elements[12] + hom.elements[13] * hom.elements[13] - D3 * D3
    const k =
        (sumSq + hom.elements[14] * hom.elements[14] - A2 * A2 - A3 * A3 - D4 * D4) / (2.0 * A2)

    var iflags = 0
    //
    /* Set shoulder-up flag if necessary */
    if (
        Math.abs(theta1 - Math.atan2(hom[13], hom[12]) + Math.atan2(D3, -Math.sqrt(sumSq))) <
        FLAG_FUZZ
    ) {
        iflags |= PUMA_SHOULDER_RIGHT
    }

    /* Set elbow down flag if necessary */
    if (
        Math.abs(
            theta3 - Math.atan2(A3, D4) + Math.atan2(k, -Math.sqrt(A3 * A3 + D4 * D4 - k * k))
        ) < FLAG_FUZZ
    ) {
        iflags |= PUMA_ELBOW_DOWN
    }

    /* set singular flag if necessary */
    const t1 = -hom[8] * s1 + hom[9] * c1

    const t2 = -hom[8] * c1 * c23 - hom[9] * s1 * c23 + hom[10] * s23

    if (Math.abs(t1) < SINGULAR_FUZZ && Math.abs(t2) < SINGULAR_FUZZ) {
        iflags |= PUMA_SINGULAR
    } else {
        /* if not singular set wrist flip flag if necessary */
        if (!(Math.abs(theta4 - Math.atan2(t1, t2)) < FLAG_FUZZ)) {
            iflags |= PUMA_WRIST_FLIP
        }
    }

    return iflags
}

/* Row major-> Column major
0=0
1=4
2=8
3=12

4=1
5=5
6=9
7=13

8=2
9=6
10=10
11=14

13=3
14=7
15=11
16=15

 */
