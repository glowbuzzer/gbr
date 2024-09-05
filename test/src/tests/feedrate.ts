/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { do_cancel } from "../util"

const test = uvu.suite("feedrate")

test.before.each(ctx => {
    console.log(ctx.__test__)
    const limits = {
        vmax: 20,
        amax: 200,
        jmax: 2000
    }
    gbc.config().joints(3, limits).cartesianKinematics(0, limits).finalize()
    gbc.enable_operation()
    gbc.exec(3)
    gbc.enable_limit_check()
})

test("should not exceed limits when ramping from stationary to regular fro (moveVectorAtVelocity)", async () => {
    try {
        gbc.set_fro(0, 0)

        const move = gbc.wrap(gbc.activity.moveVectorAtVelocity(0, 1, 0).promise)
        // let the move start, otherwise fro change will be instant (no activity)
        move.start().iterations(3)
        gbc.set_fro(0, 1)
        gbc.exec(100)
    } finally {
        gbc.plot("test")
    }
})

test("should not give velocity spike at higher fro when cancelling (moveVectorAtVelocity)", async () => {
    try {
        gbc.enable_limit_check(5)
        const move = gbc.wrap(gbc.activity.moveVectorAtVelocity(0, 1, 0).promise)
        move.start().iterations(35)
        gbc.set_fro(0, 2)
        gbc.exec(45)
        const cancel = gbc.wrap(gbc.activity.cancel().promise)
        cancel.start()
        gbc.exec(100)
    } finally {
        gbc.plot("test")
    }
})

test("should not break limits for fro change during ramp up (moveJointsAtVelocity)", async () => {
    try {
        gbc.enable_limit_check(2)
        gbc.set_fro(0, 1.2)
        const move = gbc.wrap(gbc.activity.moveJointsAtVelocity([1]).promise)
        move.start()
        gbc.exec(5)
        gbc.set_fro(0, 1)
        gbc.exec(20)

        const cancel = gbc.wrap(gbc.activity.cancel().promise)
        cancel.start().iterations(30)
    } finally {
        gbc.plot("test")
    }
})

test("should not break limits at higher fro when cancelling with fro change (moveJointsAtVelocity)", async () => {
    try {
        gbc.enable_limit_check(3) // we're running at double FRO, so give higher tolerance
        gbc.set_fro(0, 1)
        const move = gbc.wrap(gbc.activity.moveJointsAtVelocity([1]).promise)
        move.start()
        gbc.exec(25)
        gbc.set_fro(0, 2)
        gbc.exec(20)

        const cancel = gbc.wrap(gbc.activity.cancel().promise)
        cancel.start().iterations(50)
    } finally {
        gbc.plot("test")
    }
})

test("should be able to cancel immediately when fro is at zero (moveJointsAtVelocity)", async () => {
    try {
        gbc.set_fro(0, 1)
        const move = gbc.wrap(gbc.activity.moveJointsAtVelocity([1]).promise)
        move.start()
        gbc.exec(25)
        gbc.set_fro(0, 0)
        gbc.exec(50)

        const cancel = gbc.wrap(gbc.activity.cancel().promise)
        cancel.start().iterations(10)
        await cancel.assertCompleted()
    } finally {
        gbc.plot("test")
    }
})

test("will not cancel immediately when fro is non-zero (moveJointsAtVelocity)", async () => {
    try {
        gbc.set_fro(0, 1)
        const move = gbc.wrap(gbc.activity.moveJointsAtVelocity([1]).promise)
        move.start()
        gbc.exec(25)
        gbc.set_fro(0, 0.01) // small fro
        gbc.exec(50)

        const cancel = gbc.wrap(gbc.activity.cancel().promise)
        cancel.start().iterations(10)
        await cancel.assertNotResolved()
    } finally {
        gbc.plot("test")
    }
})

test("should not break limits when cancelling and fro disabled (moveJointsAtVelocity)", async () => {
    try {
        gbc.enable_limit_check() // we're expecting to stay within regular limits
        gbc.set_fro(0, 1)
        const move = gbc.wrap(
            gbc.activity.moveJointsAtVelocity([1]).params({ ignoreFeedrateOverride: true }).promise
        )
        move.start()
        gbc.exec(25)
        gbc.set_fro(0, 2)
        gbc.exec(20)

        const cancel = gbc.wrap(gbc.activity.cancel().promise)
        cancel.start().iterations(50)
    } finally {
        gbc.plot("test")
    }
})

export const feedrate = test
