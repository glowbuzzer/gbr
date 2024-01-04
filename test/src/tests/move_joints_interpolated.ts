/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { STREAMSTATE } from "../../../libs/store/src"

const test = uvu.suite("joints")

function parse(str: string) {
    const data = str
        .trim()
        .split("\n")
        .map(line => {
            const [t, pos, vel] = line.trim().split("\t").map(Number)
            return { t, pos, vel }
        })

    return data.slice(1).map((d, i) => ({
        t: d.t,
        dur: d.t - data[i].t,
        pos: d.pos,
        vel: d.vel
    }))
}

const move1 = parse(`
    0\t0\t0
    0.1\t0.00517017\t0.103403
    0.2\t0.0206807\t0.206807
    0.3\t0.0465316\t0.31021
    0.4\t0.0827228\t0.413614
    0.5\t0.129043\t0.487431
    0.6\t0.172616\t0.384027
    0.7\t0.205848\t0.280624
    0.8\t0.22874\t0.17722
    0.9\t0.241292\t0.073817
    0.971387\t0.243927\t0
`)

const move2 = parse(`
0\t0.243927\t0
0.1\t0.242177\t-0.035
0.2\t0.236927\t-0.07
0.3\t0.228177\t-0.105
0.4\t0.215927\t-0.14
0.5\t0.200177\t-0.175
0.6\t0.180927\t-0.21
0.7\t0.158177\t-0.245
0.8\t0.131927\t-0.28
0.9\t0.102196\t-0.309837
1\t0.0729624\t-0.274837
1.1\t0.0472287\t-0.239837
1.2\t0.024995\t-0.204837
1.3\t0.00626131\t-0.169837
1.4\t-0.00897239\t-0.134837
1.5\t-0.0207061\t-0.099837
1.6\t-0.0289398\t-0.064837
1.7\t-0.0336735\t-0.029837
1.78525\t-0.0349453\t0
`)

test.before.each(() => {
    gbc.config().joints(1, { vmax: 200, amax: 4000, jmax: 80000 }).cartesianKinematics().finalize()

    gbc.enable_operation()
})

const stream_state = state => state.stream[0].state

test("can run joints interpolated - trivial case", async () => {
    // here we don't command any change in pos or vel, so there is nothing to do
    const activities = [
        gbc.stream.moveJointsInterpolated(0.1, [0], [0]).command,
        gbc.stream.endProgram().command
    ]
    gbc.enqueue(activities).exec(30).assert.selector(stream_state, STREAMSTATE.STREAMSTATE_IDLE)
})

test("can run joints interpolated - 100ms", async () => {
    try {
        const activities = move1.map(p => {
            const { dur, pos, vel } = p
            return gbc.stream.moveJointsInterpolated(dur, [pos], [vel]).command
        })
        activities.push(gbc.stream.endProgram().command)
        gbc.enqueue(activities)
            .exec(300)
            .assert.selector(stream_state, STREAMSTATE.STREAMSTATE_IDLE)
    } finally {
        gbc.plot("test")
    }
})

test("can run joints interpolated - 100ms - with fro change", async () => {
    try {
        const activities = move1.map(p => {
            const { dur, pos, vel } = p
            return gbc.stream.moveJointsInterpolated(dur, [pos], [vel]).command
        })
        activities.push(gbc.stream.endProgram().command)
        gbc.enqueue(activities).exec(100)
        gbc.set_fro(0, 0.62)
        gbc.exec(300).assert.selector(stream_state, STREAMSTATE.STREAMSTATE_IDLE)
    } finally {
        gbc.plot("test")
    }
})

test("can run two moves consecutively", async () => {
    try {
        const activities1 = move1.map(p => {
            const { dur, pos, vel } = p
            return gbc.stream.moveJointsInterpolated(dur, [pos], [vel]).command
        })
        const activities2 = move2.map(p => {
            const { dur, pos, vel } = p
            return gbc.stream.moveJointsInterpolated(dur, [pos], [vel]).command
        })
        const activities = [...activities1, ...activities2]
        activities.push(gbc.stream.endProgram().command)

        gbc.enqueue(activities)
            .exec(700)
            .assert.selector(stream_state, STREAMSTATE.STREAMSTATE_IDLE)
    } finally {
        gbc.plot("test")
    }
})

export const move_joints_interpolated = test
