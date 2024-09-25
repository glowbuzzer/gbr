/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { assertNear } from "../util"

const test = uvu.suite("frames alt")

test.before.each(() => {
    // gbc.reset("configs/frames_alt.json")

    gbc.config()
        .joints(3, {
            vmax: 200,
            amax: 4000,
            jmax: 80000
        })
        .addFrame({
            translation: {
                x: 10
            }
        })
        .cartesianKinematics(1, {
            vmax: 200,
            amax: 4000,
            jmax: 80000
        })
        .finalize()

    // gbc.disable_limit_check()
    //
    // // move machine away from origin
    // gbc.set_joint_pos(0, 10)
    // gbc.set_joint_pos(1, 10)
    // gbc.set_joint_pos(2, 0)
    //
    gbc.enable_operation()
})

test("move_line with simple translation", async () => {
    // shouldn't really go anywhere because we are already at 10,0,0 in robot (kc) frame
    const move = gbc.wrap(gbc.activity.moveLine(10, 0, 0).frameIndex(0).promise)
    await move.start().iterations(10).assertCompleted()
    assertNear(0, 0, 0, 0, 0, 0)
})

test("move_to_position with simple translation", async () => {
    const move = gbc.wrap(gbc.activity.moveToPosition(15, 0, 0).frameIndex(0).promise)
    await move.start().iterations(50).assertCompleted()
    assertNear(5, 0, 0, 0, 0, 0)
})

export const frames_alt = test
