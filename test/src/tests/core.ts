/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { DesiredState, FaultCode } from "../../../libs/store/src"

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

// this is hard to test in gbc-node
test.skip("can trigger an error when move not enabled", () => {
    gbc.wrap(gbc.activity.moveLine(10, 10).promise).start().iterations(2)
    gbc.assert.faultReactionActive(FaultCode.FAULT_CAUSE_GBC_INTERNAL_ERROR)
    gbc.exec(1)
    gbc.assert.fault(FaultCode.FAULT_CAUSE_GBC_INTERNAL_ERROR)
    gbc.exec(5)
    // fault should persist in history
    gbc.assert.fault(FaultCode.FAULT_CAUSE_GBC_INTERNAL_ERROR)
})

test.skip("can error and will give a message in status", async () => {
    gbc.enable_operation()
    gbc.wrap(gbc.activity.moveArc(10, 10).radius(1).promise).start().iterations(1)
    // gbc.assert.selector(s => s.status.machine.error, true, "Expected error to be true")
})

export const core = test
