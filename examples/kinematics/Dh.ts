export type DhMatrix = {
    alpha: number
    beta: number
    theta: number
    a: number
    d: number
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
/*
    0,0,0,220,0,
    0,0,0,240,0,
    180,0,0,0,0,
    0,0,0,0,0
 */
