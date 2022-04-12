import * as uvu from "uvu"
import { gbc } from "../../gbc"
import { STREAMSTATE } from "../../../libs/store/src"

const test = uvu.suite("stream")

test.before.each(ctx => {
    console.log(ctx.__test__)
    gbc.reset()
    gbc.enable_operation()
    // gbc.set_fro(0, 100)
})

const capacity = state => state.stream.capacity
const state = state => state.stream.state
const tag = state => state.stream.tag
const readCount = state => state.stream.readCount
const writeCount = state => state.stream.writeCount

test("can see state of stream queue", async () => {
    gbc.assert
        .selector(capacity, gbc.m4_stream_total_cap)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)
        .assert.selector(tag, 0)
        .assert.selector(readCount, 0)
        .assert.selector(writeCount, 0)
})

test("can execute empty program", async () => {
    const end_program = gbc.activity.endProgram().command

    gbc.stream([end_program]).exec(1)

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

    gbc.stream([dwell, end_program]).exec(1)

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

test("can fill the m4 buffer", async () => {
    const number_to_stream = gbc.m4_stream_total_cap - 1
    const dwells = Array.from({ length: number_to_stream }).map(() => gbc.activity.dwell(1).command)

    gbc.stream(dwells)

    gbc.assert
        .selector(capacity, 1) // most of buffer used up
        .assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)
        .assert.selector(tag, 0)
        // should have taken all items from stream (capacity not reached)
        .assert.selector(readCount, 0)
        .assert.selector(writeCount, number_to_stream)

    gbc.exec(1) // give m7 opportunity to read from shared buffer
        .assert.selector(capacity, gbc.m7_stream_total_cap + 1)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)
        .assert.selector(tag, 0)
        // should have taken all items from stream (capacity not reached)
        .assert.selector(readCount, gbc.m7_stream_total_cap) // items read to m7 capacity
        .assert.selector(writeCount, number_to_stream)

    const end_program = gbc.activity.endProgram().command
    gbc.stream([end_program]) // send end program
        .exec(5) // kick off
        .assert.selector(capacity, gbc.m4_stream_total_cap)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_ACTIVE)
        .assert.selector(tag, 5)
        // should have taken all items from stream (capacity not reached)
        .assert.selector(readCount, number_to_stream + 1)
        .assert.selector(writeCount, number_to_stream + 1)

    gbc.exec(10) // finish off
        .assert.selector(capacity, gbc.m4_stream_total_cap)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)
        .assert.selector(tag, 0)
})

test("will start executing when m7 buffer is full", () => {
    const dwells1 = Array.from({ length: 10 }).map(() => gbc.activity.dwell(2).command)
    const dwells2 = Array.from({ length: 10 }).map(() => gbc.activity.dwell(2).command)

    gbc.assert // was issue with reset, so let's do some extra checking at start
        .selector(capacity, gbc.m4_stream_total_cap)
        .assert.selector(readCount, 0)
        .assert.selector(writeCount, 0)

    // we can't stream down 20 dwells all at once because m4 buffer is not large enough
    gbc.stream(dwells1).exec(1) // the exec pulls from shared queue onto internal queue
    gbc.stream(dwells2).exec(1)

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
    const dwells1 = Array.from({ length: 5 }).map(() => gbc.activity.dwell(2).command)
    const dwells2 = Array.from({ length: 5 }).map(() => gbc.activity.dwell(2).command)

    // exec first program to completion
    gbc.stream([...dwells1, gbc.activity.endProgram().command])
        .exec(5)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_ACTIVE)
        .exec(10)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)

    // stream next program
    gbc.stream(dwells2)
        .exec(5) // should not start until end program
        .assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)

    // end next program and exec to completion
    gbc.stream([gbc.activity.endProgram().command])
        .exec(5)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_ACTIVE)
        .exec(10)
        .assert.selector(state, STREAMSTATE.STREAMSTATE_IDLE)
})

export const stream = test
