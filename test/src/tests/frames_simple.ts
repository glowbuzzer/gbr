/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { assertNear, do_cancel } from "../util"

const test = uvu.suite("frames simple")

const px = state => state.status.kc[0].position.translation.x
const py = state => state.status.kc[0].position.translation.y
const pz = state => state.status.kc[0].position.translation.z

/**
 * These tests check that frame handling for moves is working properly
 */

test.before.each(() => {
    gbc.config()
        .joints(3)
        .cartesianKinematics()
        // there is always a default empty frame at position 0
        .addFrame({
            translation: {
                x: 10
            }
        })
        .addFrame({
            translation: {
                x: 10
            },
            rotation: {
                x: 0.7071068,
                y: 0,
                z: 0,
                w: 0.7071068
            }
        })
        .addFrame({
            rotation: {
                x: 0.7071068,
                y: 0,
                z: 0,
                w: 0.7071068
            }
        })
        .addFrame({
            translation: {
                z: 325
            },
            rotation: {
                x: 0.7071068,
                y: 0,
                z: 0,
                w: 0.7071068
            }
        })
        .finalize()

    gbc.enable_operation()

    // move machine away from origin
    gbc.set_joints(10, 10, 0)
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
        await gbc.run(api =>
            api
                .moveToPosition(20, 10, 0)
                // frame index with translation and rotation (90 deg around X)
                .frameIndex(2)
        )
        assertNear(30, 0, 10, 0, 0, 0)
    } finally {
        gbc.plot("test")
    }
})

test("move_line in rotated frame", async () => {
    try {
        // kc frame index is zero (no translation)
        assertNear(10, 10, 0, 0, 0, 0)
        await gbc.run(api =>
            // frame 3 is rotated 90 around X
            // we start at 10,0,10 in target frame and want to end up at
            // 0,10,0 in target frame, which is 0,0,10 in kc local
            api.moveLine(0, 10, 0).frameIndex(3)
        )
        assertNear(0, 0, 10, 0, 0, 0)
    } finally {
        gbc.plot("test")
    }
})

test("move vector at velocity in rotated frame", async () => {
    try {
        // fro change causes high jerk
        gbc.enable_limit_check(3)
        // kc frame index is zero (no translation)
        assertNear(10, 10, 0, 0, 0, 0)
        // gbc.disable_limit_check()
        const move = gbc.wrap(
            gbc.activity
                // frame 3 is rotated 90 around X,
                // so a move in Y in local frame is a move in -Z in default (world) frame
                .moveVectorAtVelocity(0, 1, 0)
                .frameIndex(3).promise
        )
        await do_cancel(move, 1, 50)

        gbc.assert.near(px, 10, 0.01)
        gbc.assert.near(py, 10, 0.01)
        gbc.assert.near(pz, 8.41, 0.01)
    } finally {
        gbc.plot("test")
    }
})

export const frames_simple = test
