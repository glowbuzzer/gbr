export type DhMatrix = {
    alpha: number
    beta: number
    theta: number
    a: number
    d: number
}

export type PumaMatrix = {
    A2: number
    A3: number
    D3: number
    D4: number
    D6: number
}

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

/**
 * staubli tx40 6-dof dh matrix
 *     -90, 0, 0, 0, 0,
 *     0, 0,-90, 225, 0,
 *     90, 0, 90, 0, 35,
 *     -90, 0, 0, 0, 225,
 *     90, 0, 0, 0, 0,
 *     0, 0, 0, 0, 65
 */
export const staubli_tx40_dh: DhMatrix[] = [
    {
        alpha: -90,
        beta: 0,
        theta: 0,
        a: 0,
        d: 0
    },
    {
        alpha: 0,
        beta: 0,
        theta: -90,
        a: 225,
        d: 0
    },
    {
        alpha: 90,
        beta: 0,
        theta: 90,
        a: 0,
        d: 35
    },
    {
        alpha: -90,
        beta: 0,
        theta: 0,
        a: 0,
        d: 225
    },
    {
        alpha: 90,
        beta: 0,
        theta: 0,
        a: 0,
        d: 0
    },
    {
        alpha: 0,
        beta: 0,
        theta: 0,
        a: 0,
        d: 65
    }
]

/* ts2_40

 * Joints   di      ai-1    alpha
 * 1        d1      L1      0
 * 2        0       L2      0
 * 3        -d3     0       180
 * 4        0       0       0
 *


 */
// const a1 = 220
// const a2 = 240
// const d1 = 0
// const d4 = 0

export const staubli_ts2_40_dh: DhMatrix[] = [
    { alpha: 0, beta: 0, theta: 0, a: 220, d: 0 },
    { alpha: 0, beta: 0, theta: 0, a: 240, d: 0 },
    { alpha: 180, beta: 0, theta: 0, a: 0, d: 0 },
    { alpha: 0, beta: 0, theta: 0, a: 0, d: 0 }
]

export const puma_560_params: PumaMatrix = {
    A2: 431.8,
    A3: 20.3,
    D3: 150.05,
    D4: 431.8,
    D6: 63.5
}

export const DLE_DR_0001: angledLinearDeltaRobotParams = {
    distanceZ1: 169.5,
    distanceZ2: 103.8,
    radius1: 221.3,
    radius2: 117.5,
    tcpRadius: 42,
    sliderAngle: Math.PI / 4,
    jointLength: 400,
    carriagePivotOffsetZ: 82.67,
    carriagePivotOffsetY: 36.7,
    carriagePivotOffsetX: 39.4, //distance between two rods
    effectorShaftLength: 39.4,
    effectorInnerCircleRadius: 42
}

export const DLE_DR_0050: angledLinearDeltaRobotParams = {
    distanceZ1: 159.4,
    distanceZ2: 159.4,
    radius1: 377.7,
    radius2: 156.1,
    tcpRadius: 42,
    sliderAngle: Math.PI / 4,
    jointLength: 600,
    carriagePivotOffsetZ: 82.67,
    carriagePivotOffsetY: 36.7,
    carriagePivotOffsetX: 39.4, //distance between two rods
    effectorShaftLength: 39.4,
    effectorInnerCircleRadius: 42
}
