/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import * as assert from "uvu/assert"
import { gbc } from "../../gbc"

const test = uvu.suite("robot kin angles")

test.before.each(() => {
    gbc.reset("configs/tx40_config.json", {})
})

test("inverse kinematics should not return values outside -pi, pi", async () => {
    gbc.enable_operation()

    const move = gbc.wrap(
        gbc.activity.moveToPosition(300, -100, 300).rotationEuler(-90, 0, 0).promise
    )
    await move.start().iterations(100).assertCompleted()

    const joints = gbc.status.joint.map(j => j.actPos)
    assert.ok(
        joints.every(j => j >= -Math.PI && j <= Math.PI),
        "joint angles are not within -pi, pi, joints: " + joints
    )
})

test("joint should follow the shortest distance between two points", async () => {
    gbc.enable_operation()

    const move1 = gbc.wrap(
        gbc.activity.moveToPosition(300, -100, 300).rotationEuler(-90, 0, 0).promise
    )
    await move1.start().iterations(100).assertCompleted()
    assert.ok(gbc.status.joint[5].actPos < 0, "j6 should be negative after first move")

    const move2 = gbc.wrap(
        gbc.activity.moveToPosition(300, 100, 300).rotationEuler(90, 45, 0).params({
            optimizeJointDistance: true
        }).promise
    )
    await move2.start().iterations(100).assertCompleted()

    console.log(gbc.status.joint.map(j => j.actPos))
    assert.ok(gbc.status.joint[5].actPos < 0, "j6 should still be negative after second move")
})

export const robot_kin_angles = test
