/*
 * Copyright (c) 2022-2023. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { assertNear, do_cancel } from "../util"
import { SoloActivityApi, STREAMSTATE } from "../../../@glowbuzzer/store"

const test = uvu.suite("frames kc rotated")

const j1 = state => state.status.joint[0].actPos

/**
 * These tests check that frame handling for moves is working properly
 */

test.before.each(() => {
    gbc.reset("configs/frames_kc_rotated.json")

    gbc.disable_limit_check()

    // move machine away from origin
    gbc.set_joint_pos(0, 5)
    gbc.set_joint_pos(1, 0)
    gbc.set_joint_pos(2, 0)

    gbc.enable_operation()
    gbc.enable_limit_check()
})

test.only("move to position for kc rotated 180 in z", async () => {
    try {
        const move = gbc.wrap(gbc.activity.moveToPosition(2, 2, 0).frameIndex(0).promise)
        await move.start().iterations(175).assertCompleted()
        // kc is rotated 180 in z, so j1 should be -20
        gbc.assert.near(j1, 2)
    } finally {
        gbc.plot("test")
    }
})

export const frames_kc_rotated = test
