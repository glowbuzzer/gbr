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
import { updateStreamStateMsg } from "../gcode"

// there is one of these per stream configured
type StreamSliceType = {
    ready: boolean
    current_positions: number[]
    paused: boolean
    capacity: number
    buffer: ActivityStreamItem[]
    state: STREAMSTATE
    time: number
    readCount: number
    writeCount: number
    tag: number
    // settings: GCodeSettingsType
}

const DEFAULT_STREAM_STATE: StreamSliceType = {
    ready: false as boolean,
    current_positions: [] as number[],
    paused: false as boolean,
    capacity: 0,
    buffer: [] as ActivityStreamItem[],
    state: STREAMSTATE.STREAMSTATE_IDLE,
    time: 0,
    readCount: -1,
    writeCount: -1,
    tag: 0
    // settings: {
    //     sendEndProgram: true
    // }
}

export const streamSlice: Slice<StreamSliceType[]> = createSlice({
    name: "stream",
    initialState: [DEFAULT_STREAM_STATE], // we need a single stream on startup to avoid errors
    reducers: {
        init(state, action) {
            // payload is array containing stream status per configured stream (which corresponds to kc)
            return action.payload.map((status: GlowbuzzerKinematicsConfigurationStatus) => {
                const { x, y, z } = status.position.translation
                return {
                    ...DEFAULT_STREAM_STATE,
                    current_positions: [x, y, z],
                    ready: true
                }
            })
        },
        append(state, action) {
            // add to back of queue
            const { kinematicsConfigurationIndex, buffer } = action.payload
            state[kinematicsConfigurationIndex].buffer.push(...buffer)
        },
        consume(state, action) {
            // remove requested count from the front of the queue
            const { streamIndex, count } = action.payload
            // remove sent items from buffer queue
            state[streamIndex].buffer.splice(0, count)
            // reduce capacity of control (until new capacity status update)
            state[streamIndex].capacity -= count
        },
        reset(state, action) {
            const streamIndex = action.payload
            state[streamIndex].buffer.length = 0
            state[streamIndex].readCount = -1
            state[streamIndex].writeCount = -1
            state[streamIndex].paused = false
        },
        status: (state, action) => {
            action.payload.forEach((status, streamIndex) => {
                const { capacity, tag, state: stream_state, time, readCount, writeCount } = status

                // tag is UDF for current item
                state[streamIndex].tag = tag
                state[streamIndex].state = stream_state
                state[streamIndex].time = time

                // have both read and write counts changed, which indicates movement on the queue
                if (
                    state[streamIndex].readCount !== readCount &&
                    state[streamIndex].writeCount !== writeCount
                ) {
                    // safe to record new capacity
                    state[streamIndex].capacity = capacity
                    state[streamIndex].readCount = readCount
                    state[streamIndex].writeCount = writeCount
                }
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
        if (machineState === MachineState.OPERATION_ENABLED) {
            const { paused, buffer, capacity } = state
            if (!paused && capacity > 0 && buffer.length) {
                const items = buffer.slice(0, capacity)
                send(items)
                dispatch(streamSlice.actions.consume({ streamIndex, count: items.length }))
            }
        } else {
            // not enabled, so clear down buffer
            dispatch(streamSlice.actions.reset(streamIndex))
        }
    }
}

export const useStream = (
    streamIndex: number
): {
    /** The current state of the gcode execution from gbc */
    state: STREAMSTATE
    /** The time the stream has been active */
    time: number
    /** The tag of the currently executing stream item */
    tag: number
    /** Set the state of stream execution, for example pause, resume and cancel */
    setState(state: STREAMCOMMAND)
    /** Reset the local stream queue */
    reset()
} => {
    const { state, tag, time } = useSelector(
        (state: RootState) =>
            state.stream[streamIndex] || { state: STREAMSTATE.STREAMSTATE_IDLE, tag: 0, time: 0 },
        shallowEqual
    )
    const connection = useConnection()
    const dispatch = useDispatch()

    return {
        state,
        time,
        tag,
        setState(streamCommand: STREAMCOMMAND) {
            connection.send(updateStreamStateMsg(streamIndex, streamCommand))
        },
        reset() {
            dispatch(streamSlice.actions.reset(streamIndex))
        }
    }
}
