/*
 * Copyright (c) 2025. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { MachineState, OPERATION_ERROR } from "@glowbuzzer/store"

const test = uvu.suite("error_handling")

test.before.each(() => {
    gbc.config().joints(1).cartesianKinematics().jointLimits(-10, 10).finalize().enable_operation()
})

/**
 * Error handling doesn't work correctly in the test framework of gbc-node. The full lifecycle of the GBC cyclic task isn't exercised
 */
test.skip("will report operation error when joint limits exceeded", async () => {
    try {
        await gbc
            .run(api => api.moveJoints([20]))
            .catch(() => {
                // ignore error
            })

        gbc.exec(1, true)

        gbc.assert.machineState(MachineState.FAULT)
        gbc.assert.selector(
            gbc => gbc.status.machine.operationError,
            OPERATION_ERROR.OPERATION_ERROR_JOINT_LIMIT_EXCEEDED
        )
    } finally {
        gbc.plot("test")
    }
})

export const error_handling = test
