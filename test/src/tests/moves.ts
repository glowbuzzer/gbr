/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { gbc } from "../../gbc"
import * as uvu from "uvu"
const test = uvu.suite("moves")

const px = state => state.status.kc[0].position.translation.x
const py = state => state.status.kc[0].position.translation.y
const pz = state => state.status.kc[0].position.translation.z

test.before.each(() => {
    gbc.config()
        .joints(3, {
            vmax: 20,
            amax: 400,
            jmax: 8000
        })
        .cartesianKinematics()
        .linearLimits(20, 400, 8000)
        .finalize()

    gbc.enable_operation()
    gbc.enable_limit_check()
})

test("move line with some axes unspecified", async () => {
    try {
        // move away from origin
        await gbc.run(api => api.moveToPosition(10, 10, 10))
        gbc.assert.near(px, 10)
        gbc.assert.near(py, 10)
        // should work with null
        await gbc.run(api => api.moveLine(null, null, 20))
        gbc.assert.near(px, 10)
        gbc.assert.near(py, 10)
        gbc.assert.near(pz, 20)
        // should work with undefined
        await gbc.run(api => api.moveLine(undefined, undefined, 30))
        gbc.assert.near(px, 10)
        gbc.assert.near(py, 10)
        gbc.assert.near(pz, 30)
    } finally {
        gbc.plot("test")
    }
})

export const moves = test
