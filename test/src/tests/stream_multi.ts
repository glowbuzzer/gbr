/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { STREAMSTATE } from "../../../libs/store/src"
import * as assert from "uvu/assert"

const test = uvu.suite("stream-multi")

test.before.each(ctx => {
    console.log(ctx.__test__)
    gbc.reset()
    gbc.enable_operation()
})

const capacity = state => state.stream[1].capacity
const state = state => state.stream[1].state
const tag = state => state.stream[1].tag
const readCount = state => state.stream[1].readCount
const writeCount = state => state.stream[1].writeCount

test("can execute empty program", async () => {
    const end_program = gbc.activity.endProgram().command

    gbc.stream([end_program], 1).exec(1)

    gbc.assert
        .selector(capacity, gbc.m4_stream_total_cap)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)
        .assert.selector(tag, 0)
        // should have taken item from stream
        .assert.selector(readCount, 1)
        .assert.selector(writeCount, 1)
})

test("can execute a dwell", async () => {
    const dwell = gbc.activity.dwell(5).command
    const end_program = gbc.activity.endProgram().command

    gbc.stream([dwell, end_program], 1).exec(1)

    gbc.assert
        .selector(capacity, gbc.m4_stream_total_cap)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)
        .assert.selector(tag, 0)
        // should have taken all items from stream (capacity not reached)
        .assert.selector(readCount, 2)
        .assert.selector(writeCount, 2)

    gbc.exec(3) // part way through dwell
        .assert.selector(state, STREAMSTATE.STREAMSTATE_ACTIVE)
        .assert.selector(tag, 1)

    gbc.exec(3) // dwell complete, all done
        .assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)
        .assert.selector(tag, 0)
})

test("can stream one program after another, end program is required", () => {
    const dwells1 = Array.from({ length: 5 }).map(() => gbc.activity.dwell(2).command)
    const dwells2 = Array.from({ length: 5 }).map(() => gbc.activity.dwell(2).command)

    const capacity = state => state.stream[0].capacity
    const state = state => state.stream[0].state
    const tag = state => state.stream[0].tag
    const readCount = state => state.stream[0].readCount
    const writeCount = state => state.stream[0].writeCount

    // exec first program to completion
    gbc.stream([...dwells1, gbc.activity.endProgram().command], 0)
        .exec(5)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_ACTIVE)
        .exec(10)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)

    // stream next program
    gbc.stream(dwells2, 0)
        .exec(3) // should not start until end program
        .assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)

    // end next program and exec to completion
    gbc.stream([gbc.activity.endProgram().command], 0)
        .exec(3)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_ACTIVE)
        .exec(10)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)
})

test("can stream one program after another, end program not required", () => {
    const dwells1 = Array.from({ length: 5 }).map(() => gbc.activity.dwell(2).command)
    const dwells2 = Array.from({ length: 5 }).map(() => gbc.activity.dwell(2).command)

    // exec first program to completion
    gbc.stream(dwells1, 1)
        .exec(5)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_ACTIVE)
        .exec(10)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)

    gbc.stream(dwells2, 1)
        .exec(5)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_ACTIVE)
        .exec(10)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)
})

export const stream_multi = test
