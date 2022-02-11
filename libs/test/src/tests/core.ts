import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { DesiredState } from "../../../store/src"

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

export const core = test
