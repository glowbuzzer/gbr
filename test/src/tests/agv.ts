import { gbc } from "../../gbc"
import * as uvu from "uvu"

const test = uvu.suite("agv")

test.before.each(ctx => {
    console.log(ctx.__test__)
    gbc.config()
        .joints(8)
        .agvKinematics(
            [0, 1, 2, 3].map(i => ({
                position: {
                    x: i % 2 === 0 ? -1 : 1,
                    y: i < 2 ? -1 : 1
                },
                radius: 2
            }))
        )
        .finalize()
    gbc.enable_operation()
    gbc.enable_limit_check()
    gbc.set_fro(0, 1)
})

test("can run agv in straight line without rotation", async () => {
    try {
        gbc.disable_limit_check()
        await gbc.run(api => api.moveLine(10, 0, 0))
    } finally {
        gbc.plot("test")
    }
})

test("can run agv rotation without move", async () => {
    try {
        gbc.disable_limit_check() // steering wheels will have discontinuity
        await gbc.run(api => api.moveLine(0, 0, 0).rotationEuler(0, 0, Math.PI / 2))
    } finally {
        gbc.plot("test")
    }
})

test("can run agv in straight line with correct wheel rotation", async () => {
    try {
        // our wheels have radius 2, so we expect the rotation to be 10/2 = 5 rads
        gbc.disable_limit_check()
        await gbc.run(api => api.moveLine(10, 0, 0))
        gbc.assert.near(s => s.status.joint[4].actPos, 5)
    } finally {
        gbc.plot("test")
    }
})

test("can run agv rotation around center with correct wheel rotation", async () => {
    try {
        // wheels radius 2, positions [-1,-1], [-1,1], [1,-1], [1,1]
        // length of arc for 90 deg rotation is 2 * pi * sqrt(2) / 4 = 1/2 * pi * sqrt(2)
        gbc.disable_limit_check()
        await gbc.run(api => api.moveLine(0, 0, 0).rotationEuler(0, 0, Math.PI / 2))

        const arclen = (Math.PI * Math.sqrt(2)) / 2
        gbc.assert.near(
            s => s.status.joint[4].actPos,
            arclen / 2 /* because radius of wheels is 2 */
        )
    } finally {
        gbc.plot("test")
    }
})

test("can run agv rotation at velocity", async () => {
    try {
        gbc.disable_limit_check() // steering wheels will have discontinuity
        const move = gbc.wrap(gbc.activity.moveRotationAtVelocity(0, 0, 1).promise)
        move.start()
        move.iterations(50)
        gbc.assert.near(s => s.status.joint[0].actPos, -Math.PI / 4)
    } finally {
        gbc.plot("test")
    }
})

test("can run agv rotation counterclockwise at velocity", async () => {
    try {
        gbc.disable_limit_check() // steering wheels will have discontinuity
        const move = gbc.wrap(gbc.activity.moveRotationAtVelocity(0, 0, -1).promise)
        move.start()
        move.iterations(50)
        gbc.assert.near(s => s.status.joint[0].actPos, (3 * Math.PI) / 4)
    } finally {
        gbc.plot("test")
    }
})

test("can run agv move with rotation", async () => {
    try {
        gbc.disable_limit_check() // steering wheels will have discontinuity
        await gbc.run(api => api.moveLine(0.1, 0, 0).rotationEuler(0, 0, Math.PI * 1.9))
    } finally {
        gbc.plot("test")
    }
})

test("can run agv rotation followed by linear move with correct wheel angles (positive initial rotation)", async () => {
    try {
        gbc.disable_limit_check() // steering wheels will have discontinuity
        // rotate 45 degrees
        await gbc.run(api => api.moveLine().rotationEuler(0, 0, Math.PI / 4))
        await gbc.run(api => api.moveLine(10, 0, 0))

        // the steering angles should counteract the initial rotation
        gbc.assert.near(s => s.status.joint[0].actPos, -Math.PI / 4)
    } finally {
        gbc.plot("test")
    }
})

test("can run agv rotation followed by linear move with correct wheel angles (negative initial rotation)", async () => {
    try {
        gbc.disable_limit_check() // steering wheels will have discontinuity
        await gbc.run(api => api.moveLine().rotationEuler(0, 0, -Math.PI / 4))
        await gbc.run(api => api.moveLine(10, 0, 0))

        // the steering angles should counteract the initial rotation
        gbc.assert.near(s => s.status.joint[0].actPos, Math.PI / 4)
    } finally {
        gbc.plot("test")
    }
})

test("can run agv forward, set initial position and continue", async () => {
    try {
        gbc.disable_limit_check() // steering wheels will have discontinuity

        await gbc.run(api => api.moveLine(10, 0, 0))
        gbc.assert.near(s => s.status.joint[4].actPos, 5)

        await gbc.run(api => api.setInitialPosition(0, 0, 0).rotationEuler(0, 0, 0))
        gbc.assert.near(s => s.status.kc[0].position.translation.x, 0)

        await gbc.run(api => api.moveLine(10, 0, 0))
        // joints weren't reset, so we expect cumulative wheel rotation
        gbc.assert.near(s => s.status.joint[4].actPos, 10)
    } finally {
        gbc.plot("test")
    }
})

test.only("can run agv forward and back and maintain steering joint angles", async () => {
    try {
        gbc.disable_limit_check() // steering wheels will have discontinuity

        await gbc.run(api => api.moveLine(10, 0, 0))
        gbc.assert.near(s => s.status.joint[0].actPos, 0)
        gbc.assert.near(s => s.status.joint[4].actPos, 5)

        // we expect steering angle to stay the same and the wheel to run in reverse
        await gbc.run(api => api.moveLine(0, 0, 0))
        gbc.assert.near(s => s.status.joint[0].actPos, 0)
        gbc.assert.near(s => s.status.joint[4].actPos, 0)
    } finally {
        gbc.plot("test")
    }
})

export const agv = test
