import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { Vector3 } from "three"

const test = uvu.suite("activity")

async function do_cancel(activity, cancel_cycles = 5, rejection_cycles = 50) {
    // we don't expect the move to be complete after 10 cycles
    await activity.start().iterations(10).assertNotResolved()

    // we issue cancellation (activity type 0)
    const cancel = gbc.wrap(gbc.activity.cancel().promise)

    // we don't expect the cancel to be complete immediately (eg. move ramping down)
    await cancel.start().iterations(cancel_cycles).assertNotResolved()

    // we expect the move/activity to terminate (with rejection) after the given number of cycles
    await activity.iterations(rejection_cycles).assertCancelled()

    // and we expect the cancel to be complete too
    await cancel.assertCompleted()
}

test.before.each(ctx => {
    console.log(ctx.__test__)
    gbc.reset()
    gbc.enable_operation()
    gbc.set_fro(0, 100)
})

test("can cancel activity even if none started", async () => {
    // we expect issuing a cancel to have no effect and resolve more or less immediately
    await gbc.wrap(gbc.activity.cancel().promise).start().iterations(1).assertCompleted()
})

test("can run move arc to completion", async () => {
    const move = gbc.wrap(gbc.activity.moveArc(new Vector3(1, 1, 0), new Vector3(0, 1, 0)).promise)
    await move
        .start() //
        .iterations(100)
        .assertCompleted()
})

test("can run zero length arc", async () => {
    const move = gbc.wrap(gbc.activity.moveArc(new Vector3(0, 0, 0), new Vector3(0, 0, 0)).promise)
    await move
        .start() //
        .iterations(5)
        .assertCompleted()
})

test("can cancel move arc", async () => {
    const move = gbc.wrap(gbc.activity.moveArc(new Vector3(1, 1, 0), new Vector3(1, 0, 0)).promise)
    await do_cancel(move)
})

test("can run move joints to completion", async () => {
    const move = gbc.wrap(gbc.activity.moveJoints([10]).promise)
    await move.start().iterations(100).assertCompleted()
})

test("can cancel move joints", async () => {
    const move = gbc.wrap(gbc.activity.moveJoints([100]).promise)
    await do_cancel(move)
})

test("can run short cartesian move to completion", async () => {
    const move = gbc.wrap(gbc.activity.moveLine(new Vector3(1, 0, 0)).promise)
    await move.start().iterations(100).assertCompleted()
})

test("can cancel cartesian move", async () => {
    const move = gbc.wrap(gbc.activity.moveLine(new Vector3(10, 0, 0)).promise)
    await do_cancel(move)
})

test("can cancel cartesian move after short time", async () => {
    const move = gbc.wrap(gbc.activity.moveLine(new Vector3(10, 0, 0)).promise)

    // we don't expect the move to be complete after 10 cycles
    await move.start().iterations(10, true).assertNotResolved()

    // we issue cancellation (activity type 0)
    gbc.wrap(gbc.activity.cancel().promise).start()

    // we expect move to be completed
    await move.iterations(30, true).assertCancelled()
})

test("can run short move to position to completion", async () => {
    const move = gbc.wrap(gbc.activity.moveToPosition(new Vector3(1, 0, 0)).promise)
    await move.start().iterations(100).assertCompleted()
})

test("can cancel move to position", async () => {
    const move = gbc.wrap(gbc.activity.moveToPosition(new Vector3(10, 0, 0)).promise)
    await do_cancel(move)
})

test("can run cartesian move followed by move to position", async () => {
    const move1 = gbc.wrap(gbc.activity.moveLine(new Vector3(1, 0, 0)).promise)
    await move1.start().iterations(100).assertCompleted()
    const move2 = gbc.wrap(gbc.activity.moveToPosition(new Vector3(1, 1, 0)).promise)
    await move2.start().iterations(100).assertCompleted()
})

test("can run dwell", async () => {
    const dwell = gbc.wrap(gbc.activity.dwell(100).promise)
    await dwell.start().iterations(50).assertNotResolved()
    await dwell.iterations(60).assertCompleted()
})

test("can cancel dwell", async () => {
    const dwell = gbc.wrap(gbc.activity.dwell(100).promise)
    // on the first cycle after cancel we are cancelling the dwell so the cancel itself completes on the cycle after
    await do_cancel(dwell, 1, 3) // TODO: L: not sure why it takes 3 cycles to reject
})

export const activity = test
