/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import { gbc } from "../../gbc"

const test = uvu.suite("config_load")

test("can load some config", async () => {
    const builder = gbc.config().joints(1).cartesianKinematics()

    builder.finalize()
    await gbc.enable_operation()
})

// we no longer reset joint position after config load, because it was causing issues with the auto joint setting by kc code (robot DH joint offsets)
test.skip("can load some config, move the robot and load new config without resetting joint position", async () => {
    // the idea here is to load a config, move the robot, load a new config and check that the joint position is not reset

    const builder = gbc.config().joints(3).cartesianKinematics()
    builder.finalize()
    await gbc.enable_operation()
    gbc.disable_limit_check() // otherwise we get instantaneous change in joint pos

    await gbc
        .wrap(gbc.activity.moveJoints([1]).promise)
        .start()
        .iterations(20)
        .assertCompleted()

    gbc.assert.near(s => s.status.joint[0].actPos, 1)

    builder.addFrame({
        name: "test"
    })

    builder.finalize(true)

    gbc.assert.near(s => s.status.joint[0].actPos, 1)
})

export const config_load = test
