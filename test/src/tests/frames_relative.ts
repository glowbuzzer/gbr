/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { assertNear } from "../util"

const test = uvu.suite("frames relative")

// const px = state => state.status.kc[0].position.translation.x
// const py = state => state.status.kc[0].position.translation.y
// const pz = state => state.status.kc[0].position.translation.z

/**
 * These tests check that relative frame handling works correctly
 */

test.before.each(() => {
    gbc.reset("configs/frames_relative.json")

    // gbc.disable_limit_check()
    //
    // // move machine away from origin
    // gbc.set_joint_pos(0, 10)
    // gbc.set_joint_pos(1, 10)
    // gbc.set_joint_pos(2, 0)

    gbc.enable_operation()
    // gbc.enable_limit_check()
})

test("initial kc local position", async () => {
    assertNear(0, 0, 0, 0, 0, 0)
})

test("move_to_position in kc world coords", async () => {
    try {
        const move = gbc.wrap(
            // same frame index as robot
            gbc.activity.moveToPosition(10, 0, 0).frameIndex(0).promise
        )
        await move.start().iterations(100).assertCompleted()
        assertNear(-10, 0, 0, 0, 0, 0)
    } finally {
        gbc.plot("test")
    }
})

export const frames_relative = test
