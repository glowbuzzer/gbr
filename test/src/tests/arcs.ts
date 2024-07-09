/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { ARCDIRECTION, STREAMSTATE } from "../../../libs/store/src"
import { assertNear, do_cancel } from "../util"

const test = uvu.suite("arcs")

const ROOT_5 = Math.sqrt(0.5)

test.before.each(ctx => {
    console.log(ctx.__test__)
    gbc.config()
        .joints(3)
        // .joints(3, {
        //     vmax: 3000,
        //     amax: 1000000,
        //     jmax: 300000000
        // })
        .cartesianKinematics()
        .addFrame({
            // for testing arc in rotated frame
            rotation: {
                x: 0.7071068,
                y: 0,
                z: 0,
                w: 0.7071068
            }
        })
        .addFrame({
            // for testing arc plane switch in different frame
            translation: {
                x: 20,
                y: 0,
                z: 0
            }
        })
        .finalize()
    gbc.enable_operation()
    // arcs exceed limits slightly and we aren't testing limits here
    gbc.enable_limit_check(1.5)
    gbc.set_fro(0, 1)
})

const py = state => state.status.kc[0].position.translation.y

test("can run move arc to completion", async () => {
    try {
        await gbc.run(api =>
            api
                .moveArc()
                .translation(1, 1, 0)
                .centre(0, 1, 0)
                .direction(ARCDIRECTION.ARCDIRECTION_CCW)
        )
    } finally {
        gbc.plot("test")
    }
})

test("can run move arc in radius mode", async () => {
    try {
        await gbc.run(api =>
            api.moveArc().translation(1, 1, 0).radius(1).direction(ARCDIRECTION.ARCDIRECTION_CCW)
        )
    } finally {
        gbc.plot("arc-primitive-radius-mode")
    }
})

test("can run move arc in radius mode with negative radius", async () => {
    try {
        await gbc.run(api =>
            api.moveArc().translation(1, 1, 0).radius(-1).direction(ARCDIRECTION.ARCDIRECTION_CCW)
        )
    } finally {
        gbc.plot("arc-primitive-radius-mode-negative")
    }
})

test("can run move arc to completion (quadrant 2)", async () => {
    try {
        await gbc.run(api =>
            api
                .moveArc()
                .translation(-1, 1, 0)
                .centre(-1, 0, 0)
                .direction(ARCDIRECTION.ARCDIRECTION_CCW)
        )
    } finally {
        gbc.plot("arc-primitive-quad-2")
    }
})

test("can run move arc to completion (quadrant 3)", async () => {
    try {
        await gbc.run(api =>
            api
                .moveArc()
                .translation(-1, -1, 0)
                .centre(0, -1, 0)
                .direction(ARCDIRECTION.ARCDIRECTION_CCW)
        )
    } finally {
        gbc.plot("arc-primitive-quad-3")
    }
})

test("can run move arc to completion (quadrant 4)", async () => {
    try {
        await gbc.run(api =>
            api
                .moveArc()
                .translation(1, -1, 0)
                .centre(1, 0, 0)
                .direction(ARCDIRECTION.ARCDIRECTION_CCW)
        )
    } finally {
        gbc.plot("arc-primitive-quad-4")
    }
})

test("can run arc with same start and end point (full circle)", async () => {
    try {
        await gbc.run(api =>
            api
                .moveArc()
                .translation(0, 0, 0)
                .centre(15, 0, 0)
                .direction(ARCDIRECTION.ARCDIRECTION_CCW)
        )
    } finally {
        gbc.plot("arc-primitive-full-circle")
    }
})

test("can run tiny arc (large jmax) full circle", async () => {
    try {
        await gbc.run(api =>
            api
                .moveArc()
                .translation(0, 0, 0)
                .centre(1, 0, 0)
                .direction(ARCDIRECTION.ARCDIRECTION_CCW)
        )
    } finally {
        gbc.plot("arc-primitive-full-circle-small")
    }
})

test("can cancel move arc", async () => {
    const move = gbc.wrap(
        gbc.activity
            .moveArc()
            .translation(1, 1, 0)
            .centre(0, 1, 0)
            .direction(ARCDIRECTION.ARCDIRECTION_CCW).promise
    )
    await do_cancel(move)
})

test("move_arc in rotated frame (local xy-plane)", async () => {
    try {
        // kc frame index is zero (no translation): start position is 10,10,0 kc local
        gbc.set_joints(10, 10, 0)
        assertNear(10, 10, 0, 0, 0, 0)
        const move = gbc.wrap(
            gbc.activity
                // we want to end up at 0,10 in target frame
                // frame 1 is rotated 90deg in X
                // so we are at 10,0,-10 in target frame
                .moveArc(0, 10, null)
                .radius(10)
                .frameIndex(1).promise
        )
        // run roughly half of the arc
        move.start().iterations(50)
        // move start is 10 in y (kc frame)
        // arc is in xy (target frame) and this is rotated 90 around x,
        // so arc runs xz in kc frame and y doesn't change
        gbc.assert.near(py, 10)
        // run rest of arc
        await move.iterations(50).assertCompleted()

        assertNear(0, 10, 10, 0, 0, 0)
    } finally {
        gbc.plot("test")
    }
})

test("move_arc in rotated frame (planar rotation specified)", async () => {
    // we want to specify the end point in our current frame, but have the move
    // executed with a rotation, ie. run the arc outside the XY plane
    try {
        gbc.set_joints(10, 0, 0)
        const move = gbc.wrap(
            gbc.activity.moveArc(0, 0, 10).radius(10).plane(ROOT_5, 0, 0, ROOT_5).promise
        )
        // run roughly half of the arc
        move.start().iterations(50)
        // we're not moving in y because we're in the XY plane
        gbc.assert.near(py, 0)
        // run rest of arc
        await move.iterations(50).assertCompleted()

        assertNear(0, 0, 10, 0, 0, 0)
    } finally {
        gbc.plot("test")
    }
})

// test("move_arc in different plane goes in expected direction", async () => {
//     try {
//         gbc.set_joints(10, 0, 0)
//         const move = gbc.wrap(
//             gbc.activity.moveArc(0, 0, 10).radius(10).plane(0, ROOT_5, 0, ROOT_5).promise
//         )
//         // run roughly half of the arc
//         move.start().iterations(50)
//         // we're not moving in y because we're in the XY plane
//         gbc.assert.near(py, 0)
//         // run rest of arc
//         await move.iterations(50).assertCompleted()
//
//         assertNear(0, 0, 10, 0, 0, 0)
//     } finally {
//         gbc.plot("test")
//     }
// })

test("move_arc in translated and rotated frame (planar rotation specified)", async () => {
    // we want to specify the end point in our current frame, but have the move
    // executed with a rotation, ie. run the arc outside the XY plane
    try {
        gbc.set_joints(20, 0, 0)
        const move = gbc.wrap(
            gbc.activity.moveArc(10, 0, 10).radius(10).frameIndex(2).plane(ROOT_5, 0, 0, ROOT_5)
                .promise
        )
        // run roughly half of the arc
        move.start().iterations(50)
        // we're not moving in y because we're in the XY plane
        gbc.assert.near(py, 0)
        // run rest of arc
        await move.iterations(50).assertCompleted()

        assertNear(30, 0, 10, 0, 0, 0)
    } finally {
        gbc.plot("test")
    }
})

test("move arc when kc frame is non-zero and plane is specified", async () => {
    gbc.config()
        .joints(3)
        .cartesianKinematics(1)
        .addFrame({
            translation: {
                x: 100
            }
        })
        .finalize()
        .enable_operation()
        .enable_limit_check(1.5)

    try {
        await gbc.run(api => api.moveToPosition(10, 0, 0))
        await gbc.run(api => api.moveArc(0, 10, 0).centre(0, 0, 0).plane(0, 1, 0, 0))
    } finally {
        gbc.plot("test")
    }
})

test("move_arc using gcode in rotated frame", async () => {
    const state = state => state.stream[0].state
    const pos = joint => state => state.status.joint[joint].actPos

    gbc.set_joints(10, 10, 0)
    try {
        gbc.send_gcode(`
        g55
        g1 x30 y0 z20
        g2 i-30 x0 y-30
        m2`)
        gbc.exec(160)
        gbc.assert
            .selector(state, STREAMSTATE.STREAMSTATE_IDLE, "stream state not idle")
            .assert.near(pos(0), 0)
            .assert.near(pos(1), -20)
            .assert.near(pos(2), -30)
    } finally {
        gbc.plot("test")
    }
})

export const arcs = test
