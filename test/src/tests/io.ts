/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import { gbc } from "../../gbc"

const test = uvu.suite("io")

test.before.each(() => {
    gbc.reset()
})

test("can get digital input from fieldbus", async () => {
    const index = 2
    const selector = state => state.status.din[index]
    gbc.assert
        .selector(selector, false)
        .enable_operation()
        .pdo.set_din(index, true)
        .exec()
        .assert.selector(selector, true)
})

test("can set digital output on fieldbus", async () => {
    gbc.enable_operation()
    gbc.assert.doutPdo(0, false)
    gbc.assert.selector(state => state.status.dout[0].effectiveValue, false)
    await gbc.run(api => api.setDout(0, true))
    gbc.assert.doutPdo(0, true)
    gbc.assert.selector(state => state.status.dout[0].effectiveValue, true)
})

test("can get analog input from fieldbus", async () => {
    const index = 0 // config only has one AIN
    const selector = state => state.status.ain[index]
    gbc.enable_operation()
        .assert.selector(selector, 0)
        .pdo.set_ain(index, 1.2345)
        .exec()
        .assert.selector(selector, 1.2345)
})

test("can set analog output on fieldbus", async () => {
    gbc.enable_operation()
    gbc.assert.aoutPdo(0, 0.0)
    gbc.assert.selector(state => state.status.aout[0].effectiveValue, 0.0)
    await gbc.run(api => api.setAout(0, 1.234))
    gbc.assert.aoutPdo(0, 1.234)
    gbc.assert.selector(state => state.status.aout[0].effectiveValue, 1.234)
})

test("can get integer input from fieldbus", async () => {
    const index = 0
    const selector = state => state.status.iin[index]
    gbc.enable_operation()
        .assert.selector(selector, 0)
        .pdo.set_iin(index, 42)
        .exec()
        .assert.selector(selector, 42)
})

test("can set integer output on fieldbus", async () => {
    gbc.enable_operation()
    gbc.assert.ioutPdo(0, 0)
    gbc.assert.selector(state => state.status.iout[0].effectiveValue, 0)
    await gbc.run(api => api.setIout(0, 42))
    gbc.assert.ioutPdo(0, 42)
    gbc.assert.selector(state => state.status.iout[0].effectiveValue, 42)
})

export const io = test
