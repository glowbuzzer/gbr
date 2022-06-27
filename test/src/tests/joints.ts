/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import { gbc } from "../../gbc"

const test = uvu.suite("joints")

test.before.each(() => {
    gbc.reset()
    gbc.enable_operation()
})

test("can run joint at velocity", async () => {
    const move = gbc.wrap(gbc.activity.moveJointsAtVelocity([100]).promise)
    const cancel = gbc.wrap(gbc.activity.cancel().promise)

    try {
        move.start().iterations(100)
        cancel.start().iterations(50)

        await move.assertCancelled()
        await cancel.assertCompleted()
    } finally {
        gbc.plot("test")
    }
})

test("can run joint at negative velocity", async () => {
    const move = gbc.wrap(gbc.activity.moveJointsAtVelocity([-100]).promise)
    const cancel = gbc.wrap(gbc.activity.cancel().promise)

    try {
        move.start().iterations(100)
        cancel.start().iterations(50)

        await move.assertCancelled()
        await cancel.assertCompleted()
    } finally {
        gbc.plot("test")
    }
})

export const joints = test
