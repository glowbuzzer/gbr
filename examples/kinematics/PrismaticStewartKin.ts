import * as THREE from "three"

const NUM_STRUTS: number = 6
const max_error: number = 500
const conv_criterion: number = 1e-5
const iter_limit: number = 120
const screw_lead: number = 0

/********************************************************************

 The functions are general enough to be configured for any platform
 configuration.  In the functions "kinematicsForward" and
 "kinematicsInverse" are arrays "a[i]" and "b[i]".  The values stored
 in these arrays correspond to the positions of the ends of the i'th
 strut. The value stored in a[i] is the position of the end of the i'th
 strut attatched to the platform, in platform coordinates. The value
 stored in b[i] is the position of the end of the i'th strut attached
 to the base, in base (world) coordinates.

 The default values for base and platform joints positions are defined
 in the header file genhexkins.h.  The actual values for a particular
 machine can be adjusted by hal parameters:

 genhexkins.base.N.x
 genhexkins.base.N.y
 genhexkins.base.N.z - base joint coordinates.

 genhexkins.platform.N.x
 genhexkins.platform.N.y
 genhexkins.platform.N.z - platform joint coordinates.

 genhexkins.spindle-offset - added to Z coordinates of all joints to
 change the machine origin. Facilitates
 adjusting spindle position.

 genhexkins.tool-offset - tool length offset (TCP offset along Z),
 implements RTCP function when connected to
 motion.tooloffset.Z.

 To avoid joints jump change tool offset (G43, G49) only when the
 platform is not tilted (A = B = 0).

 Some hexapods use non-captive screw actuators and universal (cardanic)
 joints, thus the strut lengths depend on orientation of joints axes.
 Strut length correction is implemented to compensate for this.
 The calculations use orientation (unit vectors) of base and platform
 joint axes and the lead of actuator screws:

 genhexkins.base-n.N.x
 genhexkins.base-n.N.y
 genhexkins.base-n.N.z - unit vectors of base joint axes;

 genhexkins.platform-n.N.x
 genhexkins.platform-n.N.y
 genhexkins.platform-n.N.z - unit vectors of platform joint axes
 in platform CS.
 genhexkins.screw-lead - lead of strut actuator screw, positive for
 right-hand thread. Default is 0 (strut length
 correction disabled).
 genhexkins.correction.N - pins showing current values of strut length
 correction.

 The kinematicsInverse function solves the inverse kinematics using
 a closed form algorithm.  The inverse kinematics problem is given
 the pose of the platform and returns the strut lengths. For this
 problem there is only one solution that is always returned correctly.

 The kinematicsForward function solves the forward kinematics using
 an iterative algorithm.  Due to the iterative nature of this algorithm
 the kinematicsForward function requires an initial value to begin the
 iterative routine and then converges to the "nearest" solution. The
 forward kinematics problem is given the strut lengths and returns the
 pose of the platform.  For this problem there arein multiple
 solutions.  The kinematicsForward function will return only one of
 these solutions which will be the solution nearest to the initial
 value given.  It is possible that there are no solutions "near" the
 given initial value and the iteration will not converge and no
 solution will be returned.  Assuming there is a solution "near" the
 initial value, the function will always return one correct solution
 out of the multiple possible solutions.

 Hal pins to control and observe forward kinematics iterations:

 genhexkins.convergence-criterion - minimum error value that ends
 iterations with converged solution;

 genhexkins.limit-iterations - limit of iterations, if exceeded
 iterations stop with no convergence;

 genhexkins.max-error - maximum error value, if exceeded iterations
 stop with no convergence;

 genhexkins.last-iterations - number of iterations spent for the
 last forward kinematics solution;

 genhexkins.max-iterations - maximum number of iterations spent for
 a converged solution during current session.

 ----------------------------------------------------------------------------*/

/******************************* MatInvert() ***************************/

/*-----------------------------------------------------------------------------
 This is a function that inverts a 6x6 matrix.
-----------------------------------------------------------------------------*/

function MatInvert(J: number[][]): number[][] {
    var JAug: number[][] = []
    var m: number = 0
    var temp: number = 0
    var InvJ: number[][] = []
    // const j:number
    // const k:number
    // const n:number

    /* This function determines the inverse of a 6x6 matrix using
       Gauss-Jordan elimination */

    /* Augment the Identity matrix to the Jacobian matrix */

    for (let j = 0; j <= 5; ++j) {
        JAug[j] = []
        for (let k = 0; k <= 5; ++k) {
            /* Assign J matrix to first 6 columns of AugJ */
            JAug[j][k] = J[j][k]
        }
        for (let k = 6; k <= 11; ++k) {
            /* Assign I matrix to last six columns of AugJ */
            if (k - 6 == j) {
                JAug[j][k] = 1
            } else {
                JAug[j][k] = 0
            }
        }
    }

    /* Perform Gauss elimination */
    for (let k = 0; k <= 4; ++k) {
        /* Pivot        */
        if (JAug[k][k] < 0.01 && JAug[k][k] > -0.01) {
            for (let j = k + 1; j <= 5; ++j) {
                if (JAug[j][k] > 0.01 || JAug[j][k] < -0.01) {
                    for (let n = 0; n <= 11; ++n) {
                        temp = JAug[k][n]
                        JAug[k][n] = JAug[j][n]
                        JAug[j][n] = temp
                    }
                    break
                }
            }
        }
        for (let j = k + 1; j <= 5; ++j) {
            /* Pivot */
            m = -JAug[j][k] / JAug[k][k]
            for (let n = 0; n <= 11; ++n) {
                JAug[j][n] = JAug[j][n] + m * JAug[k][n] /* (Row j) + m * (Row k) */
                if (JAug[j][n] < 0.000001 && JAug[j][n] > -0.000001) {
                    JAug[j][n] = 0
                }
            }
        }
    }

    /* Normalization of Diagonal Terms */
    for (let j = 0; j <= 5; ++j) {
        m = 1 / JAug[j][j]
        for (let k = 0; k <= 11; ++k) {
            JAug[j][k] = m * JAug[j][k]
        }
    }

    /* Perform Gauss Jordan Steps */
    for (let k = 5; k >= 0; --k) {
        for (let j = k - 1; j >= 0; --j) {
            m = -JAug[j][k] / JAug[k][k]
            for (let n = 0; n <= 11; ++n) {
                JAug[j][n] = JAug[j][n] + m * JAug[k][n]
            }
        }
    }

    /* Assign last 6 columns of JAug to InvJ */
    for (let j = 0; j <= 5; ++j) {
        InvJ[j] = []
        for (let k = 0; k <= 5; ++k) {
            InvJ[j][k] = JAug[j][k + 6]
        }
    }

    return InvJ
    /* FIXME-- check divisors for 0 above */
}

/******************************** MatMult() *********************************/

/*---------------------------------------------------------------------------
  This function simply multiplies a 6x6 matrix by a 1x6 vector
  ---------------------------------------------------------------------------*/

function MatMult(J: number[][], x: number[]): number[] {
    var Ans: number[] = []
    for (let j = 0; j <= 5; ++j) {
        Ans[j] = 0
        for (let k = 0; k <= 5; ++k) {
            Ans[j] = J[j][k] * x[k] + Ans[j]
        }
    }
    return Ans
}

/* declare arrays for base and platform coordinates */

// const b:THREE.Vector3[]
// const a:THREE.Vector3[]
//
// b[0]=new THREE.Vector3(0,0,0)
// b[1]

/* declare base and platform joint axes vectors */

// const nb1:THREE.Vector3[]
// const na0:THREE.Vector3[]

/***************************StrutLengthCorrection***************************/

// function StrutLengthCorrection(StrutVectUnit:THREE.Vector3,
// RMatrix:THREE.Matrix3,
// strut_number:number,
// ):number
// {
//     var nb2:THREE.Vector3
//     const nb3:THREE.Vector3
//     const na1:THREE.Vector3
//     const na2:THREE.Vector3
//     const dotprod:number
//
//     /* define base joints axis vectors */
//     pmCartCartCross(&base_normal[strut_number], StrutVectUnit, &nb2);
//     pmCartCartCross(StrutVectUnit, &nb2, &nb3);
//     pmCartUnitEq(&nb3);
//
//     /* define platform joints axis vectors */
//     pmMatCartMult(RMatrix, &na0[strut_number], &na1);
//     pmCartCartCross(&na1, StrutVectUnit, &na2);
//     pmCartUnitEq(&na2);
//
//     /* define dot product */
//     pmCartCartDot(&nb3, &na2, &dotprod);
//
//     return (screw_lead * Math.asin(dotprod) / Math.PI*2)
//
//     return 0;
// }

type RPY = {
    r: number
    p: number
    y: number
}

/**************************** kinematicsForward() ***************************/

// int pmMatCartMult(PmRotationMatrix const * const m, PmCartesian const * const v, PmCartesian * const vout)
// {
//     vout->x = m->x.x * v->x + m->y.x * v->y + m->z.x * v->z;
//     vout->y = m->x.y * v->x + m->y.y * v->y + m->z.y * v->z;
//     vout->z = m->x.z * v->x + m->y.z * v->y + m->z.z * v->z;
//
//     return pmErrno = 0;
// }

export function fk_Stewart(
    joints: readonly number[],
    currentPosition: readonly number[],
    currentOrientation: readonly number[]
): {
    orientation: [number, number, number, number]
    position: [number, number, number]
} {
    const [x, y, z] = currentPosition
    const [i, j, k, w] = currentOrientation

    var aw = new THREE.Vector3()
    var InvKinStrutVect = new THREE.Vector3()
    var InvKinStrutVectUnit = new THREE.Vector3()

    var RMatrix_a = new THREE.Vector3()
    var RMatrix_a_cross_Strut = new THREE.Vector3()

    var Jacobian: number[][] = []
    var InverseJacobian: number[][] = []
    var InvKinStrutLength: number = 0
    var StrutLengthDiff: number[] = []
    var delta: number[] = []
    var conv_err: number = 1.0
    var corr: number = 0

    const RMatrix = new THREE.Matrix4()
    // PmRotationMatrix RMatrix;
    // PmRpy q_RPY;

    // var q_RPY: RPY = { r: 0, p: 0, y: 0 }
    var iterate: number = 1
    // int i;
    var iteration: number = 0

    // genhexkins_read_hal_pins();

    /* abort on obvious problems, like joints <= 0 */
    /* FIXME-- should check against triangle inequality, so that joints
       are never too short to span shared base and platform sides */
    if (
        joints[0] <= 0.0 ||
        joints[1] <= 0.0 ||
        joints[2] <= 0.0 ||
        joints[3] <= 0.0 ||
        joints[4] <= 0.0 ||
        joints[5] <= 0.0
    ) {
        console.error("joints less than 0")
        throw "joints less than 0"
    }
    //need current position to do fk!
    /* assign a,b,c to roll, pitch, yaw angles */

    const rotQ = new THREE.Quaternion(i, j, k, w)
    const rotE = new THREE.Euler().setFromQuaternion(rotQ)

    //todo this is the problem!
    const q_RPY: RPY = { r: rotE.x, p: rotE.y, y: rotE.z }

    /* Assign translation values in pos to q_trans */

    const q_trans = new THREE.Vector3(x, y, z)

    /* Enter Newton-Raphson iterative method   */
    while (iterate) {
        /* check for large error and return error flag if no convergence */
        if (conv_err > +max_error || conv_err < -max_error) {
            /* we can't converge */
            console.error("Can't converge (max_error)")
            console.log("conv_err:", conv_err)
        }

        iteration++

        /* check iteration to see if the kinematics can reach the
           convergence criterion and return error flag if it can't */
        if (iteration > iter_limit) {
            /* we can't converge */
            console.error("Can't converge (iter_limit)")
            throw "Can't converge (iter_limit)"
        }

        /* Convert q_RPY to Rotation Matrix */
        // pmRpyMatConvert(&q_RPY, &RMatrix);

        RMatrix.makeRotationFromEuler(rotE)
        // RMatrix.makeRotationFromQuaternion(rotQ)

        /* compute StrutLengthDiff[] by running inverse kins on Cartesian
         estimate to get joint estimate, subtract joints to get joint deltas,
         and compute inv J while we're at it */
        for (let i = 0; i < NUM_STRUTS; i++) {
            // pmMatCartMult(&RMatrix, &a[i], &RMatrix_a);
            RMatrix_a = platformCoordinates[i].clone().applyMatrix4(RMatrix)
            // RMatrix_a.applyMatrix4(RMatrix)

            // pmCartCartAdd(&q_trans, &RMatrix_a, &aw);
            aw = q_trans.clone().add(RMatrix_a)

            //todo which way round sub????
            // pmCartCartSub(&aw, &b[i], &InvKinStrutVect);
            // InvKinStrutVect = aw.clone().sub(baseCoordinates[i])
            InvKinStrutVect = baseCoordinates[i].clone().sub(aw)
            InvKinStrutVect.subVectors(aw, baseCoordinates[i])

            const normed = InvKinStrutVect.clone().normalize()

            if (normed == InvKinStrutVectUnit) {
                console.error("A strut vector has zero length")
            }
            InvKinStrutVectUnit = normed.clone()
            InvKinStrutLength = InvKinStrutVect.length()

            // pmCartMag(&InvKinStrutVect, &InvKinStrutLength);

            if (screw_lead != 0.0) {
                /* enable strut length correction */
                //todo
                // StrutLengthCorrection(&InvKinStrutVectUnit, &RMatrix, i, &corr);
                /* define corrected joint lengths */
                // InvKinStrutLength += corr
            }

            StrutLengthDiff[i] = InvKinStrutLength - joints[i]

            /* Determine RMatrix_a_cross_strut */
            // pmCartCartCross(&RMatrix_a, &InvKinStrutVectUnit, &RMatrix_a_cross_Strut);

            // console.log("inv", i, InvKinStrutVectUnit)
            RMatrix_a_cross_Strut = RMatrix_a.clone().cross(InvKinStrutVectUnit)
            /* Build Inverse Jacobian Matrix */
            InverseJacobian[i] = []
            InverseJacobian[i][0] = InvKinStrutVectUnit.x
            InverseJacobian[i][1] = InvKinStrutVectUnit.y
            InverseJacobian[i][2] = InvKinStrutVectUnit.z
            InverseJacobian[i][3] = RMatrix_a_cross_Strut.x
            InverseJacobian[i][4] = RMatrix_a_cross_Strut.y
            InverseJacobian[i][5] = RMatrix_a_cross_Strut.z
        }

        /* invert Inverse Jacobian */
        Jacobian = MatInvert(InverseJacobian)

        /* multiply Jacobian by LegLengthDiff */
        delta = MatMult(Jacobian, StrutLengthDiff)

        /* subtract delta from last iterations pos values */
        q_trans.x -= delta[0]
        q_trans.y -= delta[1]
        q_trans.z -= delta[2]
        // q_RPY.r -= delta[3]
        // q_RPY.p -= delta[4]
        // q_RPY.y -= delta[5]
        rotE.x -= delta[3]
        rotE.y -= delta[4]
        rotE.z -= delta[5]

        /* determine value of conv_error (used to determine if no convergence) */
        conv_err = 0.0
        for (let i = 0; i < NUM_STRUTS; i++) {
            conv_err += Math.abs(StrutLengthDiff[i])
        }

        /* enter loop to determine if a strut needs another iteration */
        iterate = 0 /*assume iteration is done */
        for (let i = 0; i < NUM_STRUTS; i++) {
            // console.log(StrutLengthDiff[i])
            if (Math.abs(StrutLengthDiff[i]) > conv_criterion) {
                iterate = 1
            }
        }
    } /* exit Newton-Raphson Iterative loop */

    // const newRotE = new THREE.Euler(q_RPY.r, q_RPY.p, q_RPY.y)

    const newRotQ = new THREE.Quaternion()
    newRotQ.setFromEuler(rotE)

    return {
        orientation: [newRotQ.x, newRotQ.y, newRotQ.z, newRotQ.w],
        position: [q_trans.x, q_trans.y, q_trans.z]
    }

    // /* assign r,p,y to a,b,c */
    // pos->a = q_RPY.r * 180.0 / PM_PI;
    // pos->b = q_RPY.p * 180.0 / PM_PI;
    // pos->c = q_RPY.y * 180.0 / PM_PI;
    //
    // /* assign q_trans to pos */
    // position.x = q_trans.x
    // position.y = q_trans.y
    // position.z = q_trans.z
    //todo
    // *haldata->last_iter = iteration;
    //
    //     if (iteration > max_iter){
    // *haldata->max_iter = iteration;
    // }
    // return 0;
}

/************************ kinematicsInverse() ********************************/

/* the inverse kinematics take world coordinates and determine joint values,
   given the inverse kinematics flags to resolve any ambiguities. The forward
   flags are set to indicate their value appropriate to the world coordinates
   passed in. */

export function ik_Stewart(
    position: readonly [number, number, number],
    orientation: readonly [number, number, number, number]
): { jointPositions: number[]; rodPositions: THREE.Vector3[] } {
    const [x, y, z] = position
    const [i, j, k, w] = orientation

    const joints: number[] = []
    var aw = new THREE.Vector3()
    var temp = new THREE.Vector3()
    var InvKinStrutVect = new THREE.Vector3()
    var InvKinStrutVectUnit = new THREE.Vector3()

    const RMatrix = new THREE.Matrix4()
    // PmRotationMatrix RMatrix;
    var rpy: RPY = { r: 0, p: 0, y: 0 }
    // int i;
    // const InvKinStrutLength: number
    var corr: number

    // genhexkins_read_hal_pins();

    const rotQ = new THREE.Quaternion(i, j, k, w)
    const rotE = new THREE.Euler().setFromQuaternion(rotQ)

    const posV3 = new THREE.Vector3(x, y, z)

    /* define Rotation Matrix */
    rpy.r = rotE.x
    rpy.p = rotE.y
    rpy.y = rotE.z

    const modifiedPlatformCoordinates: THREE.Vector3[] = []

    // pmRpyMatConvert(&rpy, &RMatrix);
    RMatrix.makeRotationFromQuaternion(rotQ)

    /* enter for loop to calculate joints (strut lengths) */
    for (let i = 0; i < NUM_STRUTS; i++) {
        /* convert location of platform strut end from platform
           to world coordinates */
        // pmMatCartMult(&RMatrix, &a[i], &temp);

        temp = platformCoordinates[i].clone().applyMatrix4(RMatrix)

        // pmCartCartAdd(&pos->tran, &temp, &aw);

        // aw = posV3.add(temp)
        //todo??why??
        aw = posV3.clone().add(temp)
        // console.log("aw", aw, "posV3", posV3, "temp", temp)
        modifiedPlatformCoordinates[i] = aw.clone()

        /* define strut lengths */
        // pmCartCartSub(&aw, &b[i], &InvKinStrutVect);

        // InvKinStrutVect = aw.clone().sub(baseCoordinates[i])
        InvKinStrutVect = baseCoordinates[i].clone().sub(aw)

        // pmCartMag(&InvKinStrutVect, &InvKinStrutLength);

        // InvKinStrutVect.length()

        // if (screw_lead != 0.0) {
        //     /* enable strut length correction */
        //     /* define unit strut vector */
        //     if (0 != pmCartUnit(&InvKinStrutVect, &InvKinStrutVectUnit)) {
        //         return -1;
        //     }
        //     /* define correction value and corrected joint lengths */
        //     StrutLengthCorrection(&InvKinStrutVectUnit, &RMatrix, i, &corr);
        // *haldata->correction[i] = corr;
        //     InvKinStrutLength += corr;
        // }

        joints[i] = InvKinStrutVect.length()
    }

    return { jointPositions: joints, rodPositions: modifiedPlatformCoordinates }
}

//     for (i = 0; i < 6; i++) {
//
//         if ((res = hal_param_float_newf(HAL_RW, &(haldata->basex[i]), comp_id,
//             "genhexkins.base.%d.x", i)) < 0)
//         goto error;
//
//         if ((res = hal_param_float_newf(HAL_RW, &haldata->basey[i], comp_id,
//             "genhexkins.base.%d.y", i)) < 0)
//         goto error;
//
//         if ((res = hal_param_float_newf(HAL_RW, &haldata->basez[i], comp_id,
//             "genhexkins.base.%d.z", i)) < 0)
//         goto error;
//
//         if ((res = hal_param_float_newf(HAL_RW, &haldata->platformx[i], comp_id,
//             "genhexkins.platform.%d.x", i)) < 0)
//         goto error;
//
//         if ((res = hal_param_float_newf(HAL_RW, &haldata->platformy[i], comp_id,
//             "genhexkins.platform.%d.y", i)) < 0)
//         goto error;
//
//         if ((res = hal_param_float_newf(HAL_RW, &haldata->platformz[i], comp_id,
//             "genhexkins.platform.%d.z", i)) < 0)
//         goto error;
//
//         if ((res = hal_param_float_newf(HAL_RW, &haldata->basenx[i], comp_id,
//             "genhexkins.base-n.%d.x", i)) < 0)
//         goto error;
//
//         if ((res = hal_param_float_newf(HAL_RW, &haldata->baseny[i], comp_id,
//             "genhexkins.base-n.%d.y", i)) < 0)
//         goto error;
//
//         if ((res = hal_param_float_newf(HAL_RW, &haldata->basenz[i], comp_id,
//             "genhexkins.base-n.%d.z", i)) < 0)
//         goto error;
//
//         if ((res = hal_param_float_newf(HAL_RW, &haldata->platformnx[i], comp_id,
//             "genhexkins.platform-n.%d.x", i)) < 0)
//         goto error;
//
//         if ((res = hal_param_float_newf(HAL_RW, &haldata->platformny[i], comp_id,
//             "genhexkins.platform-n.%d.y", i)) < 0)
//         goto error;
//
//         if ((res = hal_param_float_newf(HAL_RW, &haldata->platformnz[i], comp_id,
//             "genhexkins.platform-n.%d.z", i)) < 0)
//         goto error;
//
//         if ((res = hal_pin_float_newf(HAL_OUT, &haldata->correction[i], comp_id,
//             "genhexkins.correction.%d", i)) < 0)
//         goto error;
//     *haldata->correction[i] = 0.0;
//
//     }
//
//     if ((res = hal_pin_u32_newf(HAL_OUT, &haldata->last_iter, comp_id,
//     "genhexkins.last-iterations")) < 0)
//     goto error;
// *haldata->last_iter = 0;
//
//     if ((res = hal_pin_u32_newf(HAL_OUT, &haldata->max_iter, comp_id,
//     "genhexkins.max-iterations")) < 0)
//     goto error;
// *haldata->max_iter = 0;
//
//     if ((res = hal_param_float_newf(HAL_RW, &haldata->max_error, comp_id,
//     "genhexkins.max-error")) < 0)
//     goto error;
//     haldata->max_error = 500.0;
//
//     if ((res = hal_param_float_newf(HAL_RW, &haldata->conv_criterion, comp_id,
//     "genhexkins.convergence-criterion")) < 0)
//     goto error;
//     haldata->conv_criterion = 1e-9;
//
//     if ((res = hal_param_u32_newf(HAL_RW, &haldata->iter_limit, comp_id,
//     "genhexkins.limit-iterations")) < 0)
//     goto error;
//     haldata->iter_limit = 120;
//
//     if ((res = hal_pin_float_newf(HAL_IN, &haldata->tool_offset, comp_id,
//     "genhexkins.tool-offset")) < 0)
//     goto error;
// *haldata->tool_offset = 0.0;
//
//     if ((res = hal_param_float_newf(HAL_RW, &haldata->spindle_offset, comp_id,
//     "genhexkins.spindle-offset")) < 0)
//     goto error;
//     haldata->spindle_offset = 0.0;
//
//     if ((res = hal_param_float_newf(HAL_RW, &haldata->screw_lead, comp_id,
//     "genhexkins.screw-lead")) < 0)
//     goto error;
//     haldata->screw_lead = DEFAULT_SCREW_LEAD;
//
//     haldata->basex[0] = DEFAULT_BASE_0_X;
//     haldata->basey[0] = DEFAULT_BASE_0_Y;
//     haldata->basez[0] = DEFAULT_BASE_0_Z;
//     haldata->basex[1] = DEFAULT_BASE_1_X;
//     haldata->basey[1] = DEFAULT_BASE_1_Y;
//     haldata->basez[1] = DEFAULT_BASE_1_Z;
//     haldata->basex[2] = DEFAULT_BASE_2_X;
//     haldata->basey[2] = DEFAULT_BASE_2_Y;
//     haldata->basez[2] = DEFAULT_BASE_2_Z;
//     haldata->basex[3] = DEFAULT_BASE_3_X;
//     haldata->basey[3] = DEFAULT_BASE_3_Y;
//     haldata->basez[3] = DEFAULT_BASE_3_Z;
//     haldata->basex[4] = DEFAULT_BASE_4_X;
//     haldata->basey[4] = DEFAULT_BASE_4_Y;
//     haldata->basez[4] = DEFAULT_BASE_4_Z;
//     haldata->basex[5] = DEFAULT_BASE_5_X;
//     haldata->basey[5] = DEFAULT_BASE_5_Y;
//     haldata->basez[5] = DEFAULT_BASE_5_Z;
//
//     haldata->platformx[0] = DEFAULT_PLATFORM_0_X;
//     haldata->platformy[0] = DEFAULT_PLATFORM_0_Y;
//     haldata->platformz[0] = DEFAULT_PLATFORM_0_Z;
//     haldata->platformx[1] = DEFAULT_PLATFORM_1_X;
//     haldata->platformy[1] = DEFAULT_PLATFORM_1_Y;
//     haldata->platformz[1] = DEFAULT_PLATFORM_1_Z;
//     haldata->platformx[2] = DEFAULT_PLATFORM_2_X;
//     haldata->platformy[2] = DEFAULT_PLATFORM_2_Y;
//     haldata->platformz[2] = DEFAULT_PLATFORM_2_Z;
//     haldata->platformx[3] = DEFAULT_PLATFORM_3_X;
//     haldata->platformy[3] = DEFAULT_PLATFORM_3_Y;
//     haldata->platformz[3] = DEFAULT_PLATFORM_3_Z;
//     haldata->platformx[4] = DEFAULT_PLATFORM_4_X;
//     haldata->platformy[4] = DEFAULT_PLATFORM_4_Y;
//     haldata->platformz[4] = DEFAULT_PLATFORM_4_Z;
//     haldata->platformx[5] = DEFAULT_PLATFORM_5_X;
//     haldata->platformy[5] = DEFAULT_PLATFORM_5_Y;
//     haldata->platformz[5] = DEFAULT_PLATFORM_5_Z;
//
//     haldata->basenx[0] = DEFAULT_BASE_0_NX;
//     haldata->baseny[0] = DEFAULT_BASE_0_NY;
//     haldata->basenz[0] = DEFAULT_BASE_0_NZ;
//     haldata->basenx[1] = DEFAULT_BASE_1_NX;
//     haldata->baseny[1] = DEFAULT_BASE_1_NY;
//     haldata->basenz[1] = DEFAULT_BASE_1_NZ;
//     haldata->basenx[2] = DEFAULT_BASE_2_NX;
//     haldata->baseny[2] = DEFAULT_BASE_2_NY;
//     haldata->basenz[2] = DEFAULT_BASE_2_NZ;
//     haldata->basenx[3] = DEFAULT_BASE_3_NX;
//     haldata->baseny[3] = DEFAULT_BASE_3_NY;
//     haldata->basenz[3] = DEFAULT_BASE_3_NZ;
//     haldata->basenx[4] = DEFAULT_BASE_4_NX;
//     haldata->baseny[4] = DEFAULT_BASE_4_NY;
//     haldata->basenz[4] = DEFAULT_BASE_4_NZ;
//     haldata->basenx[5] = DEFAULT_BASE_5_NX;
//     haldata->baseny[5] = DEFAULT_BASE_5_NY;
//     haldata->basenz[5] = DEFAULT_BASE_5_NZ;
//
//     haldata->platformnx[0] = DEFAULT_PLATFORM_0_NX;
//     haldata->platformny[0] = DEFAULT_PLATFORM_0_NY;
//     haldata->platformnz[0] = DEFAULT_PLATFORM_0_NZ;
//     haldata->platformnx[1] = DEFAULT_PLATFORM_1_NX;
//     haldata->platformny[1] = DEFAULT_PLATFORM_1_NY;
//     haldata->platformnz[1] = DEFAULT_PLATFORM_1_NZ;
//     haldata->platformnx[2] = DEFAULT_PLATFORM_2_NX;
//     haldata->platformny[2] = DEFAULT_PLATFORM_2_NY;
//     haldata->platformnz[2] = DEFAULT_PLATFORM_2_NZ;
//     haldata->platformnx[3] = DEFAULT_PLATFORM_3_NX;
//     haldata->platformny[3] = DEFAULT_PLATFORM_3_NY;
//     haldata->platformnz[3] = DEFAULT_PLATFORM_3_NZ;
//     haldata->platformnx[4] = DEFAULT_PLATFORM_4_NX;
//     haldata->platformny[4] = DEFAULT_PLATFORM_4_NY;
//     haldata->platformnz[4] = DEFAULT_PLATFORM_4_NZ;
//     haldata->platformnx[5] = DEFAULT_PLATFORM_5_NX;
//     haldata->platformny[5] = DEFAULT_PLATFORM_5_NY;
//     haldata->platformnz[5] = DEFAULT_PLATFORM_5_NZ;
//
//     hal_ready(comp_id);
//     return 0;
//
//     error:
//         hal_exit(comp_id);
//     return res;
// }
//
//
// void rtapi_app_exit(void)
// {
//     hal_exit(comp_id);
// }

/* Default position of base strut ends in base (world) coordinates */
//b

// var base: THREE.Vector3[] = [
//     new THREE.Vector3(-22.95, 13.25, 0.0),
//     new THREE.Vector3(22.95, 13.25, 0.0),
//     new THREE.Vector3(22.95, 13.25, 0.0),
//     new THREE.Vector3(0.0, -26.5, 0.0),
//     new THREE.Vector3(0.0, -26.5, 0.0),
//     new THREE.Vector3(-22.95, 13.25, 0.0)
// ]
/* Default position of platform strut end in platform coordinate system */
//a

// var platform: THREE.Vector3[] = [
//     new THREE.Vector3(-1.0, 11.5, 0.0),
//     new THREE.Vector3(1.0, 11.5, 0.0),
//     new THREE.Vector3(10.459, -4.884, 0.0),
//     new THREE.Vector3(9.459, -6.616, 0.0),
//     new THREE.Vector3(-9.459, -6.616, 0.0),
//     new THREE.Vector3(-10.459, -4.884, 0.0)
// ]

// export const baseCoordinates: THREE.Vector3[] = [
//     new THREE.Vector3(-157.059, 65.056, 0),
//     new THREE.Vector3(-134.87, 103.4894, 0),
//     new THREE.Vector3(134.87, 103.4894, 0),
//     new THREE.Vector3(157.06, 65.0562, 0),
//     new THREE.Vector3(22.189, -168.545, 0),
//     new THREE.Vector3(-22.189, -168.545, 0)
// ]
// // must be rotated by 120 degress
//
// export const platformCoordinates: THREE.Vector3[] = [
//     new THREE.Vector3(-117.4615, 42.7525, 0),
//     new THREE.Vector3(-21.706, -123.1, 0),
//     new THREE.Vector3(21.706, -123.1, 0),
//     new THREE.Vector3(117.4615, 42.7525, 0),
//     new THREE.Vector3(95.7555, 80.34845, 0),
//     new THREE.Vector3(-95.7555, 80.34845, 0)
// ]

export const baseCoordinates: THREE.Vector3[] = [
    new THREE.Vector3(-22.189, -168.545, 0),
    new THREE.Vector3(22.189, -168.545, 0),
    new THREE.Vector3(157.06, 65.0562, 0),
    new THREE.Vector3(134.87, 103.4894, 0),
    new THREE.Vector3(-134.87, 103.4894, 0),
    new THREE.Vector3(-157.059, 65.056, 0)
]
// must be rotated by 120 degress

export const platformCoordinates: THREE.Vector3[] = [
    new THREE.Vector3(-21.706, -123.1, 0), //1
    new THREE.Vector3(21.706, -123.1, 0), //2
    new THREE.Vector3(117.4615, 42.7525, 0), //3
    new THREE.Vector3(95.7555, 80.34845, 0), //4
    new THREE.Vector3(-95.7555, 80.34845, 0), //5
    new THREE.Vector3(-117.4615, 42.7525, 0) //6
]

/* Default unit vectors of base joints axes in world coordinates */

var base_normal: THREE.Vector3[] = [
    new THREE.Vector3(0.707107, 0.0, 0.707107),
    new THREE.Vector3(0.0, -0.707107, 0.707107),
    new THREE.Vector3(-0.707107, 0.0, 0.707107),
    new THREE.Vector3(-0.707107, 0.0, 0.707107),
    new THREE.Vector3(0.0, 0.707107, 0.707107),
    new THREE.Vector3(0.707107, 0.0, 0.707107)
]
/* Default unit vectors of platform joints axes in platform coordinates */

var platform_normal: THREE.Vector3[] = [
    new THREE.Vector3(-1.0, 0.0, 0.0),
    new THREE.Vector3(0.866025, 0.5, 0.0),
    new THREE.Vector3(0.866025, 0.5, 0.0),
    new THREE.Vector3(0.866025, -0.5, 0.0),
    new THREE.Vector3(0.866025, -0.5, 0.0),
    new THREE.Vector3(-1.0, 0.0, 0.0)
]

//cpluplus test
// config.base_joints = {{
//     {2.57940852063914, 0.797904557985617, 0},
//     {1.98070987733051, 1.83488102661872, 0},
//     {-1.98070987733051, 1.83488102661872, 0},
//     {-2.57940852063914, 0.797904557985617, 0},
//     {-0.598698643308632, -2.63278558460434, 0},
//     {0.598698643308631, -2.63278558460434, 0},
// }};
// config.platform_joints = {{
//     {0.955336489125606, -0.295520206661340, 0},
//     {0.221740238262456, 0.975105772075681, 0},
//     {-0.221740238262455, 0.975105772075681, 0},
//     {-0.955336489125606, -0.295520206661339, 0},
//     {-0.733596250863151, -0.679585565414341, 0},
//     {0.733596250863150, -0.679585565414341, 0},
// }};
