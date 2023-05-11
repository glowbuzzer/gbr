/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { ACTIVITYSTATE, ARCDIRECTION, BLENDTYPE } from "../../../libs/store/src"

const test = uvu.suite("blending")

test.before.each(ctx => {
    console.log(ctx.__test__)
    gbc.reset()
    gbc.enable_operation()
})

const tag = state => state.stream[0].tag
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
    const line1 = gbc.stream.moveLine(25, 5, 0).params(moveParams).command
    const line2 = gbc.stream.moveLine(20, 25, 0).params(moveParams).command
    const end_program = gbc.stream.endProgram().command

    try {
        gbc.enqueue([line1, line2, end_program]) //
            .assert.streamSequence(tag, [
                [25, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [30, 2, ACTIVITYSTATE.ACTIVITY_COMPLETED]
            ])
            .verify()
    } finally {
        gbc.plot("test")
    }
})

test("can blend move line / move line at 50pc", () => {
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 50
    }
    const line1 = gbc.stream.moveLine(25, 5, 0).params(moveParams).command
    const line2 = gbc.stream.moveLine(20, 25, 0).params(moveParams).command
    const end_program = gbc.stream.endProgram().command

    try {
        gbc.enqueue([line1, line2, end_program]) //
            .assert.streamSequence(tag, [
                [25, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [15, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [10, 2, ACTIVITYSTATE.ACTIVITY_COMPLETED]
            ])
            .verify()
    } finally {
        gbc.plot("test")
    }
})

test("can blend move line / move arc at 100pc", () => {
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 100
    }
    const line1 = gbc.stream.moveLine(25, 0, 0).params(moveParams).command
    const line2 = gbc.stream
        .moveArc(0, 25, 0)
        .centre(0, 0, 0)
        .direction(ARCDIRECTION.ARCDIRECTION_CCW)
        .params(moveParams).command
    const end_program = gbc.stream.endProgram().command

    try {
        gbc.enqueue([line1, line2, end_program]) //
            .assert.streamSequence(tag, [
                [25, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [30, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [40, 2, ACTIVITYSTATE.ACTIVITY_COMPLETED]
            ])
            .verify()
    } finally {
        gbc.plot("test")
    }
})

test("can blend move to / move arc at 100pc", () => {
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 100
    }
    const line1 = gbc.stream.moveToPosition(25, 0, 0).params(moveParams).command
    const line2 = gbc.stream
        .moveArc(0, 25, 0)
        .centre(0, 0, 0)
        .direction(ARCDIRECTION.ARCDIRECTION_CCW)
        .params(moveParams).command
    const end_program = gbc.stream.endProgram().command

    try {
        gbc.enqueue([line1, line2, end_program]) //
            .assert.streamSequence(tag, [
                [25, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [30, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [40, 2, ACTIVITYSTATE.ACTIVITY_COMPLETED]
            ])
            .verify()
    } finally {
        gbc.plot("test")
    }
})

test("can blend move arc / move line at 100pc", () => {
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 100
    }
    const line1 = gbc.stream.moveArc(25, 25, 0).centre(25, 0, 0).params(moveParams).command
    const line2 = gbc.stream.moveLine(5, 25, 0).params(moveParams).command
    const end_program = gbc.stream.endProgram().command

    try {
        gbc.enqueue([line1, line2, end_program]) //
            .assert.streamSequence(tag, [
                [50, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [50, 2, ACTIVITYSTATE.ACTIVITY_COMPLETED]
            ])
            .verify()
    } finally {
        gbc.plot("test")
    }
})

test("can blend move arc / move to position at 100pc", () => {
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 100
    }
    const line1 = gbc.stream.moveArc(25, 25, 0).centre(25, 0, 0).params(moveParams).command
    const line2 = gbc.stream.moveToPosition(5, 25, 0).params(moveParams).command
    const end_program = gbc.stream.endProgram().command

    try {
        gbc.enqueue([line1, line2, end_program]) //
            .assert.streamSequence(
                tag,
                [
                    [40, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                    [10, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                    [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                    [25, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                    [30, 2, ACTIVITYSTATE.ACTIVITY_COMPLETED]
                ],
                true
            )
            .verify()
    } finally {
        gbc.plot("test")
    }
})

test("can blend move arc / move arc at 100pc", () => {
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 100
    }
    const arc1 = gbc.stream.moveArc(25, 25, 0).centre(25, 0, 0).params(moveParams).command
    const arc2 = gbc.stream.moveArc(0, 0, 0).centre(0, 25, 0).params(moveParams).command
    const end_program = gbc.stream.endProgram().command

    try {
        gbc.enqueue([arc1, arc2, end_program]) //
            .assert.streamSequence(tag, [
                [40, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [30, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [30, 2, ACTIVITYSTATE.ACTIVITY_COMPLETED]
            ])
            .verify()
    } finally {
        gbc.plot("test")
    }
})

test("can blend move to position / move line at 100pc", () => {
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 100
    }
    const line1 = gbc.stream.moveToPosition(25, 5, 0).params(moveParams).command
    const line2 = gbc.stream.moveLine(20, 25, 0).params(moveParams).command
    const end_program = gbc.stream.endProgram().command

    try {
        gbc.enqueue([line1, line2, end_program]) //
            .assert.streamSequence(tag, [
                [25, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [30, 2, ACTIVITYSTATE.ACTIVITY_COMPLETED]
            ])
            .verify()
    } finally {
        gbc.plot("test")
    }
})

test("can blend move to position / move to position 100pc", () => {
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 100
    }
    const line1 = gbc.stream.moveToPosition(25, 5, 0).params(moveParams).command
    const line2 = gbc.stream.moveToPosition(20, 25, 0).params(moveParams).command
    const end_program = gbc.stream.endProgram().command

    try {
        gbc.enqueue([line1, line2, end_program]) //
            .assert.streamSequence(tag, [
                [25, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [30, 2, ACTIVITYSTATE.ACTIVITY_COMPLETED]
            ])
            .verify()
    } finally {
        gbc.plot("test")
    }
})

test("can blend move line / move to position 100pc", () => {
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 100
    }
    const line1 = gbc.stream.moveLine(25, 5, 0).params(moveParams).command
    const line2 = gbc.stream.moveToPosition(20, 25, 0).params(moveParams).command
    const end_program = gbc.stream.endProgram().command

    try {
        gbc.enqueue([line1, line2, end_program]) //
            .assert.streamSequence(tag, [
                [25, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [30, 2, ACTIVITYSTATE.ACTIVITY_COMPLETED]
            ])
            .verify()
    } finally {
        gbc.plot("test")
    }
})

test("CANNOT blend move joints / move to position", () => {
    // we don't support this yet so should not be blended at all
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 100
    }
    const line1 = gbc.stream.moveJoints([25, 5, 0]).params(moveParams).command
    const line2 = gbc.stream.moveToPosition(20, 25, 0).params(moveParams).command
    const end_program = gbc.stream.endProgram().command

    try {
        gbc.enqueue([line1, line2, end_program]) //
            .assert.streamSequence(tag, [
                [25, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [20, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [40, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [30, 2, ACTIVITYSTATE.ACTIVITY_COMPLETED]
            ])
            .verify()
    } finally {
        gbc.plot("test")
    }
})

test("CANNOT blend move line / move joints", () => {
    // we don't support this yet so should not be blended at all
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 100
    }
    const line1 = gbc.stream.moveLine(25, 5, 0).params(moveParams).command
    const line2 = gbc.stream.moveJoints([20, 25, 0]).params(moveParams).command
    const end_program = gbc.stream.endProgram().command

    try {
        gbc.enqueue([line1, line2, end_program]) //
            .assert.streamSequence(tag, [
                [30, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [20, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                [40, 2, ACTIVITYSTATE.ACTIVITY_COMPLETED]
            ])
            .verify()
    } finally {
        gbc.plot("test")
    }
})

test("can handle very short move in blend sequence", async () => {
    try {
        gbc.send_gcode(
            `
                G64
                G1X4
                G1Y0.1
                G1X2
                M2`
        )
            .assert.streamSequence(
                tag,
                [
                    [7, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                    [14, 2, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE], // this should be in blend
                    [13, 3, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                    [6, 3, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                    [25, 3, ACTIVITYSTATE.ACTIVITY_COMPLETED]
                ],
                true /* set to false to skip verify */
            )
            .verify()
            .assert.near(pos(0), 2)
            .assert.near(pos(1), 0.1)
    } finally {
        gbc.plot("test")
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
                [[35, 4, ACTIVITYSTATE.ACTIVITY_COMPLETED]],
                true /* set to false to skip verify */
            )
            .verify()
            .assert.near(pos(0), 1)
            .assert.near(pos(1), 0)
    } finally {
        gbc.plot("test")
    }
})

test.skip("can handle very short arc in blend sequence", async () => {
    try {
        // gbc.disable_limit_check()
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
                    [20, 4, ACTIVITYSTATE.ACTIVITY_COMPLETED]
                ],
                true /* set to false to skip verify */
            )
            .verify()
            .assert.near(pos(0), 1)
            .assert.near(pos(1), 1)
    } finally {
        gbc.plot("test")
    }
})

export const blending = test
