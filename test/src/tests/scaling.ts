/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import { gbc } from "../../gbc"

const test = uvu.suite("scaling")

// const pos = joint => state => state.status.joint[joint].actPos
const x = state => state.status.kc[0].position.translation.x

test.before.each(() => {
    gbc.config()
        .joints(3)
        .scaleJoints(100000)
        .cartesianKinematics()
        .scaleKinematics(2)
        .finalize()
        .enable_operation()
    // gbc.reset("configs/scaling_config.json").enable_operation()
})

test("will use joint scale", async () => {
    // this just tests that scale (100000 as configured) is used when putting in PDO
    try {
        const move = gbc.wrap(gbc.activity.moveJoints([1]).promise)
        await move.start().iterations(25).assertCompleted()
        gbc.assert.jointPosPdo(0, 100000, 1)
    } finally {
        gbc.plot("test")
    }
})

test("will use kc scale", async () => {
    gbc.enable_limit_check(1.5)
    const move = gbc.wrap(gbc.activity.moveLine(1, 0, 0).promise)
    await move.start().iterations(25).assertCompleted()
    gbc.assert.jointPosPdo(0, 200000, 1)
    gbc.assert.near(x, 1)
})

export const scaling = test
