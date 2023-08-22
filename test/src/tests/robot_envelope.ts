/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { OPERATION_ERROR } from "../../../libs/store/src"
import * as assert from "uvu/assert"

const test = uvu.suite("robot envelope validation")

function init_test() {
    gbc.disable_limit_check()

    gbc.config()
        .joints(6)
        .robotKinematics()
        .limitZ(90, 500)
        .cylindricalEnvelope(150, 250)
        .sphericalEnvelope(0 /* not set */, 400)
        .finalize()

    gbc.disable_limit_check()

    // we can't start the robot at a singularity, and we want config to not be zero
    gbc.set_joint_pos(0, 0)
    gbc.set_joint_pos(1, 0)
    gbc.set_joint_pos(2, Math.PI / 2)
    gbc.set_joint_pos(3, (-3 * Math.PI) / 4)
    gbc.set_joint_pos(4, Math.PI / 2)
    gbc.set_joint_pos(5, Math.PI)

    gbc.enable_operation()
    gbc.enable_limit_check()
}

test.before.each(() => {
    init_test()
})

async function expect_err(promise) {
    try {
        await promise
    } catch (e) {
        assert.equal(
            e.code,
            OPERATION_ERROR.OPERATION_ERROR_KINEMATICS_ENVELOPE_VIOLATION,
            "Expected envelope violation"
        )
        return
    }
    // don't want to get here
    assert.ok(false, "Expected envelope violation")
}

test("can move robot within the envelope without error", async () => {
    await gbc.run(api => api.moveLine(200, 0, 100).rotation(1, 0, 0, 0))
})

test("cannot move robot WCP below limit in Z", async () => {
    await gbc.run(api => api.moveLine(200, 0, 100).rotation(1, 0, 0, 0))
    // here the WCP is below min Z
    await expect_err(gbc.run(api => api.moveLine(200, 0, 100).rotation(0.1, 0, 0, 0.95)))
})

test("cannot move robot inside the inner cylindrical radius", async () => {
    await expect_err(gbc.run(api => api.moveLine(149, 0, 100).rotation(1, 0, 0, 0)))
})

test("cannot move robot beyond the outer cylindricalradius", async () => {
    await expect_err(gbc.run(api => api.moveLine(251, 0, 100).rotation(1, 0, 0, 0)))
})

test("cannot move robot beyond the outer spherical radius", async () => {
    await expect_err(gbc.run(api => api.moveLine(350, 0, 100).rotation(1, 0, 0, 0)))
})

test("cannot move robot WCP below limit in Z - joint space", async () => {
    await expect_err(gbc.run(api => api.moveToPosition(200, 0, 10).rotation(1, 0, 0, 0)))
})

test("cannot move robot inside the inner cylindrical radius - joint space", async () => {
    await expect_err(gbc.run(api => api.moveToPosition(149, 0, 100).rotation(1, 0, 0, 0)))
})

test("cannot move robot beyond the outer cylindricalradius - joint space", async () => {
    await expect_err(gbc.run(api => api.moveToPosition(251, 0, 100).rotation(1, 0, 0, 0)))
})

test("cannot move robot beyond the outer spherical radius - joint space", async () => {
    await expect_err(gbc.run(api => api.moveToPosition(350, 0, 100).rotation(1, 0, 0, 0)))
})

export const robot_envelope = test
