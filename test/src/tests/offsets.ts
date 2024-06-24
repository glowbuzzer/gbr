/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { assertNear } from "../util"
import { Euler, Quaternion, Vector3 } from "three"

const test = uvu.suite("offsets")

test.before.each(ctx => {
    console.log(ctx.__test__)
    gbc.config()
        .joints(3)
        .cartesianKinematics()
        .addFrame({
            translation: { x: 1, y: 1, z: 0 }
        })
        .finalize()
    gbc.enable_operation()
    // gbc.set_fro(0, 1)
})

test("can run move line with simple translation offset", async () => {
    gbc.offset(new Vector3(10, 0, 0), new Quaternion())
    await gbc.run(api => api.moveLine(0, 0, 0))
    assertNear(-10, 0, 0, 0, 0, 0)
})

test("can run move line with rotation", async () => {
    gbc.offset(new Vector3(0, 0, 0), new Quaternion().setFromEuler(new Euler(-Math.PI / 2, 0, 0)))
    await gbc.run(api => api.moveLine(10, 10, 0))
    assertNear(10, 0, 10, 0, 0, 0)
})

test("can run move line with translation offset in a different frame", async () => {
    gbc.offset(new Vector3(10, 0, 0), new Quaternion())
    await gbc.run(api => api.moveLine(0, 0, 0).frameIndex(1))
    assertNear(-9, 1, 0, 0, 0, 0)
})

test("can run to position with rotation", async () => {
    gbc.offset(new Vector3(0, 0, 0), new Quaternion().setFromEuler(new Euler(-Math.PI / 2, 0, 0)))
    await gbc.run(api => api.moveToPosition(10, 10, 0))
    assertNear(10, 0, 10, 0, 0, 0)
})

export const offsets = test
