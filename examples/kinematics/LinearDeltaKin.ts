export type linearDeltaRobot = {
    x: number

}


const DELTA_DIAGONAL_ROD = 288.5

// Horizontal offset from middle of printer to smooth rod center.
const DELTA_SMOOTH_ROD_OFFSET = 206.0 // mm

// Horizontal offset of the universal joints on the end effector.
// DELTA_EFFECTOR_OFFSET = 32.0 // mm
const DELTA_EFFECTOR_OFFSET = 32.0 // mm

// Horizontal offset of the universal joints on the carriages.
// DELTA_CARRIAGE_OFFSET = 26.0 // mm
const DELTA_CARRIAGE_OFFSET = 25.0 // mm

// In order to correct low-center, DELTA_RADIUS must be increased.
// In order to correct high-center, DELTA_RADIUS must be decreased.
// For convex/concave -- -20->-30 makes the center go DOWN
// DELTA_FUDGE -27.4 // 152.4 total radius
const DELTA_FUDGE = 0.5

// Effective horizontal distance bridged by diagonal push rods.
const DELTA_RADIUS =
    DELTA_SMOOTH_ROD_OFFSET - DELTA_EFFECTOR_OFFSET - DELTA_CARRIAGE_OFFSET - DELTA_FUDGE
// DELTA_RADIUS = (DELTA_SMOOTH_ROD_OFFSET-DELTA_EFFECTOR_OFFSET-DELTA_CARRIAGE_OFFSET-DELTA_FUDGE)

const SIN_60 = 0.8660254037844386
const COS_60 = 0.5

const DELTA_TOWER1_X = 0.0 // back middle tower
const DELTA_TOWER1_Y = DELTA_RADIUS

const DELTA_TOWER2_X = -SIN_60 * DELTA_RADIUS // front left tower
const DELTA_TOWER2_Y = -COS_60 * DELTA_RADIUS

const DELTA_TOWER3_X = SIN_60 * DELTA_RADIUS // front right tower
const DELTA_TOWER3_Y = -COS_60 * DELTA_RADIUS

function sqrt(num) {
    return Math.sqrt(num)
}

function sq(num) {
    return num * num
}

const X_AXIS = 0
const Y_AXIS = 1
const Z_AXIS = 2

function LinearDeltaIk(cartesian) {
    var delta = []

    delta[X_AXIS] =
        sqrt(
            sq(DELTA_DIAGONAL_ROD) -
            sq(DELTA_TOWER1_X - cartesian[X_AXIS]) -
            sq(DELTA_TOWER1_Y - cartesian[Y_AXIS])
        ) + cartesian[Z_AXIS]
    delta[Y_AXIS] =
        sqrt(
            sq(DELTA_DIAGONAL_ROD) -
            sq(DELTA_TOWER2_X - cartesian[X_AXIS]) -
            sq(DELTA_TOWER2_Y - cartesian[Y_AXIS])
        ) + cartesian[Z_AXIS]
    delta[Z_AXIS] =
        sqrt(
            sq(DELTA_DIAGONAL_ROD) -
            sq(DELTA_TOWER3_X - cartesian[X_AXIS]) -
            sq(DELTA_TOWER3_Y - cartesian[Y_AXIS])
        ) + cartesian[Z_AXIS]

    return delta
}

function LinearDeltaFk(delta) {
    var cartesian = []

    var y1 = DELTA_TOWER1_Y
    var z1 = delta[X_AXIS]

    var x2 = DELTA_TOWER2_X
    var y2 = DELTA_TOWER2_Y
    var z2 = delta[Y_AXIS]

    var x3 = DELTA_TOWER3_X
    var y3 = DELTA_TOWER3_Y
    var z3 = delta[Z_AXIS]

    var re = DELTA_DIAGONAL_ROD

    var dnm = (y2 - y1) * x3 - (y3 - y1) * x2

    var w1 = y1 * y1 + z1 * z1
    var w2 = x2 * x2 + y2 * y2 + z2 * z2
    var w3 = x3 * x3 + y3 * y3 + z3 * z3

    // x = (a1*z + b1)/dnm
    var a1 = (z2 - z1) * (y3 - y1) - (z3 - z1) * (y2 - y1)
    var b1 = -((w2 - w1) * (y3 - y1) - (w3 - w1) * (y2 - y1)) / 2.0

    // y = (a2*z + b2)/dnm;
    var a2 = -(z2 - z1) * x3 + (z3 - z1) * x2
    var b2 = ((w2 - w1) * x3 - (w3 - w1) * x2) / 2.0

    // a*z^2 + b*z + c = 0
    var a = a1 * a1 + a2 * a2 + dnm * dnm
    var b = 2 * (a1 * b1 + a2 * (b2 - y1 * dnm) - z1 * dnm * dnm)
    var c = (b2 - y1 * dnm) * (b2 - y1 * dnm) + b1 * b1 + dnm * dnm * (z1 * z1 - re * re)

    // discriminant
    var d = b * b - 4.0 * a * c
    if (d < 0) return -1 // non-existing point

    cartesian[Z_AXIS] = (-0.5 * (b + sqrt(d))) / a
    cartesian[X_AXIS] = (a1 * cartesian[Z_AXIS] + b1) / dnm
    cartesian[Y_AXIS] = (a2 * cartesian[Z_AXIS] + b2) / dnm

    return cartesian
}
