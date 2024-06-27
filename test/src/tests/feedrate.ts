/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { do_cancel } from "../util"

const test = uvu.suite("feedrate")

test.before.each(ctx => {
    console.log(ctx.__test__)
    gbc.config().joints(3).cartesianKinematics().finalize()
    gbc.enable_operation()
    // we want an unusual number here to ensure we don't fall on
    // cycle boundary
    gbc.set_fro(0, 1.321232)
    gbc.exec(15)
})

test("should not exceed limits when ramping from stationary to regular fro", async () => {
    try {
        gbc.enable_limit_check(1.5)
        gbc.set_fro(0, 0)
        gbc.exec(40)
        gbc.assert.selector(s => s.status.kc[0].froActual, 0)

        gbc.set_fro(0, 0)
        const move = gbc.wrap(gbc.activity.moveVectorAtVelocity(0, 1, 0).promise)
        move.start().iterations(40)
    } finally {
        gbc.plot("test")
    }
})

test.only("moveVectorAtVelocity should not give velocity spike at higher fro when cancelling", async () => {
    try {
        // we allow slightly higher limit because of fro changes
        gbc.enable_limit_check(25)
        const move = gbc.wrap(gbc.activity.moveVectorAtVelocity(0, 1, 0).promise)
        move.start().iterations(25)
        gbc.set_fro(0, 0.1)
        // gbc.exec(1)
        const cancel = gbc.wrap(gbc.activity.cancel().promise)
        cancel.start()
        gbc.exec(35)
    } finally {
        gbc.plot("test")
    }
})

test("moveJointsAtVelocity should not give velocity spike at higher fro when cancelling", async () => {
    try {
        const move = gbc.wrap(gbc.activity.moveJointsAtVelocity([1]).promise)
        move.start().iterations(2)
        gbc.set_fro(0, 2)
        gbc.exec(25) // ensure fro change complete

        const cancel = gbc.wrap(gbc.activity.cancel().promise)
        cancel.start().iterations(25)
    } finally {
        gbc.plot("test")
    }
})

export const feedrate = test
