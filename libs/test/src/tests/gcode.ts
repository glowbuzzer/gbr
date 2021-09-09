import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { ACTIVITYSTATE, STREAMSTATE } from "../../../store/src"

const test = uvu.suite("gcode")

const state = state => state.stream.state
const tag = state => state.stream.tag
const j = (joint, value) => state => Math.abs(state.status.joint[joint].actPos - value) < 0.0001

test.before.each(ctx => {
    console.log(ctx.__test__)
    gbc.reset()
    gbc.enable_operation()
    gbc.capture(true)
})

test("can execute basic gcode", async () => {
    gbc.send_gcode("G0 X1 Y1\nM2")
    gbc.exec(3)
    gbc.assert.selector(state, STREAMSTATE.STREAMSTATE_ACTIVE)
    gbc.exec(20)
    gbc.assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)
})

test.only("can execute two relative sequences", async () => {
    gbc.send_gcode(`
        G0 X1 Y1
        M2`)
    gbc.exec(25)
    gbc.assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)
})

test("doesn't blend rapid to line", async () => {
    try {
        gbc.send_gcode(`
                G64
                G0 X10 Y0
                G1 X10 Y10
                M2`)
            .assert.streamSequence(tag, [
            [5, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
            [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE], // this would be in blend
            [20, 3, ACTIVITYSTATE.ACTIVITY_ACTIVE],
            [45, 0, ACTIVITYSTATE.ACTIVITY_INACTIVE]
        ], true /* set to false to skip verify */).verify()
    } finally {
        gbc.plot("gcode-g0-to-g1")
    }
})

test("doesn't blend line to rapid", async () => {
    try {
        gbc.send_gcode(`
                G64
                G1 X10 Y0
                G0 X10 Y10
                M2`)
            .assert.streamSequence(tag, [
            [5, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE],
            [20, 2, ACTIVITYSTATE.ACTIVITY_ACTIVE], // this would be in blend
            [20, 3, ACTIVITYSTATE.ACTIVITY_ACTIVE],
            [45, 0, ACTIVITYSTATE.ACTIVITY_INACTIVE]
        ], true /* set to false to skip verify */).verify()
    } finally {
        gbc.plot("gcode-g1-to-g0")
    }
})

export const gcode = test
