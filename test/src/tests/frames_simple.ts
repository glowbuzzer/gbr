import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { assertNear } from "../util"
import { STREAMSTATE } from "../../../libs/store/src"

const test = uvu.suite("frames simple")

const py = state => state.status.kc[0].position.translation.y

/**
 * These tests check that frame handling for moves is working properly
 */

test.before.each(() => {
    gbc.reset("configs/frames_simple.json")

    gbc.disable_limit_check()

    // move machine away from origin
    gbc.set_joint_pos(0, 10)
    gbc.set_joint_pos(1, 10)
    gbc.set_joint_pos(2, 0)

    gbc.enable_operation()
    gbc.enable_limit_check()
})

test("initial kc local position from joint angles is not rotated", async () => {
    assertNear(10, 10, 0, 0, 0, 0)
})

test("move_to_position in kc local coords", async () => {
    try {
        const move = gbc.wrap(
            // same frame index as robot
            gbc.activity.moveToPosition(20, 10, 0).promise
        )
        await move.start().iterations(50).assertCompleted()
        assertNear(20, 10, 0, 0, 0, 0)
    } finally {
        gbc.plot("test")
    }
})

test("move_to_position with different frame index (translation only)", async () => {
    try {
        // kc frame index is zero (no translation/rotation)
        const move = gbc.wrap(
            gbc.activity
                .moveToPosition(30, 10, 0)
                // frame 1 is translated +10 in X
                .frameIndex(1).promise
        )
        await move.start().iterations(75).assertCompleted()
        // assertion test is in kc local coords
        assertNear(40, 10, 0, 0, 0, 0)
    } finally {
        gbc.plot("test")
    }
})

test("move_to_position with different frame index (translation and rotation)", async () => {
    try {
        // default frame index is zero
        const move = gbc.wrap(
            gbc.activity
                .moveToPosition(20, 10, 0)
                // frame index with translation and rotation
                .frameIndex(2).promise
        )
        await move.start().iterations(75).assertCompleted()
        assertNear(30, 0, 10, 0, 0, 0)
    } finally {
        gbc.plot("test")
    }
})

test("move_arc in rotated frame (local xy-plane)", async () => {
    try {
        // kc frame index is zero (no translation): start position is 10,10,0 kc local
        assertNear(10, 10, 0, 0, 0, 0)
        const move = gbc.wrap(
            gbc.activity
                // we want to end up at 0,10 in target frame
                // frame 3 is rotated 90deg in X
                // so we are at 10,0,-10 in target frame
                .moveArc(0, 10, null)
                .radius(10)
                .frameIndex(3).promise
        )
        // run roughly half of the arc
        move.start().iterations(50)
        // move start is 10 in y (kc frame)
        // arc is in xy (target frame) and this is rotated 90 around x,
        // so arc runs xz in kc frame and y doesn't change
        gbc.assert.near(py, 10)
        // run rest of arc
        await move.iterations(50).assertCompleted()

        assertNear(0, 10, 10, 0, 0, 0)
    } finally {
        gbc.plot("test")
    }
})

test("move_arc using gcode in rotated frame", async () => {
    const state = state => state.stream.state
    const pos = joint => state => state.status.joint[joint].actPos

    try {
        gbc.send_gcode(`
        g57
        g1 x30 y0 z20
        g2 i-30 x0 y-30
        m2`)
        gbc.exec(160)
        gbc.assert
            .selector(state, STREAMSTATE.STREAMSTATE_IDLE, "stream state not idle")
            .assert.near(pos(0), 0)
            .assert.near(pos(1), -20)
            .assert.near(pos(2), -30)
    } finally {
        gbc.plot("test")
    }
})

test("move_line in rotated frame", async () => {
    try {
        // kc frame index is zero (no translation)
        assertNear(10, 10, 0, 0, 0, 0)
        const move = gbc.wrap(
            gbc.activity
                // frame 3 is rotated 90 around X
                // we start at 10,0,10 in target frame and want to end up at
                // 0,10,0 in target frame, which is 0,0,10 in kc local
                .moveLine(0, 10, 0)
                .frameIndex(3).promise
        )
        await move.start().iterations(100).assertCompleted()
        assertNear(0, 0, 10, 0, 0, 0)
    } finally {
        gbc.plot("test")
    }
})

export const frames_simple = test