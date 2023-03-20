/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { assertNear, do_cancel } from "../util"
import { Euler, Matrix4, Quaternion, Vector3 } from "three"

const test = uvu.suite("frames robot")

const px = state => state.status.kc[0].position.translation.x
const py = state => state.status.kc[0].position.translation.y
const pz = state => state.status.kc[0].position.translation.z

const aw = state => state.status.kc[0].position.rotation.w
const ax = state => state.status.kc[0].position.rotation.x
const ay = state => state.status.kc[0].position.rotation.y
const az = state => state.status.kc[0].position.rotation.z

function assertNearWorld(x, y, z, a, b, c) {
    // this must match json config
    const robotTranslation = new Vector3(100, 0, 0)
    const robotRotation = new Quaternion().setFromEuler(new Euler(Math.PI / 4, 0, 0))

    // console.log("ROBOT LOCAL POS", gbc.get(px), gbc.get(py), gbc.get(pz))
    // console.log("ROBOT LOCAL ROT", gbc.get(ax), gbc.get(ay), gbc.get(az), gbc.get(aw))

    const from_world_trsf = new Matrix4()
        .compose(robotTranslation, robotRotation, new Vector3(1, 1, 1))
        .invert()

    // convert world to robot
    const world = new Matrix4().compose(
        new Vector3(x, y, z),
        new Quaternion().setFromEuler(new Euler(a, b, c)),
        new Vector3(1, 1, 1)
    )
    const local = world.clone().premultiply(from_world_trsf)
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

function init_robot_test() {
    // need to disable limit check before we hack the joints
    gbc.disable_limit_check()

    // we can't start the robot at a singularity, and we want config to not be zero
    gbc.set_joint_pos(0, 0)
    gbc.set_joint_pos(1, 0)
    gbc.set_joint_pos(2, Math.PI / 2)
    gbc.set_joint_pos(3, (-3 * Math.PI) / 4)
    gbc.set_joint_pos(4, Math.PI / 2)
    gbc.set_joint_pos(5, Math.PI)

    gbc.enable_operation()
    gbc.enable_limit_check()
}

test.before.each(() => {
    gbc.reset("configs/frames_robot.json")
    init_robot_test()
})

test("initial kc local position from joint angles is not rotated", async () => {
    assertNear(225, -10.962, 270.962, Math.PI / 4, 0, 0)
})

test("basic move_to_position in kc local coords", async () => {
    try {
        const move = gbc.wrap(
            gbc.activity
                .moveToPosition(100, 100, 100)
                // frameIndex 1 is robot
                .frameIndex(1).promise
        )
        await move.start().iterations(50).assertCompleted()
        assertNear(100, 100, 100, Math.PI / 4, 0, 0)
    } finally {
        gbc.plot("test")
    }
})

test("move_to_position with no frame index specified (use kc local)", async () => {
    try {
        // default frame index is zero
        const move = gbc.wrap(gbc.activity.moveToPosition(100, 100, 100).promise)
        await move.start().iterations(125).assertCompleted()
        assertNear(100, 100, 100, Math.PI / 4, 0, 0)
    } finally {
        gbc.plot("test")
    }
})

test("move_to_position with different frame index for target", async () => {
    try {
        // default frame index is zero
        const move = gbc.wrap(
            gbc.activity
                .moveToPosition(200, 100, 100)
                // world frame index
                .frameIndex(0).promise
        )
        await move.start().iterations(125).assertCompleted()

        gbc.assert.near(px, 100) // because frame is translated by 100 in X
        gbc.assert.near(py, 141.421)
        gbc.assert.near(pz, 0.001)
        assertNearWorld(200, 100, 100, Math.PI / 2, 0, 0)
    } finally {
        gbc.plot("test")
    }
})

test("move_to_position in world frame with rotation", async () => {
    try {
        // default frame index is zero
        gbc.disable_limit_check()
        const move = gbc.wrap(
            gbc.activity
                .moveToPosition(200, 100, 100)
                .rotationEuler(-Math.PI / 4, 0, 0)
                // world frame index
                .frameIndex(0).promise
        )
        await move.start().iterations(125).assertCompleted()

        gbc.assert.near(px, 100, 0.01) // because frame is translated by 100 in X
        gbc.assert.near(py, 141.421)
        gbc.assert.near(pz, 0.001)
        assertNearWorld(200, 100, 100, -Math.PI / 4, 0, 0)
    } finally {
        gbc.plot("test")
    }
})

test("move rotation at velocity in kc frame", async () => {
    // initial position
    assertNear(225, -10.962, 270.962, Math.PI / 4, 0, 0)

    try {
        // gbc.disable_limit_check()
        const move = gbc.wrap(
            gbc.activity
                // frame 3 is rotated 90 around X,
                // so a move in Y in local frame is a move in -Z in default (world) frame
                .moveRotationAtVelocity(1, 0, 0)
                .params({
                    amaxPercentage: 10,
                    vmaxPercentage: 10,
                    jmaxPercentage: 10
                }).promise
        )
        move.start().iterations(125)
        await do_cancel(move, 3, 100)

        gbc.assert.near(px, 225, 0.01)
        gbc.assert.near(py, -10.962, 0.01)
        gbc.assert.near(pz, 270.962, 0.01)
        // assertNearWorld(200, 100, 100, -Math.PI / 4, 0, 0)
    } finally {
        gbc.plot("test")
    }
})

export const frames_robot = test
