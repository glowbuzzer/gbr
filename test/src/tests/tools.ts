/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { assertNear } from "../util"

const test = uvu.suite("tools")

// const tag = state => state.stream.tag

// raw joint pos
const joint = joint => state => state.status.joint[joint].actPos

// kc pos
const px = state => state.status.kc[0].position.translation.x
const py = state => state.status.kc[0].position.translation.y
const pz = state => state.status.kc[0].position.translation.z

/**
 * These tests check tool frame handling
 */

test.before.each(() => {
    // gbc.reset("configs/tools.json")

    gbc.config()
        .joints(3)
        .cartesianKinematics()
        .addTool(10)
        .addFrame({
            translation: {
                x: 0,
                y: 0,
                z: 5
            }
        })
        .finalize()
    gbc.enable_operation()
    gbc.enable_limit_check()
})

test("initial kc position is zero (no tool selected)", async () => {
    assertNear(0, 0, 0, 0, 0, 0)
})

test("move before tool change ends up at same kc and joint positions", async () => {
    // note that
    const move = gbc.wrap(gbc.activity.moveToPosition(10, 10, 0).promise)
    await move.start().iterations(50).assertCompleted()

    gbc.assert.near(px, 10)
    gbc.assert.near(py, 10)
    gbc.assert.near(pz, 0)

    gbc.assert.near(joint(0), 10)
    gbc.assert.near(joint(1), 10)
    gbc.assert.near(joint(2), 0)
})

test("can issue tool change command", async () => {
    const change = gbc.wrap(gbc.activity.setToolOffset(1).promise)
    await change.start().iterations(3).assertCompleted()
})

test("after tool change cartesian position is modified", async () => {
    const change = gbc.wrap(gbc.activity.setToolOffset(1).promise)
    await change.start().iterations(3).assertCompleted()

    gbc.assert.near(px, 0)
    gbc.assert.near(py, 0)
    gbc.assert.near(pz, 10)
})

// this test doesn't work because sender adapter no longer issues a tool change command
// test.only("after tool change cartesian position is modified (gcode version)", async () => {
//     gbc.send_gcode("G43 H1\nM2")
//     gbc.exec(3)
//
//     gbc.assert.near(px, 0)
//     gbc.assert.near(py, 0)
//     gbc.assert.near(pz, 10)
// })

test("can do a move line after tool change", async () => {
    await gbc.wrap(gbc.activity.setToolOffset(1).promise).start().iterations(3).assertCompleted()
    gbc.assert.near(pz, 10)

    await gbc
        .wrap(gbc.activity.moveLine(0, 0, 10).promise)
        .start()
        .iterations(100)
        .assertCompleted()

    gbc.assert.near(pz, 10)
    gbc.assert.near(joint(2), 0)
})

test("can do a move line after tool change (in translated frame)", async () => {
    await gbc.wrap(gbc.activity.setToolOffset(1).promise).start().iterations(3).assertCompleted()
    gbc.assert.near(pz, 10)

    await gbc
        .wrap(gbc.activity.moveLine(0, 0, 5).frameIndex(1).promise)
        .start()
        .iterations(50)
        .assertCompleted()

    gbc.assert.near(pz, 10)

    gbc.assert.near(joint(2), 0)
})

test("can do a move line after tool change (in rotated frame)", async () => {
    gbc.config()
        .joints(3)
        .addFrame({
            rotation: {
                x: 1,
                y: 0,
                z: 0,
                w: 0
            }
        })
        .cartesianKinematics(1)
        .addTool(10)
        .finalize()
    gbc.enable_operation()
    gbc.enable_limit_check()

    await gbc.run(api => api.setToolOffset(1))
    gbc.assert.near(pz, 10)

    await gbc.run(api => api.moveLine(0, 0, 20))
    gbc.assert.near(pz, 20)
    gbc.assert.near(joint(2), 10)

    await gbc.run(api => api.moveLine(0, 0, 20).frameIndex(0 /* world */))
    gbc.assert.near(pz, -20)

    gbc.assert.near(joint(2), -30)
})

test("change tool then move to position - tool rotated", async () => {
    gbc.config()
        .joints(6)
        .cartesianKinematics()
        .addTool(0, 5, {
            x: 0,
            y: 0,
            z: 1,
            w: 0
        }) // 180 degree rotation in Z
        .finalize()
    gbc.enable_operation()

    // In this first scenario we move to a position, but don't specify the rotation,
    // so the current rotation is used. Because the tool is rotated 180 in Z, the
    // current position is pointing in the -X direction. Because of this we expect
    // the joint to be at 105 (100 + 5)
    await gbc.run(api => api.setToolOffset(1))
    gbc.assert.near(s => {
        console.log("q1", s.status.kc[0].position.rotation)
        return s.status.kc[0].position.translation.x
    }, 5)

    await gbc.run(api => api.moveToPosition(100, 0, 0))

    // tool is offset by 5 but also rotated 180 in Z, so joint should be at 305
    gbc.assert.near(joint(0), 95)

    gbc.assert.near(s => {
        console.log("q2", s.status.kc[0].position.rotation)
        return s.status.kc[0].position.translation.x
    }, 100)
    gbc.assert.near(s => s.status.kc[0].position.translation.z, 0)
})

test("can do a move line after tool change (in rotated frame - case 2)", async () => {
    gbc.config()
        .joints(3)
        .addFrame({
            rotation: {
                x: 1,
                y: 0,
                z: 0,
                w: 0
            }
        })
        .cartesianKinematics(1)
        .addTool(50)
        .finalize()
    gbc.enable_operation()
    gbc.enable_limit_check()

    await gbc
        .wrap(gbc.activity.moveLine(0, 0, 20).frameIndex(0 /* world */).promise)
        .start()
        .iterations(100)
        .assertCompleted()
    gbc.assert.near(pz, -20)
    gbc.assert.near(joint(2), -20)

    await gbc.wrap(gbc.activity.setToolOffset(1).promise).start().iterations(3).assertCompleted()
    gbc.assert.near(pz, 30)

    await gbc
        .wrap(gbc.activity.moveLine(0, 0, 20).frameIndex(0 /* world */).promise)
        .start()
        .iterations(100)
        .assertCompleted()
    gbc.assert.near(pz, -20)

    gbc.assert.near(joint(2), -70)
})

test("can move then change tool and perform another move without joint discontinuity", async () => {
    try {
        await gbc
            .wrap(gbc.activity.moveToPosition(0, 0, 20).promise) // safe Z
            .start()
            .iterations(55)
            .assertCompleted()

        gbc.assert.near(joint(0), 0)
        gbc.assert.near(joint(1), 0)
        gbc.assert.near(joint(2), 20)

        await gbc
            .wrap(gbc.activity.setToolOffset(1).promise)
            .start()
            .iterations(10) // just so we can see in plot where we are
            .assertCompleted()

        await gbc
            .wrap(gbc.activity.moveLine(0, 0, 0).promise) // material
            .start()
            .iterations(75)
            .assertCompleted()

        gbc.assert.near(px, 0)
        gbc.assert.near(py, 0)
        gbc.assert.near(pz, 0)

        gbc.assert.near(joint(0), 0)
        gbc.assert.near(joint(1), 0)
        gbc.assert.near(joint(2), -10)
    } finally {
        gbc.plot("test")
    }
})

export const tools = test
