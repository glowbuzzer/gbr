import * as uvu from "uvu"
import { gbc } from "../../gbc"

const test = uvu.suite("spindle")

test.before.each(() => {
    gbc.reset()
    gbc.enable_operation()
})

test("can start and stop spindle", async () => {
    gbc.enable_operation()
    gbc.assert.doutPdo(0, false)
    gbc.assert.doutPdo(1, false)
    gbc.assert.aoutPdo(0, 0)

    // start spindle
    await gbc
        .wrap(gbc.activity.spindle(0, true, 1.0).promise)
        .start()
        .iterations(1)
        .assertCompleted()

    gbc.assert.doutPdo(0, true)
    gbc.assert.doutPdo(1, true) // default clockwise
    gbc.assert.aoutPdo(0, 1.0)

    // stop spindle
    await gbc.wrap(gbc.activity.spindle(0, false).promise).start().iterations(1).assertCompleted()

    gbc.assert.doutPdo(0, false)
    gbc.assert.doutPdo(1, true) // remains default clockwise
    gbc.assert.aoutPdo(0, 1.0) // we didn't set spindle speed so it's kept from previous
})

test("can start and stop spindle from gcode", async () => {
    gbc.send_gcode("M03 S100\nM2")
    gbc.exec(3)
    gbc.assert.doutPdo(0, true)
    gbc.assert.doutPdo(1, true) // M03 is clockwise
    gbc.assert.aoutPdo(0, 100)

    gbc.send_gcode("M04 S50\nM2")
    gbc.exec(3)
    gbc.assert.doutPdo(0, true)
    gbc.assert.doutPdo(1, false) // M03 is clockwise
    gbc.assert.aoutPdo(0, 50)

    gbc.send_gcode("M05\nM2")
    gbc.exec(3)
    gbc.assert.doutPdo(0, false)
    gbc.assert.doutPdo(1, true) // defaults back to true
    gbc.assert.aoutPdo(0, 0) // defaults back to zero
})

test("can handle spindle speed before M code (modal S)", async () => {
    gbc.send_gcode("S200\nM03\nM2")
    gbc.exec(3)
    gbc.assert.doutPdo(0, true)
    gbc.assert.doutPdo(1, true) // M03 is clockwise
    gbc.assert.aoutPdo(0, 200)
})

export const spindle = test
