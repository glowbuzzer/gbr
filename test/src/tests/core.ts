/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { DesiredState } from "../../../libs/store/src"

const test = uvu.suite("core")

test.before.each(() => {
    gbc.reset()
})

test("can transition to OPERATION_ENABLED", () => {
    gbc.enable_operation()
})

test("can transition from OPERATION_ENABLED to STANDBY", () => {
    gbc.enable_operation().transition_to(DesiredState.STANDBY)
})

test.skip("can error and will give a message in status", async () => {
    gbc.enable_operation()
    gbc.wrap(gbc.activity.moveArc(10, 10).radius(1).promise).start().iterations(1)
    gbc.assert.selector(s => s.status.machine.error, true, "Expected error to be true")
})

export const core = test
