import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { assertNear } from "../util"
import { Vector3 } from "three"

const test = uvu.suite("offsets")

test.before.each(ctx => {
    console.log(ctx.__test__)
    gbc.reset()
    gbc.enable_operation()
    gbc.set_fro(0, 100)
    gbc.capture(true)
})

test("can run move line with simple translation offset", async () => {
    gbc.offset(new Vector3(-10, 0, 0))
    const move = gbc.wrap(gbc.activity.moveLine(0, 0, 0).promise)
    await move.start().iterations(100).assertCompleted()
    assertNear(10, 0, 0, 0, 0, 0)
})

test.only("can run move line with translation offset in a different frame", async () => {
    // gbc.offset(new Vector3(-10, 0, 0))
    const move = gbc.wrap(gbc.activity.moveLine(0, 0, 0).frameIndex(1).promise)
    await move.start().iterations(100).assertCompleted()
    assertNear(1, 1, 0, 0, 0, 0)
})

export const offsets = test
