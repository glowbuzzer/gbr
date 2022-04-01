import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { ACTIVITYSTATE, BLENDTYPE, STREAMSTATE } from "../../../store/src"
import { assertNear } from "../util"

const test = uvu.suite("robot")

const config = state => state.status.kc[0].configuration

const state = state => state.stream.state
const tag = state => state.stream.tag

const INITIAL_CONFIG = 1

function init_robot_test() {
    // need to disable limit check before we hack the joints
    gbc.disable_limit_check()

    // we can't start the robot at a singularity, and we want config to not be zero
    gbc.set_joint_pos(0, 0)
    gbc.set_joint_pos(1, 0)
    gbc.set_joint_pos(2, Math.PI / 2)
    gbc.set_joint_pos(3, -Math.PI)
    gbc.set_joint_pos(4, -Math.PI / 4)
    gbc.set_joint_pos(5, 0)

    gbc.enable_operation()
    gbc.enable_limit_check()
}

test.before.each(() => {
    gbc.reset("configs/tx40_config.json")
    init_robot_test()
})

test("joint space move", async () => {
    // this just tests that scale (100000 as configured) is used when putting in PDO
    try {
        const move = gbc.wrap(gbc.activity.moveJoints([1]).promise)
        await move.start().iterations(66).assertCompleted()
    } finally {
        gbc.plot("test")
    }
})

test("move line keeping same orientation", async () => {
    try {
        // gbc.disable_limit_check()
        const move = gbc.wrap(
            // this doesn't involve orientation change
            gbc.activity.moveLine(100, 100, 100).rotationEuler(Math.PI, Math.PI / 4, 0).promise
        )
        await move.start().iterations(430).assertCompleted()
    } finally {
        gbc.plot("test")
    }

    gbc.assert.selector(config, INITIAL_CONFIG)
    assertNear(100, 100, 100, Math.PI, Math.PI / 4, 0)
})

test("move line keeping same orientation (rotation not specified)", async () => {
    try {
        // gbc.disable_limit_check()
        const move = gbc.wrap(
            // this doesn't involve orientation change
            gbc.activity.moveLine(100, 100, 100).promise
        )
        await move.start().iterations(300).assertCompleted()
    } finally {
        gbc.plot("test")
    }

    gbc.assert.selector(config, INITIAL_CONFIG)
    assertNear(100, 100, 100, Math.PI, Math.PI / 4, 0)
})

test("move line with change in orientation", async () => {
    try {
        const move = gbc.wrap(
            gbc.activity.moveLine(100, 100, 100).rotationEuler(Math.PI, 0, Math.PI / 4).promise
        )
        await move.start().iterations(300).assertCompleted()
    } finally {
        gbc.plot("test")
    }

    gbc.assert.selector(config, INITIAL_CONFIG)
    assertNear(100, 100, 100, Math.PI, 0, Math.PI / 4)
})

test("move to position with change in orientation", async () => {
    gbc.assert.selector(config, INITIAL_CONFIG)
    assertNear(270.962, 35, 179.038, -Math.PI, Math.PI / 4, 0)

    const move = gbc.wrap(
        gbc.activity
            .moveToPosition(100, 100, 100)
            .rotationEuler(Math.PI, 0, Math.PI / 4)
            .configuration(INITIAL_CONFIG).promise
    )
    await move.start().iterations(100).assertCompleted()

    gbc.plot("test")

    assertNear(100, 100, 100, Math.PI, 0, Math.PI / 4)
    gbc.assert.selector(config, INITIAL_CONFIG)
})

test("move to position without orientation specified", async () => {
    const move = gbc.wrap(
        gbc.activity.moveToPosition(100, 100, 100).configuration(INITIAL_CONFIG).promise
    )
    await move.start().iterations(100).assertCompleted()

    gbc.plot("test")

    gbc.assert.selector(config, INITIAL_CONFIG)
    assertNear(100, 100, 100, Math.PI, Math.PI / 4, 0)
})

test("move to position without configuration specified", async () => {
    // if target configuration not specified, it should stay in the current configuration
    const move = gbc.wrap(
        gbc.activity.moveToPosition(100, 100, 100).rotationEuler(Math.PI, 0, Math.PI / 4).promise
    )
    await move.start().iterations(100).assertCompleted()

    gbc.plot("test")

    assertNear(100, 100, 100, Math.PI, 0, Math.PI / 4)
    gbc.assert.selector(config, INITIAL_CONFIG)
})

test("blend move_to_position (with different orientation)", async () => {
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 100
    }
    const move1 = gbc.activity.moveToPosition(300, 100, 150).params(moveParams).command
    const move2 = gbc.activity
        .moveToPosition(100, 100, 300)
        .rotationEuler(Math.PI, 0, Math.PI / 4)
        .params(moveParams).command
    const end_program = gbc.activity.endProgram().command

    try {
        gbc.stream([move1, move2, end_program]) //
            .assert.streamSequence(
                tag,
                [
                    [10, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                    [10, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                    [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                    [60, 0, ACTIVITYSTATE.ACTIVITY_INACTIVE]
                ],
                false
            )
            .verify()
    } finally {
        gbc.plot("test")
    }

    assertNear(100, 100, 300, Math.PI, 0, Math.PI / 4)
    gbc.assert.selector(config, INITIAL_CONFIG)
})

test("blend move_to_position (with configuration change)", async () => {
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 100
    }
    const move1 = gbc.activity.moveToPosition(100, 100, 100).params(moveParams).command
    const move2 = gbc.activity
        .moveToPosition(100, 100, 300)
        .rotationEuler(Math.PI, 0, Math.PI / 4)
        .configuration(0) // wrist flip
        .params(moveParams).command
    const end_program = gbc.activity.endProgram().command

    try {
        gbc.stream([move1, move2, end_program]) //
            .assert.streamSequence(
                tag,
                [
                    [10, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                    [15, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                    [25, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                    [50, 0, ACTIVITYSTATE.ACTIVITY_INACTIVE]
                ],
                true
            )
            .verify()
    } finally {
        gbc.plot("test")
    }

    assertNear(100, 100, 300, Math.PI, 0, Math.PI / 4)
    gbc.assert.selector(config, 0)
})

test("blend move_to_position with move_line (with orientation change)", async () => {
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 100
    }
    const move1 = gbc.activity
        .moveToPosition(100, 100, 100)
        .rotationEuler(Math.PI, 0, 0)
        .params(moveParams).command
    const move2 = gbc.activity
        .moveLine(100, 100, 150)
        // .rotationEuler(Math.PI, 0, 0)
        .rotationEuler(0, Math.PI, 0)
        .params(moveParams).command
    const end_program = gbc.activity.endProgram().command

    try {
        gbc.stream([move1, move2, end_program]) //
            .assert.streamSequence(
                tag,
                [
                    [20, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                    [20, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                    [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                    [100, 0, ACTIVITYSTATE.ACTIVITY_INACTIVE]
                ],
                false
            )
            .verify()
    } finally {
        gbc.plot("test")
    }

    assertNear(100, 100, 150, 0, Math.PI, 0)
    gbc.assert.selector(config, INITIAL_CONFIG)
})

test.skip("execute arc with centre gcode", async () => {
    assertNear(270.962, 35, 179.038, -Math.PI, Math.PI / 4, 0)

    try {
        gbc.send_gcode(`
            g1 x100 y0
            g2 i-100 x0 y-100
            m2`)
        gbc.exec(500)
        gbc.assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE, "stream state not idle")

        assertNear(0, -100, 179.038, -Math.PI, Math.PI / 4, 0)
    } finally {
        gbc.plot("test")
    }
})

export const robot = test
