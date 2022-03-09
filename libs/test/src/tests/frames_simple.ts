import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { assertNear } from "../util"

const test = uvu.suite("frames simple")

const tag = state => state.stream.tag

const INITIAL_CONFIG = 1

const px = state => state.status.kc[0].cartesianActPos.x
const py = state => state.status.kc[0].cartesianActPos.y
const pz = state => state.status.kc[0].cartesianActPos.z

const aw = state => state.status.kc[0].cartesianActOrientation.w
const ax = state => state.status.kc[0].cartesianActOrientation.x
const ay = state => state.status.kc[0].cartesianActOrientation.y
const az = state => state.status.kc[0].cartesianActOrientation.z

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
    gbc.capture()
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
        // default frame index is zero
        const move = gbc.wrap(
            gbc.activity
                .moveToPosition(30, 10, 0)
                // world frame index
                .frameIndex(1).promise
        )
        await move.start().iterations(75).assertCompleted()
        assertNear(20, 10, 0, 0, 0, 0)
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
        assertNear(10, 0, -10, 0, 0, 0)
    } finally {
        gbc.plot("test")
    }
})

test("move_arc in rotated frame (local xy-plane)", async () => {
    try {
        // kc frame index is zero: start position is 10,10,0 local
        const move = gbc.wrap(
            // world frame index
            gbc.activity
                // we want to end up at 0,10 in target frame, so we have a nice neat arc
                // but frame 3 is rotated 90deg in X, so we are at z=10 at the start and want to stay there
                .moveArc(0, 10, null)
                .radius(10)
                .frameIndex(3).promise
        )
        move.start().iterations(50)
        // move start is 10 in y (kc frame), and arc is in xy (target frame) but this is rotated 90 around x,
        // so arc runs xz in kc frame
        gbc.assert.near(py, 10)
        await move.iterations(50).assertCompleted()

        assertNear(0, 10, -10, 0, 0, 0)
    } finally {
        gbc.plot("test")
    }
})

test("move_line in rotated frame", async () => {
    try {
        // default frame index is zero
        const move = gbc.wrap(
            // world frame index
            gbc.activity
                // we start at 10,0,10 in target frame and want to end up at
                // 0,10,10 in target frame, which is 0,10,-10 in local
                .moveLine(0, 10, 0)
                .frameIndex(3).promise
        )
        await move.start().iterations(100).assertCompleted()
        assertNear(0, 0, -10, 0, 0, 0)
    } finally {
        gbc.plot("test")
    }
})

export const frames_simple = test
