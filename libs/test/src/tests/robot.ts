import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { Euler, Quaternion } from "three"
import { ACTIVITYSTATE, BLENDTYPE } from "../../../store/src"

const test = uvu.suite("robot")

const px = state => state.status.kc[0].cartesianActPos.x
const py = state => state.status.kc[0].cartesianActPos.y
const pz = state => state.status.kc[0].cartesianActPos.z

const aw = state => state.status.kc[0].cartesianActOrientation.w
const ax = state => state.status.kc[0].cartesianActOrientation.x
const ay = state => state.status.kc[0].cartesianActOrientation.y
const az = state => state.status.kc[0].cartesianActOrientation.z

const tag = state => state.stream.tag

function assertNear(x, y, z, a, b, c) {
    const q = new Quaternion().setFromEuler(new Euler(a, b, c))

    gbc.assert.near(px, x, 0.01)
    gbc.assert.near(py, y, 0.01)
    gbc.assert.near(pz, z, 0.01)

    gbc.assert.near(aw, q.w, 0.01)
    gbc.assert.near(ax, q.x, 0.01)
    gbc.assert.near(ay, q.y, 0.01)
    gbc.assert.near(az, q.z, 0.01)
}

test.before.each(() => {
    gbc.reset("configs/tx40_config.json")
    gbc.disable_limit_check()
    gbc.set_joint_pos(2, Math.PI / 2) // we can't start the robot at singularity (straight up)
    gbc.enable_operation()
    gbc.enable_limit_check()
    gbc.capture()
})

test("can do a joint space move", async () => {
    // this just tests that scale (100000 as configured) is used when putting in PDO
    try {
        const move = gbc.wrap(gbc.activity.moveJoints([1]).promise)
        await move.start().iterations(60).assertCompleted()
    } finally {
        gbc.plot("test")
    }
})

test("can do a cartesian move with orientation", async () => {
    const quaternion = new Quaternion().setFromEuler(new Euler(Math.PI, 0, 0))
    const { x, y, z, w } = quaternion

    const move = gbc.wrap(gbc.activity.moveToPosition(100, 100, 100).rotation(x, y, z, w).promise)
    await move.start().iterations(100).assertCompleted()
    gbc.plot("test")

    assertNear(100, 100, 100, Math.PI, 0, 0)
})

test("can blend move_to_position (with orientation)", async () => {
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 100
    }
    const move1 = gbc.activity
        .moveToPosition(100, 100, 100)
        .rotationEuler(Math.PI, 0, 0)
        .params(moveParams).command
    const move2 = gbc.activity
        .moveToPosition(100, 100, 300)
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
                    [60, 0, ACTIVITYSTATE.ACTIVITY_INACTIVE]
                ],
                true
            )
            .verify()
    } finally {
        gbc.plot("test")
    }

    assertNear(100, 100, 300, 0, Math.PI, 0)
})

test.skip("can blend move_to_position with move_line (with orientation)", async () => {
    const moveParams = {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED,
        blendTimePercentage: 100
    }
    const move1 = gbc.activity
        .moveToPosition(100, 100, 100)
        .rotationEuler(Math.PI, 0, 0)
        .params(moveParams).command
    const move2 = gbc.activity
        .moveLine(100, 100, 300)
        .rotationEuler(0, Math.PI, 0)
        .params(moveParams).command
    const end_program = gbc.activity.endProgram().command

    try {
        gbc.disable_limit_check()
        gbc.stream([move1, move2, end_program]) //
            .assert.streamSequence(
                tag,
                [
                    [20, 1, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                    [20, 1, ACTIVITYSTATE.ACTIVITY_BLEND_ACTIVE],
                    [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
                    [300, 0, ACTIVITYSTATE.ACTIVITY_INACTIVE]
                ],
                true
            )
            .verify()
    } finally {
        gbc.plot("test")
    }

    assertNear(100, 100, 300, 0, Math.PI, 0)
})

export const robot = test
