import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { GTLT, TRIGGERTYPE } from "../../../store/src"

const test = uvu.suite("waiton")

test.before.each(() => {
    gbc.reset()
    gbc.enable_operation()
})

test("can wait on a digital input", async () => {
    const command = gbc
        .wrap(gbc.activity.waitOnDigitalInput(0, TRIGGERTYPE.TRIGGERTYPE_RISING).promise)
        .start()
    await command.iterations(3).assertNotResolved()
    gbc.pdo.set_din(0, true)
    await command.iterations(3).assertCompleted()
})

test("can wait on an integer input", async () => {
    const command = gbc
        .wrap(gbc.activity.waitOnIntegerInput(0).value(10).condition(GTLT.GREATERTHAN).promise)
        .start()
    await command.iterations(3).assertNotResolved()
    gbc.pdo.set_iin(0, 20)
    await command.iterations(3).assertCompleted()
})

test("can wait on an analog input", async () => {
    const command = gbc
        .wrap(gbc.activity.waitOnAnalogInput(0).value(10.5).condition(GTLT.GREATERTHAN).promise)
        .start()
    await command.iterations(3).assertNotResolved()
    gbc.pdo.set_ain(0, 20.5)
    await command.iterations(3).assertCompleted()
})

export const waiton = test
