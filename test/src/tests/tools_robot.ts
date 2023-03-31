/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { gbc } from "../../gbc"
import * as uvu from "uvu"

const test = uvu.suite("tools robot")

test.before.each(() => {
    gbc.config().joints(6).robotKinematics().addTool(100).finalize()
    gbc.enable_operation()
})

test("move to position then change tool", async () => {
    const move = gbc.wrap(
        gbc.activity.moveToPosition(300, 0, 200).rotationEuler(0, Math.PI / 2, 0).promise
    )
    await move.start().iterations(25).assertCompleted()

    await gbc.wrap(gbc.activity.setToolOffset(1).promise).start().iterations(3).assertCompleted()

    gbc.assert.near(s => s.status.kc[0].position.translation.x, 400) // tool is 100mm long
    gbc.assert.near(s => s.status.kc[0].position.translation.z, 200)
})

test("change tool then move to position followed by move line", async () => {
    await gbc.wrap(gbc.activity.setToolOffset(1).promise).start().iterations(3).assertCompleted()

    // gbc.disable_limit_check()

    try {
        await gbc
            .wrap(
                gbc.activity.moveToPosition(300, 100, 250).rotationEuler(Math.PI / 2, 0, 0).promise
            )
            .start()
            .iterations(35)
            .assertCompleted()

        await gbc
            .wrap(
                gbc.activity.moveLine(200, 0, 300).promise
                // .centre(300, 0, 200)
                // .direction(ARCDIRECTION.ARCDIRECTION_CCW)
                // .rotationEuler(0, Math.PI / 2, 0).promise
            )
            .start()
            .iterations(100)
            .assertCompleted()
    } finally {
        gbc.plot("test")
    }
})

export const tools_robot = test
