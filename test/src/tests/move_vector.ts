/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { assertNear, do_cancel } from "../util"

const test = uvu.suite("activity")

test.before.each(ctx => {
    gbc.config()
        .joints(3)
        // frame 0 is the world frame
        .addFrame({
            // this is frame 1
            rotation: { x: 1, y: 0, z: 0, w: 0 }
        })
        .addFrame({
            // this is frame 2
            rotation: { x: 0.7071068, y: 0, z: 0, w: 0.7071068 }
        })
        .cartesianKinematics(1)
        .finalize()

    gbc.enable_operation()
})

test("will move in correct direction in world when target frame given", async () => {
    await gbc
        .wrap(gbc.activity.moveVectorAtVelocity(0, 0, 1).frameIndex(0).promise)
        .start()
        .iterations(20)
        .assertNotResolved()
    // we are moving in the positive z direction in the world frame, which is negative in local due to KC frame rotation
    gbc.assert.lt(s => s.status.kc[0].position.translation.z, 0)
})

test("will move in correct direction in another frame", async () => {
    await gbc
        .wrap(gbc.activity.moveVectorAtVelocity(0, 0, 1).frameIndex(2).promise)
        .start()
        .iterations(20)
        .assertNotResolved()
    // frame 2 is rotated 90 in X, so Z is negative Y in world, which is positive Y in local
    gbc.assert.gt(s => s.status.kc[0].position.translation.y, 0)
})

export const move_vector = test
