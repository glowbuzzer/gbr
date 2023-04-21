// robot geometry
// const e = 150.0;     // end effector
// const  f = 207.85;     // base
// const  re = 200.0; //lower joint lnegth
// const  rf = 100.0;// upper joint length

// trigonometric constants
// const  sqrt3 = 1.7320508;
const sqrt3 = Math.sqrt(3)
// const  sin120 = 0.8660254;
const sin120 = Math.sin((120 * Math.PI) / 180)
const cos120 = -0.5
// const  tan60 = 1.7320508;
const tan60 = Math.tan((60 * Math.PI) / 180)
const sin30 = 0.5
// const  tan30 = 0.5773503;
const tan30 = Math.tan((30 * Math.PI) / 180)

export type revoluteDeltaRobot = {
    effectorTriangleSideLength: number
    baseTriangleSideLength: number
    lowerJointLength: number
    upperJointLength: number
}

export function RevoluteDeltaFk(
    thetas: number[],
    {
        effectorTriangleSideLength,
        baseTriangleSideLength,
        lowerJointLength,
        upperJointLength
    }: revoluteDeltaRobot
): {
    orientation: [number, number, number, number]
    position: [number, number, number]
} {
    let [theta1, theta2, theta3] = thetas

    const e = effectorTriangleSideLength
    const f = baseTriangleSideLength
    const re = lowerJointLength
    const rf = upperJointLength

    const t = ((f - e) * tan30) / 2
    // const  dtr = Math.PI/180.0;

    // theta1 *= dtr;
    // theta2 *= dtr;
    // theta3 *= dtr;

    const y1 = -(t + rf * Math.cos(theta1))
    const z1 = -rf * Math.sin(theta1)

    const y2 = (t + rf * Math.cos(theta2)) * sin30
    const x2 = y2 * tan60
    const z2 = -rf * Math.sin(theta2)

    const y3 = (t + rf * Math.cos(theta3)) * sin30
    const x3 = -y3 * tan60
    const z3 = -rf * Math.sin(theta3)

    const dnm = (y2 - y1) * x3 - (y3 - y1) * x2

    const w1 = y1 * y1 + z1 * z1
    const w2 = x2 * x2 + y2 * y2 + z2 * z2
    const w3 = x3 * x3 + y3 * y3 + z3 * z3

    // x = (a1*z + b1)/dnm
    const a1 = (z2 - z1) * (y3 - y1) - (z3 - z1) * (y2 - y1)
    const b1 = -((w2 - w1) * (y3 - y1) - (w3 - w1) * (y2 - y1)) / 2.0

    // y = (a2*z + b2)/dnm;
    const a2 = -(z2 - z1) * x3 + (z3 - z1) * x2
    const b2 = ((w2 - w1) * x3 - (w3 - w1) * x2) / 2.0

    // a*z^2 + b*z + c = 0
    const a = a1 * a1 + a2 * a2 + dnm * dnm
    const b = 2 * (a1 * b1 + a2 * (b2 - y1 * dnm) - z1 * dnm * dnm)
    const c = (b2 - y1 * dnm) * (b2 - y1 * dnm) + b1 * b1 + dnm * dnm * (z1 * z1 - re * re)

    // discriminant
    const d = b * b - 4.0 * a * c

    if (d < 0) {
        console.error("fk: non-existing point")
    } // non-existing point

    const z0 = (-0.5 * (b + Math.sqrt(d))) / a
    const x0 = (a1 * z0 + b1) / dnm
    const y0 = (a2 * z0 + b2) / dnm

    return {
        orientation: [0, 0, 0, 1],
        position: [x0, y0, z0]
    }
}

function delta_calcAngleYZ(
    x0: number,
    y0: number,
    z0: number,
    effectorTriangleSideLength: number,
    baseTriangleSideLength: number,
    lowerJointLength: number,
    upperJointLength: number
): { status: boolean; angle: number } {
    const e = effectorTriangleSideLength
    const f = baseTriangleSideLength
    const re = lowerJointLength
    const rf = upperJointLength

    const y1 = -0.5 * 0.57735 * f // f/2 * tg 30
    y0 -= 0.5 * 0.57735 * e // shift center to edge

    //0.57735-sqrt(3)/3

    // z = a + b*y
    const a = (x0 * x0 + y0 * y0 + z0 * z0 + rf * rf - re * re - y1 * y1) / (2 * z0)
    const b = (y1 - y0) / z0

    // discriminant
    const d = -(a + b * y1) * (a + b * y1) + rf * (b * b * rf + rf)

    if (d < 0) {
        console.log("no existing")
        return { status: false, angle: 0 }
    } // non-existing point

    const yj = (y1 - a * b - Math.sqrt(d)) / (b * b + 1) // choosing outer point
    const zj = a + b * yj

    return { status: true, angle: Math.atan(-zj / (y1 - yj)) + (yj > y1 ? Math.PI : 0.0) }
}

export function RevoluteDeltaIk(
    position: [number, number, number],
    orientation: [number, number, number, number],
    {
        effectorTriangleSideLength,
        baseTriangleSideLength,
        lowerJointLength,
        upperJointLength
    }: revoluteDeltaRobot
): number[] {
    const [x, y, z] = position
    const [i, j, k, w] = orientation

    const e = effectorTriangleSideLength
    const f = baseTriangleSideLength
    const re = lowerJointLength
    const rf = upperJointLength

    var theta1 = 0
    var theta2 = 0
    var theta3 = 0

    var result = delta_calcAngleYZ(x, y, z, e, f, re, rf)

    theta1 = result.angle

    result.angle = 0

    if (result.status == true) {
        result = delta_calcAngleYZ(
            x * cos120 + y * sin120,
            y * cos120 - x * sin120,
            z,
            e,
            f,
            re,
            rf
        ) // rotate coords to +120 deg
        theta2 = result.angle
    } else {
        console.log("No ik solution 1")
    }
    result.angle = 0

    if (result.status == true) {
        result = delta_calcAngleYZ(
            x * cos120 - y * sin120,
            y * cos120 + x * sin120,
            z,
            e,
            f,
            re,
            rf
        )
        theta3 = result.angle
    } else {
        console.log("No ik solution 2")
    } // rotate coords to -120 deg

    if (result.status == false) {
        console.error("ik: non-existing point")
    }

    return [theta1, theta2, theta3]
}
