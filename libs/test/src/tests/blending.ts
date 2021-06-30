import * as uvu from "uvu"
import * as assert from "uvu/assert"
import { gbc } from "../../gbc"
import { Vector3 } from "three"
import { ACTIVITYSTATE, BLENDTYPE, POSITIONREFERENCE } from "../../../store/src"

const test = uvu.suite("blending")

test.before.each(ctx => {
    console.log(ctx.__test__)
    gbc.reset()
    gbc.enable_operation()
    gbc.capture(true) // set to true to generate trajectory plots
})

const tag = state => state.stream.tag

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
    const line1 = gbc.activity.moveLine(new Vector3(25, 5, 0), false, moveParams).command
    const line2 = gbc.activity.moveLine(new Vector3(20, 25, 0), false, moveParams).command
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
    const line1 = gbc.activity.moveLine(new Vector3(25, 5, 0), false, moveParams).command
    const line2 = gbc.activity.moveLine(new Vector3(20, 25, 0), false, moveParams).command
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

const sqrt2 = Math.sqrt(2)

test("can blend move line / move arc at 100pc", () => {
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 100
    }
    const line1 = gbc.activity.moveLine(new Vector3(25, 5, 0), false, moveParams).command
    const line2 = gbc.activity.moveArc(
        new Vector3(0, 25, 0),
        new Vector3(25 / sqrt2, 25 / sqrt2, 0),
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
    const line1 = gbc.activity.moveToPosition(new Vector3(25, 5, 0), moveParams).command
    const line2 = gbc.activity.moveArc(
        new Vector3(0, 25, 0),
        new Vector3(25 / sqrt2, 25 / sqrt2, 0),
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
    const line1 = gbc.activity.moveArc(
        new Vector3(25, 25, 0),
        new Vector3(25 / sqrt2, 25 - 25 / sqrt2, 0),
        POSITIONREFERENCE.ABSOLUTE,
        moveParams
    ).command
    const line2 = gbc.activity.moveLine(new Vector3(5, 25, 0), false, moveParams).command
    const end_program = gbc.activity.endProgram().command

    try {
        gbc.stream([line1, line2, end_program]) //
            .assert.streamSequence(tag, [
                [40, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [30, 0, ACTIVITYSTATE.ACTIVITY_INACTIVE]
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
    const line1 = gbc.activity.moveArc(
        new Vector3(25, 25, 0),
        new Vector3(25 / sqrt2, 25 - 25 / sqrt2, 0),
        POSITIONREFERENCE.ABSOLUTE,
        moveParams
    ).command
    const line2 = gbc.activity.moveToPosition(new Vector3(5, 25, 0), moveParams).command
    const end_program = gbc.activity.endProgram().command

    try {
        gbc.stream([line1, line2, end_program]) //
            .assert.streamSequence(tag, [
                [40, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [30, 0, ACTIVITYSTATE.ACTIVITY_INACTIVE]
            ])
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
    const arc1 = gbc.activity.moveArc(
        new Vector3(25, 25, 0),
        new Vector3(25 / sqrt2, 25 - 25 / sqrt2, 0),
        POSITIONREFERENCE.ABSOLUTE,
        moveParams
    ).command
    const arc2 = gbc.activity.moveArc(
        new Vector3(0, 0, 0),
        new Vector3(25 - 25 / sqrt2, 25 / sqrt2, 0),
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
    const line1 = gbc.activity.moveToPosition(new Vector3(25, 5, 0), moveParams).command
    const line2 = gbc.activity.moveLine(new Vector3(20, 25, 0), false, moveParams).command

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
    const line1 = gbc.activity.moveToPosition(new Vector3(25, 5, 0), moveParams).command
    const line2 = gbc.activity.moveToPosition(new Vector3(20, 25, 0), moveParams).command

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
    const line1 = gbc.activity.moveLine(new Vector3(25, 5, 0), false, moveParams).command
    const line2 = gbc.activity.moveToPosition(new Vector3(20, 25, 0), moveParams).command

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
    const line1 = gbc.activity.moveJoints([25, 5, 0], POSITIONREFERENCE.ABSOLUTE, moveParams)
        .command
    const line2 = gbc.activity.moveToPosition(new Vector3(20, 25, 0), moveParams).command

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
    const line1 = gbc.activity.moveLine(new Vector3(25, 5, 0), false, moveParams).command
    const line2 = gbc.activity.moveJoints([20, 25, 0], POSITIONREFERENCE.ABSOLUTE, moveParams)
        .command

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

export const blending = test
