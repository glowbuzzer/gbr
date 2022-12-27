const error = 5e-4

const zFiddle = 526.168
const sliderKinematicsLength = 148.8
const lengthOfCarriage = 100
const carriageEndToPivotOffset = 84.5
// 239.7091988222396 startoffset
// 119.78 start offset adjusted

export type angledLinearDeltaRobotParams = {
    distanceZ1: number
    distanceZ2: number
    radius1: number
    radius2: number
    tcpRadius: number
    sliderAngle: number
    jointLength: number
    carriagePivotOffsetZ: number
    carriagePivotOffsetY: number
    carriagePivotOffsetX: number //distance between two rods
    effectorShaftLength: number
    effectorInnerCircleRadius: number
}

export function AngledLinearDeltaFk(
    q: number[],
    {
        distanceZ1,
        distanceZ2,
        radius1,
        radius2,
        tcpRadius,
        sliderAngle,
        jointLength
    }: angledLinearDeltaRobotParams
): {
    orientation: [number, number, number, number]
    position: [number, number, number]
} {
    const startOffset = Math.sqrt(Math.pow(distanceZ1, 2) + Math.pow(distanceZ1, 2))
    const effectiveTcpRadius = Math.sqrt(3) * tcpRadius
    const effectiveBaseRadius = Math.sqrt(3) * (radius1 + distanceZ1)

    //apply offsets
    q[0] += startOffset
    q[1] += startOffset
    q[2] += startOffset

    const d1 = effectiveBaseRadius - effectiveTcpRadius
    const d2 = jointLength

    console.log("d1", d1)
    console.log("d2", d2)

    const armTheta = sliderAngle
    const sqr3 = Math.sqrt(3)
    const cang = Math.cos(armTheta)
    const sang = Math.sin(armTheta)

    const xa = (-sqr3 / 3) * d1 + q[0] * cang
    const ya = 0
    const za = -q[0] * sang

    const xb = (sqr3 / 6) * d1 - 0.5 * q[1] * cang
    const yb = 0.5 * (-d1 + sqr3 * q[1] * cang)
    const zb = -q[1] * sang

    const xc = (sqr3 / 6) * d1 - 0.5 * q[2] * cang
    const yc = 0.5 * (d1 - sqr3 * q[2] * cang)
    const zc = -q[2] * sang

    console.log(
        "(",
        xa,
        ",",
        ya,
        ",",
        za,
        "),",
        "(",
        xb,
        ",",
        yb,
        ",",
        zb,
        "),",
        "(",
        xc,
        ",",
        yc,
        ",",
        zc,
        ")"
    )

    const A1 = 2 * (xb - xa)
    const A2 = 2 * (xc - xb)

    const B1 = 2 * (yb - ya)
    const B2 = 2 * (yc - yb)

    const C1 = 2 * (zb - za)
    const C2 = 2 * (zc - zb)

    const D1 =
        Math.pow(xb, 2) -
        Math.pow(xa, 2) +
        Math.pow(yb, 2) -
        Math.pow(ya, 2) +
        Math.pow(zb, 2) -
        Math.pow(za, 2)
    const D2 =
        Math.pow(xc, 2) -
        Math.pow(xb, 2) +
        Math.pow(yc, 2) -
        Math.pow(yb, 2) +
        Math.pow(zc, 2) -
        Math.pow(zb, 2)

    const K = A1 * B2 - A2 * B1
    if (Math.abs(K) < error) {
        console.error("K small")
    }

    const E1 = (B1 * C2 - B2 * C1) / K
    const F1 = (B2 * D1 - B1 * D2) / K

    const E2 = (A2 * C1 - A1 * C2) / K
    const F2 = (A1 * D2 - A2 * D1) / K

    const a = Math.pow(E2, 2) + Math.pow(E1, 2) + 1
    const b = 2 * (E1 * (F1 - xa) + E2 * (F2 - ya) - za)
    const c =
        Math.pow(xa, 2) +
        Math.pow(ya, 2) +
        Math.pow(za, 2) +
        Math.pow(F1, 2) +
        Math.pow(F2, 2) -
        2 * (xa * F1 + ya * F1) -
        Math.pow(d2, 2)

    const delt = Math.pow(b, 2) - 4 * a * c
    if (delt < 0) {
        console.log("delt small")
    }
    const z = (-b - Math.sqrt(delt)) / (2 * a)
    const x = E1 * z + F1
    const y = E2 * z + F2

    return {
        orientation: [0, 0, 0, 1],
        position: [x, y, z]
    }
}

export function AngledLinearDeltaIk(
    position: [number, number, number],
    orientation: [number, number, number, number],
    {
        distanceZ1,
        distanceZ2,
        radius1,
        radius2,
        tcpRadius,
        sliderAngle,
        jointLength
    }: angledLinearDeltaRobotParams
): number[] {
    const startOffset = Math.sqrt(Math.pow(distanceZ1, 2) + Math.pow(distanceZ1, 2))
    const effectiveTcpRadius = Math.sqrt(3) * tcpRadius
    const effectiveBaseRadius = Math.sqrt(3) * (radius1 + distanceZ1)

    const d1 = effectiveBaseRadius - effectiveTcpRadius
    const d2 = jointLength

    const armTheta = sliderAngle
    const sqr3 = Math.sqrt(3)
    const cang = Math.cos(armTheta)
    const sang = Math.sin(armTheta)

    const temp = Math.pow(position[2], 2) - Math.pow(d2, 2)
    const b = 2 * (-((sqr3 / 3) * d1 + position[0]) * cang + position[2] * sang)
    const cc = Math.pow((sqr3 / 3) * d1 + position[0], 2) + Math.pow(position[1], 2) + temp

    const delt = b * b - 4 * cc
    if (delt < 0) {
        console.error("delt < 0")
    }
    const q0 = (-b - Math.sqrt(delt)) / 2 - startOffset

    const b1 =
        ((-sqr3 / 6) * d1 + position[0] - sqr3 * (0.5 * d1 + position[1])) * cang +
        2 * position[2] * sang
    const cc1 =
        Math.pow((sqr3 / 6) * d1 - position[0], 2) + Math.pow(0.5 * d1 + position[1], 2) + temp
    const delt1 = b1 * b1 - 4 * cc1
    if (delt1 < 0) {
        console.error("delt1<0")
    }
    const q1 = (-b1 - Math.sqrt(delt1)) / 2 - startOffset

    const b2 =
        ((-sqr3 / 6) * d1 + position[0] - sqr3 * (0.5 * d1 - position[1])) * cang +
        2 * position[2] * sang
    const cc2 =
        Math.pow((sqr3 / 6) * d1 - position[0], 2) + Math.pow(0.5 * d1 - position[1], 2) + temp
    const delt2 = b2 * b2 - 4 * cc2
    if (delt2 < 0) {
        console.error("delta2<0")
    }
    const q2 = (-b2 - Math.sqrt(delt2)) / 2 - startOffset

    return [q0, q1, q2]
}
