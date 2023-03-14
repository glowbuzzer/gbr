import * as THREE from "three"

export class go_link implements Igo_link {
    dh: go_dh /*!< if you have DH params and don't want to convert to PP */
    pk: go_pk /*!< if you have a parallel machine, e.g., hexapod or robot crane */
    pp: go_pp /*!< if you have a serial machine, e.g., an industrial robot  */
    body: go_body /*!< the link's rigid body parameters */
    type: LinkParamRepresentation /*!< one of GO_LINK_DH,PK,PP  */
    quantity: LinkQuantities /*!< one of GO_QUANTITY_LENGTH,ANGLE */
    unrotate: number /*!< the unrotate for this link */
    constructor(
        dh: go_dh = { a: 0, alpha: 0, d: 0, theta: 0 },
        pk: go_pk = {
            base: { x: 0, y: 0, z: 0 },
            platform: { x: 0, y: 0, z: 0 },
            d: 0
        },
        pp: go_pp = {
            pose: {
                tran: { x: 0, y: 0, z: 0 },
                rot: { s: 1, x: 0, y: 0, z: 0 }
            }
        },
        urdf: go_urdf = {
            pose: { tran: { x: 0, y: 0, z: 0 }, rot: { s: 1, x: 0, y: 0, z: 0 } },
            axis: { x: 0, y: 0, z: 0 }
        },
        body: go_body = {
            mass: 0,
            inertia: [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ]
        },
        type: LinkParamRepresentation = LinkParamRepresentation.GO_LINK_DH,
        quantity: LinkQuantities = LinkQuantities.GO_QUANTITY_LENGTH,
        unrotate: number = 0
    ) {
        this.dh = dh
        this.pk = pk
        this.pp = pp
        this.urdf = urdf
        this.body = body
        this.type = type
        this.quantity = quantity
        this.unrotate = unrotate
    }
}

export enum LinkQuantities {
    GO_QUANTITY_NONE = 0,
    GO_QUANTITY_LENGTH,
    GO_QUANTITY_ANGLE
}

// interface Igo_quat {
//     s: number
//     x: number
//     y: number
//     z: number
// }
//
// export class go_quat implements Igo_quat {
//     s: number
//     x: number
//     y: number
//     z: number
//
//     constructor(s: number = 1, x: number = 0, y: number = 0, z: number = 0) {
//         this.s = s
//         this.x = x
//         this.y = y
//         this.z = z
//     }
// }

// interface Igo_pose {
//     tran: go_cart
//     rot: THREE.Quaternion
// }

export class go_pose {
    tran: THREE.Vector3
    rot: THREE.Quaternion;
    ["constructor"]: typeof go_pose

    constructor(tran = new THREE.Vector3(), rot = new THREE.Quaternion()) {
        this.tran = tran
        this.rot = rot
    }

    set(tran: THREE.Vector3, rot: THREE.Quaternion) {
        this.tran = tran
        this.rot = rot
        return this
    }

    copy(pose: go_pose) {
        this.tran = pose.tran
        this.rot = pose.rot
        return this
    }

    clone() {
        return new this.constructor().copy(this)
    }

    multiply(pose: go_pose) {
        return this.multiplyPoses(this, pose)
    }

    multiplyPoses(pose1: go_pose, pose2: go_pose) {
        this.tran = pose2.tran.clone().applyQuaternion(pose1.rot)
        this.tran.add(pose1.tran)
        this.rot = pose1.rot.clone().multiply(pose2.rot)

        return this
        //     go_pose out;
        //     go_result retval;
        //
        //     retval = go_quat_cart_mult(&p1->rot, &p2->tran, &out.tran);
        //     if (GO_RESULT_OK != retval) return retval;
        //
        //     retval = go_cart_cart_add(&p1->tran, &out.tran, &out.tran);
        //     if (GO_RESULT_OK != retval) return retval;
        //
        //     retval = go_quat_quat_mult(&p1->rot, &p2->rot, &out.rot);
        //
        // *pout = out;
        //
        //     return retval;
    }
}

interface Igo_cart {
    x: number
    y: number
    z: number
}

export class go_cart implements Igo_cart {
    x: number
    y: number
    z: number

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x
        this.y = y
        this.z = z
    }
}

/*!
    PK parameters are used for parallel kinematic mechanisms, and
represent the Cartesian positions of the ends of the link in the
stationary base frame and the moving platform frame. Currently this
only supports prismatic links.
*/

export enum LinkParamRepresentation {
    GO_LINK_DH = 1,
    GO_LINK_PK = 2,
    GO_LINK_PP = 3,
    GO_LINK_URDF = 4
}

interface Igo_pk {
    base: go_cart /*!< position of fixed end in base frame */
    platform: go_cart /*!< position of moving end in platform frame  */
    d: number /*!< the length of the link */
}

class go_pk implements Igo_pk {
    base: go_cart /*!< position of fixed end in base frame */
    platform: go_cart /*!< position of moving end in platform frame  */
    d: number /*!< the length of the link */
    constructor(
        base: go_cart = { x: 0, y: 0, z: 0 },
        platform: go_cart = { x: 0, y: 0, z: 0 },
        d: number = 0
    ) {
        this.base = base
        this.platform = platform
        this.d = d
    }
}

/*!
  PP parameters represent the pose of the link with respect to the
  previous link. Revolute joints rotate about the Z axis, prismatic
  joints slide along the Z axis.
 */
interface Igo_pp {
    pose: go_pose /*!< the pose of the link wrt to the previous link */
}

class go_pp implements Igo_pp {
    pose: go_pose /*!< the pose of the link wrt to the previous link */
    constructor(pose: go_pose = new go_pose()) {
        this.pose = pose
    }
}

// /*!
//   URDF parameters represent the pose of the link with respect to the
//   previous link. Revolute joints rotate about the axis specified, prismatic
//   joints slide along the axis specified.
//  */
// interface Igo_urdf {
//     pose: go_pose /*!< the pose of the link wrt to the previous link */
//     axis: go_cart /*!< the axis of rotation or translation */
// }
//
// class go_urdf implements Igo_urdf {
//     pose: go_pose /*!< the pose of the link wrt to the previous link */
//     axis: go_cart /*!< the axis of rotation or translation */
//     constructor(
//         pose: go_pose = { tran: { x: 0, y: 0, z: 0 }, rot: { s: 1, x: 0, y: 0, z: 0 } },
//         axis: go_cart = {
//             x: 0,
//             y: 0,
//             z: 0
//         }
//     ) {
//         this.pose = pose
//         this.axis = axis
//     }
// }

/*! Rigid body */
interface Igo_body {
    mass: number /*!< total mass of the rigid body */
    /*!
      The \a inertia matrix is the 3x3 matrix of moments of inertia with
      respect to the body's origin.
    */
    inertia: number[][]
}

class go_body implements Igo_body {
    mass: number /*!< total mass of the rigid body */
    /*!
        The \a inertia matrix is the 3x3 matrix of moments of inertia with
        respect to the body's origin.
     */
    inertia: number[][]

    constructor(
        mass: number = 0,
        inertia: number[][] = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ]
    ) {
        this.mass = mass
        this.inertia = inertia
    }
}

// interface Igo_dh {
//     a: number /*!< a[i-1] */
//     alpha: number /*!< alpha[i-1] */
//     d: number /*!< d[i] */
//     theta: number
// }

export class go_dh {
    a: number
    alpha: number
    d: number
    theta: number

    constructor(a: number = 0, alpha: number = 0, d: number = 0, theta: number = 0) {
        this.a = a
        this.alpha = alpha
        this.d = d
        this.theta = theta
    }

    toPose(pose: go_pose) {
        const sth = Math.sin(this.theta)
        const cth = Math.cos(this.theta)

        const sal = Math.sin(this.alpha)
        const cal = Math.cos(this.alpha)
        const h: THREE.Matrix4 = new THREE.Matrix4().set(
            cth,
            -sth,
            0,
            this.a,
            sth * cal,
            cth * cal,
            -sal,
            -sal * this.d,
            sth * sal,
            cth * sal,
            cal,
            cal * this.d,
            0,
            0,
            0,
            1
        )
        const tempPose = new go_pose()

        h.decompose(pose.tran, pose.rot, new THREE.Vector3())

        return pose

        //
        //
        // h.rot.x.x = cth
        // h.rot.y.x = -sth
        // h.rot.z.x = 0.0
        // h.rot.x.y = sth * cal
        // h.rot.y.y = cth * cal
        // h.rot.z.y = -sal
        // h.rot.x.z = sth * sal
        // h.rot.y.z = cth * sal
        // h.rot.z.z = cal
        //
        // h.tran.x = dh.a
        // h.tran.y = -sal * dh.d
        //
        // h.tran.z = cal * dh.d
        // return go_hom_pose_convert(h)
    }
}

interface Igo_link {
    dh: go_dh /*!< if you have DH params and don't want to convert to PP */
    pk: go_pk /*!< if you have a parallel machine, e.g., hexapod or robot crane */
    pp: go_pp /*!< if you have a serial machine, e.g., an industrial robot  */
    body: go_body /*!< the link's rigid body parameters */
    type: LinkParamRepresentation /*!< one of GO_LINK_DH,PK,PP  */
    quantity: LinkQuantities /*!< one of GO_QUANTITY_LENGTH,ANGLE */
}

export class go_link implements Igo_link {
    dh: go_dh /*!< if you have DH params and don't want to convert to PP */
    pk: go_pk /*!< if you have a parallel machine, e.g., hexapod or robot crane */
    pp: go_pp /*!< if you have a serial machine, e.g., an industrial robot  */
    body: go_body /*!< the link's rigid body parameters */
    type: LinkParamRepresentation /*!< one of GO_LINK_DH,PK,PP  */
    quantity: LinkQuantities /*!< one of GO_QUANTITY_LENGTH,ANGLE */
    unrotate: number /*!< the unrotate for this link */
    constructor(
        dh: go_dh = { a: 0, alpha: 0, d: 0, theta: 0 },
        pk: go_pk = {
            base: { x: 0, y: 0, z: 0 },
            platform: { x: 0, y: 0, z: 0 },
            d: 0
        },
        pp: go_pp = {
            pose: {
                tran: { x: 0, y: 0, z: 0 },
                rot: { s: 1, x: 0, y: 0, z: 0 }
            }
        },
        body: go_body = {
            mass: 0,
            inertia: [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ]
        },
        type: LinkParamRepresentation = LinkParamRepresentation.GO_LINK_DH,
        quantity: LinkQuantities = LinkQuantities.GO_QUANTITY_LENGTH,
        unrotate: number = 0
    ) {
        this.dh = dh
        this.pk = pk
        this.pp = pp
        this.body = body
        this.type = type
        this.quantity = quantity
        this.unrotate = unrotate
    }
}

export class go_matrix {
    rows: number
    cols: number
    el: number[][]
    elcpy: number[][]
    v: number[]
    index: number[]

    constructor(
        rows,
        cols,
        el: number[][] = []
        // elcpy: number[][] = [],
        // v: number[] = [],
        // index: number[] = []
    ) {
        this.rows = rows
        this.cols = cols
        this.el = el
        if (el == undefined) {
            for (let i = 0; i < this.rows; i++) {
                this.el[i] = []
                for (let j = 0; j < this.cols; j++) {
                    if (i == j) {
                        this.el[i][j] = 1
                    } else {
                        this.el[i][j] = 0
                    }
                }
            }
        }
        // this.elcpy = elcpy
        // this.v = v
        // this.index = index
    }

    identity() {
        for (let i = 0; i < this.rows; i++) {
            this.el[i] = []
            for (let j = 0; j < this.cols; j++) {
                if (i == j) {
                    this.el[i][j] = 1
                } else {
                    this.el[i][j] = 0
                }
            }
        }
        return this
    }

    multiplyMatrices(m1: go_matrix, m2: go_matrix) {
        const ae = m1.el
        const be = m2.el
        const te = this.el
        for (let i = 0; i < m1.rows; i++) {
            for (let j = 0; j < m2.cols; j++) {
                te[i][j] = 0
                for (let k = 0; k < m1.cols; k++) {
                    te[i][j] += ae[i][k] * be[k][j]
                }
            }
        }
        return this
    }

    multiply(m: go_matrix) {
        return this.multiplyMatrices(this, m)
    }

    preMultiply(m: go_matrix) {
        return this.multiplyMatrices(m, this)
    }

    multiplyScalar(s: number) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.el[i][j] *= s
            }
        }
        return this
    }

    transpose() {
        const te = this.el
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                te[i][j] = te[j][i]
            }
        }
        return this
    }

    addMatrices(m1: go_matrix, m2: go_matrix) {
        const ae = m1.el
        const be = m2.el
        const te = this.el
        for (let i = 0; i < m1.rows; i++) {
            te[i] = []
            for (let j = 0; j < m1.cols; j++) {
                te[i][j] = ae[i][j] + be[i][j]
            }
        }
        return this
    }

    add(m: go_matrix) {
        return this.addMatrices(this, m)
    }

    crossVector(v: THREE.Vector3) {
        const axv = new go_matrix(3, this.cols)
        //
        // if (a.rows != 3 || axv.rows != 3 || a.cols != axv.cols)
        //     return { ret: retval.GO_RESULT_ERROR, axv: null }

        // const vc = new go_cart(v[0], v[1], v[2])

        for (let col = 0; col < this.cols; col++) {
            const ac = new THREE.Vector3(this.el[0][col], this.el[1][col], this.el[2][col])
            const vout = new THREE.Vector3().crossVectors(ac, v)
            axv.el[0][col] = vout.x
            axv.el[1][col] = vout.y
            axv.el[2][col] = vout.z
        }

        return axv
    }

    setFromMatrix3(m: THREE.Matrix3) {
        this.rows = 3
        this.cols = 3
        this.el[0][0] = m.elements[0]
        this.el[0][1] = m.elements[3]
        this.el[0][2] = m.elements[6]

        this.el[1][0] = m.elements[1]
        this.el[1][1] = m.elements[4]
        this.el[1][2] = m.elements[7]

        this.el[2][0] = m.elements[2]
        this.el[2][1] = m.elements[5]
        this.el[2][2] = m.elements[8]

        return this
    }

    setFromMatrix4(m: THREE.Matrix4) {
        this.rows = 4
        this.cols = 4

        this.el[0][0] = m.elements[0]
        this.el[0][1] = m.elements[4]
        this.el[0][2] = m.elements[8]
        this.el[0][3] = m.elements[12]

        this.el[1][0] = m.elements[1]
        this.el[1][1] = m.elements[5]
        this.el[1][2] = m.elements[9]
        this.el[1][3] = m.elements[13]

        this.el[2][0] = m.elements[2]
        this.el[2][1] = m.elements[6]

        this.el[2][2] = m.elements[10]
        this.el[2][3] = m.elements[14]

        return this
    }

    setFromQuaternion(q: THREE.Quaternion) {
        this.rows = 3
        this.cols = 3
        const x = q.x,
            y = q.y,
            z = q.z,
            w = q.w
        const x2 = x + x,
            y2 = y + y,
            z2 = z + z
        const xx = x * x2,
            xy = x * y2,
            xz = x * z2
        const yy = y * y2,
            yz = y * z2,
            zz = z * z2
        const wx = w * x2,
            wy = w * y2,
            wz = w * z2

        this.el[0][0] = 1 - (yy + zz)
        this.el[0][1] = xy - wz
        this.el[0][2] = xz + wy

        this.el[1][0] = xy + wz
        this.el[1][1] = 1 - (xx + zz)
        this.el[1][2] = yz - wx

        this.el[2][0] = xz - wy
        this.el[2][1] = yz + wx
        this.el[2][2] = 1 - (xx + yy)

        return this
    }
}
