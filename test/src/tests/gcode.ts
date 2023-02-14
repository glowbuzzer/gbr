/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { ACTIVITYSTATE, STREAMSTATE } from "../../../libs/store/src"

const test = uvu.suite("gcode")

const state = state => state.stream[0].state
const tag = state => state.stream[0].tag
const pos = joint => state => state.status.joint[joint].actPos

test.before.each(ctx => {
    console.log(ctx.__test__)
    gbc.reset()
    gbc.enable_operation()
})

test("can execute basic gcode", async () => {
    gbc.send_gcode("G0 X1 Y1\nM2")
    gbc.exec(3)
    gbc.assert.selector(state, STREAMSTATE.STREAMSTATE_ACTIVE)
    gbc.exec(20)
    gbc.assert
        .selector(state, STREAMSTATE.STREAMSTATE_IDLE)
        .assert.near(pos(0), 1)
        .assert.near(pos(1), 1)
})

test("can execute arc with centre gcode", async () => {
    gbc.send_gcode("G2 X1 Y1 I1 J0\nM2")
    gbc.exec(3)
    gbc.assert.selector(state, STREAMSTATE.STREAMSTATE_ACTIVE)
    gbc.exec(25)
    gbc.assert
        .selector(state, STREAMSTATE.STREAMSTATE_IDLE, "stream state not idle")
        .assert.near(pos(0), 1)
        .assert.near(pos(1), 1)
})

test("can execute arc with radius gcode", async () => {
    gbc.send_gcode("G3 X1 Y1 R1\nM2")
    gbc.exec(3)
    gbc.assert.selector(state, STREAMSTATE.STREAMSTATE_ACTIVE)
    gbc.exec(25)
    gbc.assert
        .selector(state, STREAMSTATE.STREAMSTATE_IDLE, "stream state not idle")
        .assert.near(pos(0), 1)
        .assert.near(pos(1), 1)
})

test("can handle null initial positions", async () => {
    // this test relies on initial positions being 'null', ie. NaN
    gbc.send_gcode(`
        G0 X1
        M2`)
    gbc.exec(25)
    gbc.assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)
    gbc.assert.near(pos(0), 1)
    gbc.assert.near(pos(1), 0)
})

test("can handle null initial positions with frame translation", async () => {
    // this test relies on initial positions being 'null', ie. NaN
    try {
        gbc.assert.near(pos(0), 0)
        gbc.assert.near(pos(1), 0)
        gbc.assert.near(pos(2), 0)
        gbc.send_gcode(`
            G55
            G0 X2
            M2`)
        gbc.exec(30)
        gbc.assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)
        gbc.assert.near(pos(0), 3)
        gbc.assert.near(pos(1), 0)
        gbc.assert.near(pos(2), 0)
    } finally {
        gbc.plot("null-initial-position-with-frame")
    }
})

test("can execute relative move to position", async () => {
    gbc.send_gcode(`
        G0 X1 Y1
        M2`)
    gbc.exec(25)
    gbc.assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)
    gbc.assert.near(pos(0), 1)
    gbc.assert.near(pos(1), 1)

    // send a relative move
    gbc.send_gcode(`
        G91
        G0 X1 Y1
        M2`)
    gbc.exec(25)
    gbc.assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)
    gbc.assert.near(pos(0), 2)
    gbc.assert.near(pos(1), 2)
})

test("doesn't blend rapid to line", async () => {
    try {
        gbc.send_gcode(
            `
                G64
                G0 X10 Y0
                G1 X10 Y10
                M2`
        )
            .assert.streamSequence(
                tag,
                [
                    [5, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                    [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE], // this would be in blend
                    [20, 3, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                    [45, 0, ACTIVITYSTATE.ACTIVITY_INACTIVE]
                ],
                true /* set to false to skip verify */
            )
            .verify()
    } finally {
        gbc.plot("gcode-g0-to-g1")
    }
})

test("doesn't blend line to rapid", async () => {
    try {
        gbc.send_gcode(
            `
                G64
                G1 X10 Y0
                G0 X10 Y10
                M2`
        )
            .assert.streamSequence(
                tag,
                [
                    [5, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                    [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE], // this would be in blend
                    [20, 3, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                    [45, 0, ACTIVITYSTATE.ACTIVITY_INACTIVE]
                ],
                true /* set to false to skip verify */
            )
            .verify()
    } finally {
        gbc.plot("gcode-g1-to-g0")
    }
})

test("can handle F code on G1 move", async () => {
    try {
        gbc.send_gcode(`
            G1 X30 Y0 F150
            M2`)
        gbc.exec(30)
        gbc.assert.vel(0, 150)
        gbc.exec(45)
        gbc.verify()
    } finally {
        gbc.plot("gcode-g1-with-feedrate")
    }
})

test("can handle F code as modal", async () => {
    try {
        gbc.send_gcode(`
            F150
            G1 X30
            G1 X60
            M2`)
        gbc.exec(30)
        gbc.assert.vel(0, 150)
        gbc.exec(45)
        gbc.exec(30)
        gbc.assert.vel(0, 150)
        gbc.exec(45)
        gbc.verify()
    } finally {
        // gbc.plot("gcode-g1-with-feedrate")
    }
})

test("F code modal doesn't affect G0", async () => {
    try {
        gbc.send_gcode(`
            G1 X30 F150
            G0 X60
            M2`)
        gbc.exec(30)
        gbc.assert.vel(0, 150)
        gbc.exec(45)
        gbc.exec(30)
        gbc.assert.vel(0, 200)
        gbc.exec(30)
        gbc.verify()
    } finally {
        // gbc.plot("gcode-g1-with-feedrate")
    }
})

// this test doesn't work any more because rapids use linear move and ignore F code (use rapid limit profile)
// test.only("F code on G0 doesn't affect G1", async () => {
//     try {
//         gbc.send_gcode(`
//             G0 X30 F150
//             G1 X60 ; reverts to vmax
//             M2`)
//         gbc.exec(30)
//         gbc.assert.vel(0, 150)
//         gbc.exec(45)
//         gbc.exec(30)
//         gbc.assert.vel(0, 200)
//         gbc.exec(30)
//         gbc.verify()
//     } finally {
//         // gbc.plot("gcode-g1-with-feedrate")
//     }
// })

export const gcode = test
