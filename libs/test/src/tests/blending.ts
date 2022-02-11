import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { Vector3 } from "three"
import { ACTIVITYSTATE, ARCDIRECTION, BLENDTYPE, POSITIONREFERENCE } from "../../../store/src"

const test = uvu.suite("blending")

test.before.each(ctx => {
    console.log(ctx.__test__)
    gbc.reset()
    gbc.enable_operation()
    gbc.capture(false) // set to true to generate trajectory plots
})

const tag = state => state.stream.tag
const pos = joint => state => state.status.joint[joint].actPos

/**
 * NOTES on further blending tests (when required)
 *
 * Path Velocity
 * - simple check on sequence of moves that we never stop (between initial and end ramps)
 *
 * Proximity to Junction
 * - track when blend active
 * - take point at start of blend, point of junction and point at end of blend
 * - draw circle using the three points
 * - check that all points on path are within the circle
 *
 */

test("can blend move line / move line at 100pc", () => {
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 100
    }
    const line1 = gbc.activity.moveLine(
        new Vector3(25, 5, 0),
        POSITIONREFERENCE.ABSOLUTE,
        moveParams
    ).command
    const line2 = gbc.activity.moveLine(
        new Vector3(20, 25, 0),
        POSITIONREFERENCE.ABSOLUTE,
        moveParams
    ).command
    const end_program = gbc.activity.endProgram().command

    try {
        gbc.stream([line1, line2, end_program]) //
            .assert.streamSequence(tag, [
                [25, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [30, 0, ACTIVITYSTATE.ACTIVITY_INACTIVE]
            ])
            .verify()
    } finally {
        gbc.plot("moveline-moveline-100")
    }
})

test("can blend move line / move line at 50pc", () => {
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 50
    }
    const line1 = gbc.activity.moveLine(
        new Vector3(25, 5, 0),
        POSITIONREFERENCE.ABSOLUTE,
        moveParams
    ).command
    const line2 = gbc.activity.moveLine(
        new Vector3(20, 25, 0),
        POSITIONREFERENCE.ABSOLUTE,
        moveParams
    ).command
    const end_program = gbc.activity.endProgram().command

    try {
        gbc.stream([line1, line2, end_program]) //
            .assert.streamSequence(tag, [
                [25, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [15, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [10, 0, ACTIVITYSTATE.ACTIVITY_INACTIVE]
            ])
            .verify()
    } finally {
        gbc.plot("moveline-moveline-50")
    }
})

test("can blend move line / move arc at 100pc", () => {
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 100
    }
    const line1 = gbc.activity.moveLine(
        new Vector3(25, 0, 0),
        POSITIONREFERENCE.ABSOLUTE,
        moveParams
    ).command
    const line2 = gbc.activity.moveArcWithCentre(
        new Vector3(0, 25, 0),
        new Vector3(0, 0, 0),
        ARCDIRECTION.ARCDIRECTION_CCW,
        POSITIONREFERENCE.ABSOLUTE,
        moveParams
    ).command
    const end_program = gbc.activity.endProgram().command

    try {
        gbc.stream([line1, line2, end_program]) //
            .assert.streamSequence(tag, [
                [25, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [30, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [40, 0, ACTIVITYSTATE.ACTIVITY_INACTIVE]
            ])
            .verify()
    } finally {
        gbc.plot("moveline-movearc-100")
    }
})

test("can blend move to / move arc at 100pc", () => {
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 100
    }
    const line1 = gbc.activity.moveToPosition(
        new Vector3(25, 0, 0),
        undefined,
        POSITIONREFERENCE.ABSOLUTE,
        moveParams
    ).command
    const line2 = gbc.activity.moveArcWithCentre(
        new Vector3(0, 25, 0),
        new Vector3(0, 0, 0),
        ARCDIRECTION.ARCDIRECTION_CCW,
        POSITIONREFERENCE.ABSOLUTE,
        moveParams
    ).command
    const end_program = gbc.activity.endProgram().command

    try {
        gbc.stream([line1, line2, end_program]) //
            .assert.streamSequence(tag, [
                [25, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [30, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [40, 0, ACTIVITYSTATE.ACTIVITY_INACTIVE]
            ])
            .verify()
    } finally {
        gbc.plot("moveto-movearc-100")
    }
})

test("can blend move arc / move line at 100pc", () => {
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 100
    }
    const line1 = gbc.activity.moveArcWithCentre(
        new Vector3(25, 25, 0),
        new Vector3(25, 0, 0),
        ARCDIRECTION.ARCDIRECTION_CW,
        POSITIONREFERENCE.ABSOLUTE,
        moveParams
    ).command
    const line2 = gbc.activity.moveLine(
        new Vector3(5, 25, 0),
        POSITIONREFERENCE.ABSOLUTE,
        moveParams
    ).command
    const end_program = gbc.activity.endProgram().command

    try {
        gbc.stream([line1, line2, end_program]) //
            .assert.streamSequence(tag, [
                [50, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [50, 0, ACTIVITYSTATE.ACTIVITY_INACTIVE]
            ])
            .verify()
    } finally {
        gbc.plot("movearc-moveline-100")
    }
})

test("can blend move arc / move to position at 100pc", () => {
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 100
    }
    const line1 = gbc.activity.moveArcWithCentre(
        new Vector3(25, 25, 0),
        new Vector3(25, 0, 0),
        ARCDIRECTION.ARCDIRECTION_CW,
        POSITIONREFERENCE.ABSOLUTE,
        moveParams
    ).command
    const line2 = gbc.activity.moveToPosition(
        new Vector3(5, 25, 0),
        undefined,
        POSITIONREFERENCE.ABSOLUTE,
        moveParams
    ).command
    const end_program = gbc.activity.endProgram().command

    try {
        gbc.stream([line1, line2, end_program]) //
            .assert.streamSequence(
                tag,
                [
                    [40, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                    [10, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                    [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                    [25, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                    [30, 0, ACTIVITYSTATE.ACTIVITY_INACTIVE]
                ],
                true
            )
            .verify()
    } finally {
        gbc.plot("movearc-moveto-100")
    }
})

test("can blend move arc / move arc at 100pc", () => {
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 100
    }
    const arc1 = gbc.activity.moveArcWithCentre(
        new Vector3(25, 25, 0),
        new Vector3(25, 0, 0),
        ARCDIRECTION.ARCDIRECTION_CW,
        POSITIONREFERENCE.ABSOLUTE,
        moveParams
    ).command
    const arc2 = gbc.activity.moveArcWithCentre(
        new Vector3(0, 0, 0),
        new Vector3(0, 25, 0),
        ARCDIRECTION.ARCDIRECTION_CW,
        POSITIONREFERENCE.ABSOLUTE,
        moveParams
    ).command
    const end_program = gbc.activity.endProgram().command

    try {
        gbc.stream([arc1, arc2, end_program]) //
            .assert.streamSequence(tag, [
                [40, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [30, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [30, 0, ACTIVITYSTATE.ACTIVITY_INACTIVE]
            ])
            .verify()
    } finally {
        gbc.plot("movearc-movearc-100")
    }
})

test("can blend move to position / move line at 100pc", () => {
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 100
    }
    const line1 = gbc.activity.moveToPosition(
        new Vector3(25, 5, 0),
        undefined,
        POSITIONREFERENCE.ABSOLUTE,
        moveParams
    ).command
    const line2 = gbc.activity.moveLine(
        new Vector3(20, 25, 0),
        POSITIONREFERENCE.ABSOLUTE,
        moveParams
    ).command

    const end_program = gbc.activity.endProgram().command

    try {
        gbc.stream([line1, line2, end_program]) //
            .assert.streamSequence(tag, [
                [25, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [30, 0, ACTIVITYSTATE.ACTIVITY_INACTIVE]
            ])
            .verify()
    } finally {
        gbc.plot("moveto-moveline-100")
    }
})

test("can blend move to position / move to position 100pc", () => {
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 100
    }
    const line1 = gbc.activity.moveToPosition(
        new Vector3(25, 5, 0),
        undefined,
        POSITIONREFERENCE.ABSOLUTE,
        moveParams
    ).command
    const line2 = gbc.activity.moveToPosition(
        new Vector3(20, 25, 0),
        undefined,
        POSITIONREFERENCE.ABSOLUTE,
        moveParams
    ).command

    const end_program = gbc.activity.endProgram().command

    try {
        gbc.stream([line1, line2, end_program]) //
            .assert.streamSequence(tag, [
                [25, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [30, 0, ACTIVITYSTATE.ACTIVITY_INACTIVE]
            ])
            .verify()
    } finally {
        gbc.plot("moveto-moveto-100")
    }
})

test("can blend move line / move to position 100pc", () => {
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 100
    }
    const line1 = gbc.activity.moveLine(
        new Vector3(25, 5, 0),
        POSITIONREFERENCE.ABSOLUTE,
        moveParams
    ).command
    const line2 = gbc.activity.moveToPosition(
        new Vector3(20, 25, 0),
        undefined,
        POSITIONREFERENCE.ABSOLUTE,
        moveParams
    ).command

    const end_program = gbc.activity.endProgram().command

    try {
        gbc.stream([line1, line2, end_program]) //
            .assert.streamSequence(tag, [
                [25, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [30, 0, ACTIVITYSTATE.ACTIVITY_INACTIVE]
            ])
            .verify()
    } finally {
        gbc.plot("moveline-moveto-100")
    }
})

test("CANNOT blend move joints / move to position", () => {
    // we don't support this yet so should not be blended at all
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 100
    }
    const line1 = gbc.activity.moveJoints(
        [25, 5, 0],
        POSITIONREFERENCE.ABSOLUTE,
        moveParams
    ).command
    const line2 = gbc.activity.moveToPosition(
        new Vector3(20, 25, 0),
        undefined,
        POSITIONREFERENCE.ABSOLUTE,
        moveParams
    ).command

    const end_program = gbc.activity.endProgram().command

    try {
        gbc.stream([line1, line2, end_program]) //
            .assert.streamSequence(tag, [
                [25, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [20, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [40, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [30, 0, ACTIVITYSTATE.ACTIVITY_INACTIVE]
            ])
            .verify()
    } finally {
        gbc.plot("movejoints-moveto-100")
    }
})

test("CANNOT blend move line / move joints", () => {
    // we don't support this yet so should not be blended at all
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 100
    }
    const line1 = gbc.activity.moveLine(
        new Vector3(25, 5, 0),
        POSITIONREFERENCE.ABSOLUTE,
        moveParams
    ).command
    const line2 = gbc.activity.moveJoints(
        [20, 25, 0],
        POSITIONREFERENCE.ABSOLUTE,
        moveParams
    ).command

    const end_program = gbc.activity.endProgram().command

    try {
        gbc.stream([line1, line2, end_program]) //
            .assert.streamSequence(tag, [
                [30, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [20, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [40, 0, ACTIVITYSTATE.ACTIVITY_INACTIVE]
            ])
            .verify()
    } finally {
        gbc.plot("moveline-movejoints-100")
    }
})

test("can handle very short move in blend sequence", async () => {
    try {
        gbc.send_gcode(
            `
                G64
                G1X1
                G1Y0.1
                G1X2
                M2`
        )
            .assert.streamSequence(
                tag,
                [
                    [5, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                    [12, 2, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE], // this should be in blend
                    [5, 3, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                    [6, 3, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                    [15, 0, ACTIVITYSTATE.ACTIVITY_INACTIVE]
                ],
                true /* set to false to skip verify */
            )
            .verify()
            .assert.near(pos(0), 2)
            .assert.near(pos(1), 0.1)
    } finally {
        gbc.plot("blend-short-move-issue")
    }
})

test("handles incomplete gcode during blend", async () => {
    try {
        gbc.send_gcode(
            `
                G64
                G91
                G1 X1 Y1
                G1 Y-1 ; doesn't specify X so has to determine X from machine state (prior to reaching target)
                M2`
        )
            .assert.streamSequence(
                tag,
                [[35, 0, ACTIVITYSTATE.ACTIVITY_INACTIVE]],
                true /* set to false to skip verify */
            )
            .verify()
            .assert.near(pos(0), 1)
            .assert.near(pos(1), 0)
    } finally {
        gbc.plot("blend-handle-partial-gcode")
    }
})

test("can handle very short arc in blend sequence", async () => {
    try {
        gbc.send_gcode(
            `
                G64
                G1 X0.99
                G3 X1 Y0.01 I0 J0.01
                G1 Y1
                M2`
        )
            .assert.streamSequence(
                tag,
                [
                    [5, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                    [13, 2, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE], // this should be in blend
                    [10, 4, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                    [20, 0, ACTIVITYSTATE.ACTIVITY_INACTIVE]
                ],
                true /* set to false to skip verify */
            )
            .verify()
            .assert.near(pos(0), 1)
            .assert.near(pos(1), 1)
    } finally {
        gbc.plot("blend-short-move-arc")
    }
})

export const blending = test
