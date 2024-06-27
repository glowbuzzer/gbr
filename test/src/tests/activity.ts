/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { assertNear, do_cancel } from "../util"

const test = uvu.suite("activity")

test.before.each(ctx => {
    console.log(ctx.__test__)
    gbc.reset()
    gbc.enable_operation()
    gbc.set_fro(0, 1)
})

test("can cancel activity even if none started", async () => {
    // we expect issuing a cancel to have no effect and resolve more or less immediately
    await gbc.wrap(gbc.activity.cancel().promise).start().iterations(1).assertCompleted()
})

test("can run move joints to completion", async () => {
    try {
        const move = gbc.wrap(gbc.activity.moveJoints([10]).promise)
        await move.start().iterations(100).assertCompleted()
    } finally {
        gbc.plot("test")
    }
})

test("can cancel move joints", async () => {
    try {
        const move = gbc.wrap(gbc.activity.moveJoints([100]).promise)
        await do_cancel(move)
    } finally {
        gbc.plot("test")
    }
})

test("can run short cartesian move to completion", async () => {
    const move = gbc.wrap(gbc.activity.moveLine(1, 0, 0).promise)
    await move.start().iterations(100).assertCompleted()
})

test("can run long cartesian move to completion", async () => {
    const move = gbc.wrap(gbc.activity.moveLine(30, 0, 0).promise)
    try {
        await move.start().iterations(70).assertCompleted()
    } finally {
        gbc.plot("moveline-primitive-long")
    }
})

test("can cancel cartesian move", async () => {
    const move = gbc.wrap(gbc.activity.moveLine(10, 0, 0).promise)
    await do_cancel(move)
})

test("can cancel cartesian move after short time", async () => {
    const move = gbc.wrap(gbc.activity.moveLine(10, 0, 0).promise)

    // we don't expect the move to be complete after 10 cycles
    await move.start().iterations(10, true).assertNotResolved()

    // we issue cancellation (activity type 0)
    gbc.wrap(gbc.activity.cancel().promise).start()

    // we expect move to be completed
    await move.iterations(30, true).assertCancelled()
})

test("can run short move to position to completion", async () => {
    const move = gbc.wrap(gbc.activity.moveToPosition(1, 0, 0).promise)
    await move.start().iterations(100).assertCompleted()
})

test("can run move to position with different frame", async () => {
    const move = gbc.wrap(gbc.activity.moveToPosition(1, 0, 0).frameIndex(1).promise)
    await move.start().iterations(100).assertCompleted()

    assertNear(2, 1, 0, 0, 0, 0)
})

test("can cancel move to position", async () => {
    const move = gbc.wrap(gbc.activity.moveToPosition(100, 0, 0).promise)
    await do_cancel(move)
})

test.skip("can interrupt move to position with move line", async () => {
    const move_to_position = gbc.wrap(gbc.activity.moveToPosition(100, 0, 0).promise)
    await move_to_position.start().iterations(10).assertNotResolved()

    const move_line = gbc.wrap(gbc.activity.moveLine(0, 100, 0).promise)
    await move_line.start().iterations(10).assertNotResolved()
    await move_line.iterations(50).assertCompleted()
})

test("can run cartesian move followed by move to position", async () => {
    const move1 = gbc.wrap(gbc.activity.moveLine(1, 0, 0).promise)
    await move1.start().iterations(100).assertCompleted()
    const move2 = gbc.wrap(gbc.activity.moveToPosition(1, 1, 0).promise)
    await move2.start().iterations(100).assertCompleted()
})

test("can run move joints followed by move to position", async () => {
    const move1 = gbc.wrap(gbc.activity.moveJoints([1, 0, 0]).relative(true).promise)
    await move1.start().iterations(100).assertCompleted()
    assertNear(1, 0, 0, 0, 0, 0)
    const move2 = gbc.wrap(gbc.activity.moveToPosition(1, 1, 0).promise)
    await move2.start().iterations(100).assertCompleted()
    assertNear(1, 1, 0, 0, 0, 0)
})

test("can run dwell", async () => {
    const dwell = gbc.wrap(gbc.activity.dwell(400).promise)
    await dwell.start().iterations(50).assertNotResolved()
    await dwell.iterations(60).assertCompleted()
})

test("can cancel dwell", async () => {
    const dwell = gbc.wrap(gbc.activity.dwell(100).promise)
    // on the first cycle after cancel we are cancelling the dwell so the cancel itself completes on the cycle after
    await do_cancel(dwell, 1, 3) // TODO: L: not sure why it takes 3 cycles to reject
})

test("can cancel move vector at velocity", async () => {
    const move = gbc.wrap(gbc.activity.moveVectorAtVelocity(1, 0, 0).promise)
    // on the first cycle after cancel we are cancelling the dwell so the cancel itself completes on the cycle after
    await do_cancel(move, 1, 50)
})

test("will normalise move vector at velocity", async () => {
    // the vector given here is not normalised but should still work without error
    const move = gbc.wrap(gbc.activity.moveVectorAtVelocity(100, 0, 0).promise)
    await do_cancel(move, 1, 50)
})

export const activity = test
