import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { assertNear, init_robot_test } from "../util"
import { Euler, Matrix4, Quaternion, Vector3 } from "three"

const test = uvu.suite("frames robot")

const config = state => state.status.kc[0].configuration

const tag = state => state.stream.tag

const INITIAL_CONFIG = 1

const px = state => state.status.kc[0].cartesianActPos.x
const py = state => state.status.kc[0].cartesianActPos.y
const pz = state => state.status.kc[0].cartesianActPos.z

const aw = state => state.status.kc[0].cartesianActOrientation.w
const ax = state => state.status.kc[0].cartesianActOrientation.x
const ay = state => state.status.kc[0].cartesianActOrientation.y
const az = state => state.status.kc[0].cartesianActOrientation.z

function assertNearWorld(x, y, z, a, b, c) {
    // this must match json config
    const robotTranslation = new Vector3(100, 0, 0)
    const robotRotation = new Quaternion().setFromEuler(new Euler(Math.PI / 4, 0, 0))

    // console.log("ROBOT LOCAL POS", gbc.get(px), gbc.get(py), gbc.get(pz))
    // console.log("ROBOT LOCAL ROT", gbc.get(ax), gbc.get(ay), gbc.get(az), gbc.get(aw))

    const from_world_trsf = new Matrix4().compose(
        robotTranslation,
        robotRotation,
        new Vector3(1, 1, 1)
    )

    // convert world to robot
    const world = new Matrix4().compose(
        new Vector3(x, y, z),
        new Quaternion().setFromEuler(new Euler(a, b, c)),
        new Vector3(1, 1, 1)
    )
    const local = new Matrix4().multiplyMatrices(from_world_trsf, world)
    const p = new Vector3()
    const q = new Quaternion()
    local.decompose(p, q, new Vector3())

    gbc.assert.near(px, p.x, 0.05)
    gbc.assert.near(py, p.y, 0.05)
    gbc.assert.near(pz, p.z, 0.05)

    // we allow negative values for expected because quaternion can be flipped
    gbc.assert.near(aw, q.w, 0.01, true)
    gbc.assert.near(ax, q.x, 0.01, true)
    gbc.assert.near(ay, q.y, 0.01, true)
    gbc.assert.near(az, q.z, 0.01, true)
}

/**
 * These tests check that frame handling for moves is working properly
 */

test.before.each(() => {
    gbc.reset("configs/frames_robot.json")
    init_robot_test()
})

test("initial kc local position from joint angles is not rotated", async () => {
    // initial position is (x 270.962, y 35, z 179.038, qx 0.924, qy 0, qz 0.383, qw 0) in local
    assertNear(270.962, 35, 179.038, -Math.PI, Math.PI / 4, 0)
})

test("basic move_to_position in kc local coords", async () => {
    try {
        const move = gbc.wrap(
            gbc.activity
                .moveToPosition(100, 100, 100)
                // frameIndex 1 is robot
                .frameIndex(1).promise
        )
        await move.start().iterations(75).assertCompleted()
        assertNear(100, 100, 100, -Math.PI, Math.PI / 4, 0)
    } finally {
        gbc.plot("test")
    }
})

test("basic move_to_position with no frame index specified (use kc local)", async () => {
    try {
        // default frame index is zero
        const move = gbc.wrap(gbc.activity.moveToPosition(100, 100, 100).promise)
        await move.start().iterations(75).assertCompleted()
        assertNear(100, 100, 100, -Math.PI, Math.PI / 4, 0)
    } finally {
        gbc.plot("test")
    }
})

test("basic move_to_position with different frame index for target", async () => {
    try {
        // default frame index is zero
        const move = gbc.wrap(
            gbc.activity
                .moveToPosition(100, 100, 100)
                // world frame index
                .frameIndex(0).promise
        )
        await move.start().iterations(75).assertCompleted()
        // const q = new Quaternion()
        //     .setFromEuler(new Euler(-Math.PI, Math.PI / 4, 0))
        //     .premultiply(new Quaternion().setFromEuler(new Euler(-Math.PI / 4, 0, 0)))
        // console.log("QUAT", q)
        // console.log("EULER", new Euler().setFromQuaternion(q))

        // fuck knows if this is correct!
        assertNearWorld(100, 100, 100, (3 * Math.PI) / 4, Math.PI / 4, 0)
    } finally {
        gbc.plot("test")
    }
})

export const frames_robot = test
