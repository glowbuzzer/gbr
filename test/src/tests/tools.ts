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
    gbc.reset("configs/tools.json")

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
    gbc.assert.near(pz, -10)
})

test("after tool change cartesian position is modified (gcode version)", async () => {
    gbc.send_gcode("G43 H1\nM2")
    gbc.exec(3)

    gbc.assert.near(px, 0)
    gbc.assert.near(py, 0)
    gbc.assert.near(pz, -10)
})

test("can move then change tool and perform another move without joint discontinuity", async () => {
    try {
        gbc.disable_limit_check()

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
            .wrap(gbc.activity.moveToPosition(0, 0, 0).promise) // material
            .start()
            .iterations(45)
            .assertCompleted()

        gbc.assert.near(px, 0)
        gbc.assert.near(py, 0)
        gbc.assert.near(pz, 0)

        gbc.assert.near(joint(0), 0)
        gbc.assert.near(joint(1), 0)
        gbc.assert.near(joint(2), 10)
    } finally {
        gbc.plot("test")
    }
})

export const tools = test
