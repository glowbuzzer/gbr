/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import { gbc } from "../../gbc"
import {
    AnalogInputTriggerBuilder,
    DigitalInputTriggerBuilder,
    IntegerInputTriggerBuilder,
    TimerTriggerBuilder
} from "../../../libs/store/src/activity/api/triggers"
import {
    ACTIVITYSTATE,
    TASK_COMMAND,
    TASK_STATE,
    TRIGGERACTION,
    TRIGGERTYPE
} from "../../../libs/store/src"

const test = uvu.suite("triggers")

test.before.each(() => {
    gbc.config()
        .joints(3)
        .cartesianKinematics()
        .digitalInputs(3)
        .tasks(
            {
                name: "task1 - trigger start",
                activityCount: 1,
                triggers: [
                    {
                        type: 2,
                        action: 2,
                        digital: {
                            input: 1,
                            when: 0
                        }
                    }
                ]
            },
            {
                name: "task2 - trigger cancel",
                firstActivityIndex: 1,
                activityCount: 1,
                triggers: [
                    {
                        type: 2,
                        action: 1,
                        digital: {
                            input: 2,
                            when: 0
                        }
                    }
                ]
            }
        )
        .activities(
            {
                name: "activity1",
                activityType: 14,
                dwell: {
                    ticksToDwell: 10
                }
            },
            {
                name: "activity2",
                activityType: 14,
                dwell: {
                    ticksToDwell: 10
                }
            }
        )
        .finalize()

    gbc.enable_operation()
})

test.after.each(() => {
    gbc.destroy()
})

const tag = state => state.stream[0].tag

test("can trigger cancel after a number of ms (solo)", async () => {
    // the bus cycle time is 4, so 20ms is 5 cycles
    const trigger = new TimerTriggerBuilder(20).action(TRIGGERACTION.TRIGGERACTION_CANCEL).build()
    const command = gbc.wrap(gbc.activity.dwell(10000).addTrigger(trigger).promise).start()
    await command.iterations(2).assertNotResolved()
    await command.iterations(5).assertCancelled()
})

test("can trigger cancel after a number of ms (stream)", async () => {
    // the bus cycle time is 4, so 20ms is 5 cycles
    const trigger = new TimerTriggerBuilder(20).action(TRIGGERACTION.TRIGGERACTION_CANCEL).build()
    const dwell1 = gbc.stream.dwell(10000).addTrigger(trigger).command
    const dwell2 = gbc.stream.dwell(3).command
    const end_program = gbc.stream.endProgram().command
    gbc.enqueue([dwell1, dwell2, end_program]) //
        .assert.streamSequence(tag, [
            [2, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE], // first dwell before trigger
            [5, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE], // second dwell normal
            [5, 2, ACTIVITYSTATE.ACTIVITY_COMPLETED] // end of stream
        ])
        .verify()
})

test("can trigger cancel on digital in (solo)", async () => {
    const trigger = new DigitalInputTriggerBuilder(0)
        .action(TRIGGERACTION.TRIGGERACTION_CANCEL)
        .build()
    const command = gbc.wrap(gbc.activity.dwell(10000).addTrigger(trigger).promise).start()
    await command.iterations(2).assertNotResolved()
    gbc.pdo.set_din(0, true)
    await command.iterations(5).assertCancelled()
})

test("can trigger cancel on digital in (stream)", async () => {
    const trigger = new DigitalInputTriggerBuilder(0)
        .action(TRIGGERACTION.TRIGGERACTION_CANCEL)
        .build()
    const dwell1 = gbc.stream.dwell(10000).addTrigger(trigger).command
    const dwell2 = gbc.stream.dwell(3).command
    const end_program = gbc.stream.endProgram().command
    const sequence = gbc.enqueue([dwell1, dwell2, end_program])
    sequence.assert
        .streamSequence(tag, [
            [2, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE] // first dwell before trigger
        ])
        .verify()
    gbc.pdo.set_din(0, true)
    sequence.assert
        .streamSequence(tag, [
            [2, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE], // second dwell normal
            [1, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE], // second dwell normal
            [5, 2, ACTIVITYSTATE.ACTIVITY_COMPLETED] // end of stream
        ])
        .verify()
})

test("can trigger cancel on gt analog in (solo)", async () => {
    const trigger = new AnalogInputTriggerBuilder(0)
        .action(TRIGGERACTION.TRIGGERACTION_CANCEL)
        .gt(100)
        .build()
    const command = gbc.wrap(gbc.activity.dwell(10000).addTrigger(trigger).promise).start()
    await command.iterations(10).assertNotResolved()
    gbc.pdo.set_ain(0, 101)
    await command.iterations(5).assertCancelled()
})

test("can trigger cancel on lt analog in (solo)", async () => {
    const trigger = new AnalogInputTriggerBuilder(0)
        .action(TRIGGERACTION.TRIGGERACTION_CANCEL)
        .lt(0)
        .build()
    const command = gbc.wrap(gbc.activity.dwell(10000).addTrigger(trigger).promise).start()
    await command.iterations(10).assertNotResolved()
    gbc.pdo.set_ain(0, -1)
    await command.iterations(5).assertCancelled()
})

test("can trigger cancel on gt integer in (solo)", async () => {
    const trigger = new IntegerInputTriggerBuilder(0)
        .action(TRIGGERACTION.TRIGGERACTION_CANCEL)
        .gt(100)
        .build()
    const command = gbc.wrap(gbc.activity.dwell(10000).addTrigger(trigger).promise).start()
    await command.iterations(10).assertNotResolved()
    gbc.pdo.set_iin(0, 101)
    await command.iterations(5).assertCancelled()
})

// test("can trigger cancel on lt integer in (solo)", async () => {
//     // NEED SIGNED INT
//     const trigger = new IntegerInputTriggerBuilder(0)
//         .action(TRIGGERACTION.TRIGGERACTION_CANCEL)
//         .lt(0)
//         .build()
//     const command = gbc.wrap(gbc.stream.dwell(10000).addTrigger(trigger).promise).start()
//     await command.iterations(10).assertNotResolved()
//     gbc.pdo.set_iin(0, -1)
//     await command.iterations(5).assertCancelled()
// })

test("can trigger start after a number of ms (solo)", async () => {
    // the bus cycle time is 4, so 20ms is 5 cycles
    const trigger = new TimerTriggerBuilder(20).action(TRIGGERACTION.TRIGGERACTION_START).build()
    const command = gbc.wrap(gbc.activity.dwell(5).addTrigger(trigger).promise).start()
    await command.iterations(8).assertNotResolved()
    await command.iterations(5).assertCompleted()
})

test("can trigger start after a number of ms (stream)", async () => {
    // the bus cycle time is 4, so 20ms is 5 cycles
    const trigger = new TimerTriggerBuilder(20).action(TRIGGERACTION.TRIGGERACTION_START).build()
    const dwell1 = gbc.stream.dwell(15).command
    const dwell2 = gbc.stream.dwell(5).addTrigger(trigger).command // 2nd dwell is triggered
    const end_program = gbc.stream.endProgram().command
    gbc.enqueue([dwell1, dwell2, end_program]) //
        .assert.streamSequence(tag, [
            [10, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE], // first dwell before complete
            [8, 2, ACTIVITYSTATE.ACTIVITY_INACTIVE], // second dwell pending trigger
            [5, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE], // second dwell active
            [15, 2, ACTIVITYSTATE.ACTIVITY_COMPLETED] // end of stream
        ])
        .verify()
})

test("can trigger task to start", async () => {
    gbc.exec(10).assert.task(0, TASK_STATE.TASK_NOTSTARTED)
    gbc.pdo.set_din(1, true)
    gbc.exec(5).assert.task(0, TASK_STATE.TASK_RUNNING)
    // after task completes we return immediately to TASK_NOTSTARTED, since command remains TASK_IDLE
    gbc.exec(10).assert.task(0, TASK_STATE.TASK_NOTSTARTED)
})

test("can trigger task to cancel", async () => {
    gbc.exec(5).assert.task(1, TASK_STATE.TASK_NOTSTARTED)
    gbc.task(1, TASK_COMMAND.TASK_RUN)
    gbc.exec(5).assert.task(1, TASK_STATE.TASK_RUNNING)
    gbc.pdo.set_din(2, true)
    gbc.exec(2).assert.task(1, TASK_STATE.TASK_STOPPING)
    gbc.exec(10).assert.task(1, TASK_STATE.TASK_CANCELLED)
    // task is cancelled waiting to be put back to IDLE
})

export const triggers = test
