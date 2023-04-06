/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { createSlice, Slice } from "@reduxjs/toolkit"
import { Dispatch } from "redux"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import {
    ActivityStreamItem,
    GlowbuzzerKinematicsConfigurationStatus,
    STREAMCOMMAND,
    STREAMSTATE
} from "../gbc"
import { MachineState } from "../machine"
import { RootState } from "../root"
import { useConnection } from "../connect"
import { StreamingActivityApi } from "./api"
import { useEffect, useMemo } from "react"
import { useDefaultMoveParameters } from "../config"
import { ActivityApi } from "../activity"

// there is one of these per stream configured
export type StreamSliceType = {
    ready: boolean
    paused: boolean
    capacity: number
    buffer: ActivityStreamItem[]
    pending: number
    state: STREAMSTATE
    time: number
    readCount: number
    writeCount: number
    lastWriteCount: number
    writePending: boolean
    tag: number
    // settings: GCodeSettingsType
}

const DEFAULT_STREAM_STATE: StreamSliceType = {
    ready: false as boolean,
    paused: false as boolean,
    capacity: 0,
    buffer: [] as ActivityStreamItem[],
    pending: 0,
    state: STREAMSTATE.STREAMSTATE_IDLE,
    time: 0,
    readCount: -1,
    writeCount: 0,
    lastWriteCount: -1,
    writePending: false,
    tag: 0
}

function changed(state, status) {
    for (const key of Object.keys(status)) {
        if (key === "capacity" || key === "time") {
            continue
        }
        if (state[key] !== status[key]) {
            return true
        }
    }
    return false
}

export const streamSlice: Slice<StreamSliceType[]> = createSlice({
    name: "stream",
    initialState: [DEFAULT_STREAM_STATE], // we need a single stream on startup to avoid errors
    reducers: {
        init(state, action) {
            // payload is array containing stream status per configured stream (which corresponds to kc)
            return action.payload.map((status: GlowbuzzerKinematicsConfigurationStatus) => {
                return {
                    ...DEFAULT_STREAM_STATE,
                    ready: true
                }
            })
        },
        append(state, action) {
            // add to back of queue
            const { streamIndex, buffer } = action.payload
            state[streamIndex].buffer.push(...buffer)
            state[streamIndex].pending += buffer.length
        },
        consume(state, action) {
            // remove requested count from the front of the queue
            const { streamIndex, count } = action.payload
            if (count === 0) {
                state[streamIndex].lastWriteCount = -1
                state[streamIndex].writePending = false
            } else {
                // remove sent items from buffer queue
                state[streamIndex].buffer.splice(0, count)
                // reduce capacity of control (until new capacity status update)
                state[streamIndex].capacity -= count
                state[streamIndex].pending = state[streamIndex].buffer.length
                state[streamIndex].lastWriteCount = state[streamIndex].writeCount
                state[streamIndex].writePending = true
            }
        },
        reset(state, action) {
            const streamIndex = action.payload
            state[streamIndex].buffer.length = 0
            state[streamIndex].readCount = -1
            state[streamIndex].writeCount = 0
            state[streamIndex].lastWriteCount = -1
            state[streamIndex].writePending = false
            state[streamIndex].paused = false
            state[streamIndex].pending = 0
        },
        status: (state, action) => {
            const status = action.payload
            return status.map((update, streamIndex) => {
                const current = state[streamIndex] || DEFAULT_STREAM_STATE
                return changed(current, update) ? { ...current, ...update } : current
            })
        },
        pause: (state, action) => {
            const streamIndex = action.payload
            state[streamIndex].paused = true
        },
        resume: (state, action) => {
            const streamIndex = action.payload
            state[streamIndex].paused = false
        }
    }
})

export const StreamHandler = {
    update(
        dispatch: Dispatch,
        streamIndex: number,
        state: StreamSliceType,
        machineState: MachineState,
        send: (any) => void
    ) {
        if (machineState !== MachineState.OPERATION_ENABLED) {
            // not enabled, so clear down buffer and return
            dispatch(streamSlice.actions.reset(streamIndex))
            return
        }
        const { paused, buffer, capacity } = state
        if (state.lastWriteCount !== state.writeCount) {
            if (buffer.length === 0) {
                if (state.writePending) {
                    // we've cleared the buffer, and write has been seen, so reset the write pending flag
                    dispatch(streamSlice.actions.consume({ streamIndex, count: 0 }))
                }
            } else {
                // buffer is not empty, so we need to send the next slice
                if (!paused && capacity > 0) {
                    const items = buffer.slice(0, capacity)
                    send(items)
                    dispatch(streamSlice.actions.consume({ streamIndex, count: items.length }))
                    return
                }
            }
        }
    }
}

export function updateStreamCommandMsg(streamIndex: number, streamCommand: STREAMCOMMAND) {
    return JSON.stringify({
        command: {
            stream: {
                [streamIndex]: {
                    command: {
                        streamCommand
                    }
                }
            }
        }
    })
}

export function updateAllStreams(status: any[], streamCommand: STREAMCOMMAND) {
    const streams = status.map((_, i) => ({
        [i]: {
            command: {
                streamCommand
            }
        }
    }))
    return JSON.stringify({
        command: {
            stream: {
                ...streams
            }
        }
    })
}

/**
 * Provides access to the streamed activity API and the current state of the stream.
 *
 * The stream is a queue of activities that are sent to the machine. As each activity is completed the next activity is started, in real time.
 * Each activity is tagged with a unique number that is used to identify the activity when it is completed.
 * It is important that the capacity of the stream is not exceeded.
 *
 * The stream will normally run automatically, but can be stopped, paused and resumed using the sendCommand method.
 *
 * The send method is used to send activities to the stream. It takes a callback that receives an {@link ActivityApi}.
 * The api provides factory methods for creating activities, each of which has a `promise` method. The callback should return an
 * array of these promises. Each of the individual promises will be resolved when an activity completes.
 * In addition the send method itself returns a promise that resolves when all the activities have completed.
 *
 * Example:
 * ```
 * const { send } = useStream(0)
 * await send(api => [
 *    api.moveLine(10,0,0).promise(),
 *    api.moveLine(10,10,0).promise().then(() => console.log("starting arc")),
 *    api.moveArc(0,0,0).centre(10,0,0).direction(ARCDIRECTION.CCW).promise()
 * ])
 *
 * ```
 *
 * @param streamIndex The index of the stream to use. This corresponds to the index of the kinematics configuration that will be used.
 */
export const useStream = (
    streamIndex: number
): {
    /** The current state of the stream execution */
    state: STREAMSTATE
    /** The time the stream has been active */
    time: number
    /** The tag of the currently executing stream item */
    tag: number
    /** The number of items that can be sent to the stream. You can stream more than this number but activities will be buffered client side until capacity becomes available. */
    capacity: number
    /** The number of items that are currently buffered on the client waiting to be sent */
    pending: number
    /** Send activities to the stream using the api */
    send(
        fn: (api: ActivityApi) => Promise<any>[]
    ): Promise<({ tag: number; completed: boolean } | void)[]>
    /** Send a stream command, for example pause, resume and cancel */
    sendCommand(state: STREAMCOMMAND)
    /** Reset the local stream queue */
    reset()
} => {
    const { state, tag, time, capacity, pending } = useSelector(
        (state: RootState) =>
            state.stream[streamIndex] || {
                state: STREAMSTATE.STREAMSTATE_IDLE,
                tag: 0,
                time: 0,
                capacity: 0,
                pending: 0
            },
        shallowEqual
    )
    const connection = useConnection()
    const dispatch = useDispatch()
    const defaultMoveParameters = useDefaultMoveParameters()

    const api = useMemo(
        () =>
            new StreamingActivityApi(streamIndex, defaultMoveParameters, activity => {
                dispatch(streamSlice.actions.append({ streamIndex, buffer: [activity] }))
            }),
        [streamIndex, dispatch]
    )

    useEffect(() => {
        api.updateStream(tag, state)
    }, [api, tag, state])

    return {
        state,
        time,
        tag,
        capacity,
        pending,
        send(factory: (api: ActivityApi) => Promise<any>[]) {
            return api.send(...factory(api))
        },
        sendCommand(streamCommand: STREAMCOMMAND) {
            connection.send(updateStreamCommandMsg(streamIndex, streamCommand))
        },
        reset() {
            dispatch(streamSlice.actions.reset(streamIndex))
        }
    }
}
