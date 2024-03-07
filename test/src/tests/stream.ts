/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { STREAMCOMMAND, STREAMSTATE } from "../../../libs/store/src"
import { StreamingActivityApi } from "../../../libs/store/src/stream/api"
import * as assert from "assert"

const test = uvu.suite("stream")

test.before.each(ctx => {
    console.log(ctx.__test__)
    gbc.reset()
    gbc.enable_operation()
    // gbc.set_fro(0, 100)
})

const capacity = state => state.stream[0].capacity
const state = state => state.stream[0].state
const tag = state => state.stream[0].tag
const readCount = state => state.stream[0].readCount
const writeCount = state => state.stream[0].writeCount

test("can see state of stream queue", async () => {
    gbc.assert
        .selector(capacity, gbc.m4_stream_total_cap)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)
        .assert.selector(tag, 0)
        .assert.selector(readCount, 0)
        .assert.selector(writeCount, 0)
})

test("can execute empty program", async () => {
    const end_program = gbc.stream.endProgram().command

    gbc.enqueue([end_program]).exec(1)

    gbc.assert
        .selector(capacity, gbc.m4_stream_total_cap)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)
        .assert.selector(tag, 0)
        // should have taken item from stream
        .assert.selector(readCount, 1)
        .assert.selector(writeCount, 1)
})

test("can execute a dwell", async () => {
    const dwell = gbc.stream.dwell(20).command
    const end_program = gbc.stream.endProgram().command

    gbc.enqueue([dwell, end_program]).exec(1)

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
        .assert.selector(tag, 1)
})

test("can fill the m4 buffer", async () => {
    const number_to_stream = gbc.m4_stream_total_cap - 1
    const dwells = Array.from({ length: number_to_stream }).map(() => gbc.stream.dwell(1).command)
    const m7_queue_length = gbc.m7_stream_total_cap

    gbc.enqueue(dwells)

    gbc.assert
        .selector(capacity, 1) // most of buffer used up
        .assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)
        .assert.selector(tag, 0)
        // should have taken all items from stream (capacity not reached)
        .assert.selector(readCount, 0)
        .assert.selector(writeCount, number_to_stream)

    gbc.exec(1) // give m7 opportunity to read from shared buffer, still leaving many unread
        .assert.selector(capacity, m7_queue_length + 1)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)
        .assert.selector(tag, 0)
        // should have taken all items from stream (capacity not reached)
        .assert.selector(readCount, m7_queue_length) // items read to m7 capacity
        .assert.selector(writeCount, number_to_stream)

    const end_program = gbc.stream.endProgram().command
    gbc.enqueue([end_program]) // send end program
        .exec(5) // kick off
        .assert.selector(capacity, m7_queue_length + 5)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_ACTIVE)
        .assert.selector(tag, 5)

    gbc.exec(100) // finish off
        // should have taken all items from stream (capacity not reached)
        .assert.selector(capacity, gbc.m4_stream_total_cap)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)
        .assert.selector(readCount, number_to_stream + 1)
        .assert.selector(writeCount, number_to_stream + 1)
        .assert.selector(tag, number_to_stream)
})

test("will start executing when m7 buffer is full", () => {
    const dwells1 = Array.from({ length: 10 }).map(() => gbc.stream.dwell(8).command)
    const dwells2 = Array.from({ length: 10 }).map(() => gbc.stream.dwell(8).command)

    gbc.assert // was issue with reset, so let's do some extra checking at start
        .selector(capacity, gbc.m4_stream_total_cap)
        .assert.selector(readCount, 0)
        .assert.selector(writeCount, 0)

    // we can't stream down 20 dwells all at once because m4 buffer is not large enough
    gbc.enqueue(dwells1).exec(1) // the exec pulls from shared queue onto internal queue
    gbc.enqueue(dwells2).exec(1)

    // note that we never send end program
    gbc.assert
        .selector(capacity, gbc.m4_stream_total_cap - 10) // at this point we have pretty much max'd out the internal m7 queue and the m4 queue
        .assert.selector(state, STREAMSTATE.STREAMSTATE_ACTIVE)

    gbc.exec(10)
        .assert.selector(capacity, gbc.m4_stream_total_cap - 5) // we have now managed to clear some of the backlog so m4 queue is opening up again
        .assert.selector(state, STREAMSTATE.STREAMSTATE_ACTIVE)

    gbc.exec(30)
        .assert.selector(capacity, gbc.m4_stream_total_cap) // all items processed, so back to full queue
        .assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)
})

test("can stream one program after another", () => {
    const dwells1 = Array.from({ length: 5 }).map(() => gbc.stream.dwell(8).command)
    const dwells2 = Array.from({ length: 5 }).map(() => gbc.stream.dwell(8).command)

    // exec first program to completion
    gbc.enqueue([...dwells1, gbc.stream.endProgram().command])
        .exec(5)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_ACTIVE)
        .exec(10)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)

    // stream next program
    gbc.enqueue(dwells2)
        .exec(5) // should not start until end program
        .assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)

    // end next program and exec to completion
    gbc.enqueue([gbc.stream.endProgram().command])
        .exec(5)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_ACTIVE)
        .exec(10)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)
})

test("can command stream to stop", () => {
    const capacity = state => state.stream[1].capacity
    const state = state => state.stream[1].state
    const tag = state => state.stream[1].tag
    const readCount = state => state.stream[1].readCount
    const writeCount = state => state.stream[1].writeCount

    const dwells1 = Array.from({ length: 10 }).map(() => gbc.stream.dwell(40).command)
    const dwells2 = Array.from({ length: 10 }).map(() => gbc.stream.dwell(5).command)

    gbc.enqueue(dwells1, 1).exec(5)
    gbc.assert
        // all items have been taken onto the m7 queue, so m4 queue is empty
        .selector(capacity, gbc.m4_stream_total_cap)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_ACTIVE)
        .assert.selector(tag, 1)
        .assert.selector(readCount, 10)
        .assert.selector(writeCount, 10)

    gbc.enqueue(dwells2, 1).exec(5)
    gbc.assert
        .selector(state, STREAMSTATE.STREAMSTATE_ACTIVE)
        .assert.selector(tag, 1) // still on first dwell
        .assert.selector(readCount, 10)
        .assert.selector(writeCount, 20)

    // now we ask the stream to stop
    gbc.streamCommand(STREAMCOMMAND.STREAMCOMMAND_STOP, 1)
        .exec(2)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_STOPPED)
        .exec(2)
        .assert.selector(capacity, gbc.m4_stream_total_cap)
})

test("can stop stream during move", () => {
    const move = gbc.stream.moveLine(100, 100, 100).command
    const endProgram = gbc.stream.endProgram().command

    gbc.disable_limit_check() // TODO: we are exceeding joint limit when ramping down fro
    gbc.enqueue([move, endProgram]).exec(15)
    gbc.assert.selector(state, STREAMSTATE.STREAMSTATE_ACTIVE).assert.selector(tag, 1)

    // command the stream to stop
    gbc.streamCommand(STREAMCOMMAND.STREAMCOMMAND_STOP)
        .exec(5)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_STOPPING)
        .exec(25) // it takes a while to shift the fro to zero
        .assert.selector(state, STREAMSTATE.STREAMSTATE_STOPPED)

    // move was not complete when stream stopped, but has now been removed from the queue so stream should be idle
    gbc.streamCommand(STREAMCOMMAND.STREAMCOMMAND_RUN)
        .exec(2)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)
})

export const stream = test
