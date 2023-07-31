/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { gbc } from "../../gbc"
import * as uvu from "uvu"

const test = uvu.suite("tools robot")

test.before.each(() => {})

// forward and inverse with z offset only
test("move to position then change tool", async () => {
    gbc.config().joints(6).robotKinematics().addTool(50).finalize()
    gbc.enable_operation()

    await gbc.run(api => api.moveToPosition(300, 0, 200).rotationEuler(0, Math.PI / 2, 0))
    await gbc.run(api => api.setToolOffset(1))

    gbc.assert.near(s => s.status.kc[0].position.translation.x, 350) // tool is 50mm long
    gbc.assert.near(s => s.status.kc[0].position.translation.z, 200)
})

test("change tool then move to position", async () => {
    gbc.config().joints(6).robotKinematics().addTool(100).finalize()
    gbc.enable_operation()

    await gbc.run(api => api.setToolOffset(1))
    await gbc.run(api => api.moveToPosition(300, 0, 50).rotationEuler(0, Math.PI, 0))

    gbc.assert.near(s => s.status.kc[0].position.translation.x, 300)
    gbc.assert.near(s => s.status.kc[0].position.translation.z, 50)
})

// forward and inverse with z and x offsets
test("move to position then change tool - tool offset in x", async () => {
    gbc.config().joints(6).robotKinematics().addTool(100, 20).finalize()
    gbc.enable_operation()

    await gbc.run(api => api.moveToPosition(300, 0, 200).rotationEuler(0, Math.PI, 0))
    await gbc.run(api => api.setToolOffset(1))

    gbc.assert.near(s => s.status.kc[0].position.translation.x, 280) // tool is 20 in X, but robot is pointing down, so -X
    gbc.assert.near(s => s.status.kc[0].position.translation.z, 100)
})

test("change tool then move to position - tool offset in x", async () => {
    gbc.config().joints(6).robotKinematics().addTool(100, 20).finalize()
    gbc.enable_operation()

    await gbc.run(api => api.setToolOffset(1))
    await gbc.run(api => api.moveToPosition(300, 0, 200).rotationEuler(0, Math.PI / 2, 0))

    gbc.assert.near(s => s.status.kc[0].position.translation.x, 300)
    gbc.assert.near(s => s.status.kc[0].position.translation.z, 200)
})

// forward and inverse including tool rotation
test("move to position then change tool - tool offset in x and rotated", async () => {
    gbc.config()
        .joints(6)
        .robotKinematics()
        .addTool(100, 20, { x: 0, y: 0, z: 1, w: 0 }) // 180 degree rotation in Z
        .finalize()
    gbc.enable_operation()

    await gbc.run(api => api.moveToPosition(300, 0, 200).rotationEuler(0, Math.PI, 0))
    await gbc.run(api => api.setToolOffset(1))

    // tool is 20 in -X (rotated 180)
    // robot is pointing down, so robot's X is also -ve
    // together they are +ve, so when we are at 300, and add the tool offset, we should be at 320
    gbc.assert.near(s => s.status.kc[0].position.translation.x, 280)
    gbc.assert.near(s => s.status.kc[0].position.translation.z, 100)
})

test("change tool then move to position - tool offset in x and rotated", async () => {
    gbc.config()
        .joints(6)
        .robotKinematics()
        .addTool(0, 5, {
            x: 0,
            y: 0,
            z: 1,
            w: 0
        }) // 180 degree rotation in Z
        .finalize()
    gbc.enable_operation()

    await gbc.run(api => api.setToolOffset(1))
    await gbc.run(api => api.moveToPosition(300, 0, 0) /*.rotationEuler(0, Math.PI, 0)*/)

    gbc.assert.near(s => s.status.kc[0].position.translation.x, 300)
    gbc.assert.near(s => s.status.kc[0].position.translation.z, 0)
})

test.skip("change tool then move to position followed by move line", async () => {
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
