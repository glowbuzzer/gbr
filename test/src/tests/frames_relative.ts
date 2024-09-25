/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { assertNear } from "../util"

const test = uvu.suite("frames relative")

// const px = state => state.status.kc[0].position.translation.x
// const py = state => state.status.kc[0].position.translation.y
// const pz = state => state.status.kc[0].position.translation.z

/**
 * These tests check that relative frame handling works correctly
 */

test.before.each(() => {
    gbc.config()
        .joints(3, {
            vmax: 200,
            amax: 4000,
            jmax: 80000
        })
        .addFrame({
            translation: {
                x: 10
            }
        })
        .addFrame({
            translation: {
                x: 10
            },
            parentFrameIndex: 1,
            positionReference: 1
        })
        .cartesianKinematics(2, {
            vmax: 200,
            amax: 4000,
            jmax: 80000
        })
        .finalize()

    gbc.enable_operation()
})

test("initial kc local position", async () => {
    assertNear(0, 0, 0, 0, 0, 0)
})

test("move_to_position in kc world coords", async () => {
    try {
        const move = gbc.wrap(
            // same frame index as robot
            gbc.activity.moveToPosition(10, 0, 0).frameIndex(0).promise
        )
        await move.start().iterations(100).assertCompleted()
        assertNear(-10, 0, 0, 0, 0, 0)
    } finally {
        gbc.plot("test")
    }
})

export const frames_relative = test
