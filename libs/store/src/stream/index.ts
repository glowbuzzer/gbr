/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { createSlice, Slice } from "@reduxjs/toolkit"
import { Dispatch } from "redux"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import {
    ActivityStreamItem,
    GlowbuzzerKinematicsConfigurationStatus,
    MoveParametersConfig,
    STREAMCOMMAND,
    STREAMSTATE
} from "../gbc"
import { MachineState } from "../machine"
import { RootState } from "../root"
import { useConnection } from "../connect"
import { StreamingActivityApi } from "./api"
import { useEffect, useMemo } from "react"
import { useDefaultMoveParameters } from "../config"
import { ActivityApi, ActivityBuilder, ActivityPromiseResult } from "../activity"
import { useShallowStableValue } from "../util/useShallowStableValue"

// there is one of these per stream configured
export type StreamSliceType = {
    ready: boolean
    paused: boolean
    capacity: number
    queued: number
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
    queued: 0,
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

function promisify(activity: ActivityGeneratorReturnType) {
    if (activity instanceof ActivityBuilder) {
        return activity.promise()
    } else {
        return activity
    }
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
            if (!state[streamIndex]) {
                return
            }
            state[streamIndex].buffer.length = 0
            // state[streamIndex].readCount = -1
            // state[streamIndex].writeCount = 0
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
                    // console.log("sending stream slice, capacity=", capacity, "items=", items.length)
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

type ActivityGeneratorReturnType = ActivityBuilder | Promise<any>

/**
 * Provides access to the streamed activity API and the current state of the stream.
 *
 * The stream is a queue of activities that are sent to the machine. As each activity is completed the next activity is started, in real time.
 * Each activity is tagged with a unique number that is used to identify the activity when it is completed.
 * It is important that the capacity of the stream is not exceeded.
 *
 * The stream will normally run automatically, but can be stopped, paused and resumed using the sendCommand method.
 *
 * The `execute` method is used to send activities to the stream. It takes a callback that receives an {@link ActivityApi}.
 * The api provides factory methods (builders) for creating activities, each of which has a `promise` method. The callback should return an
 * array of these promises or the builder directly. Each of the individual promises will be resolved when an activity completes.
 * In addition the send method itself returns a promise that resolves when all the activities have completed. Note that the promises
 * for individual activities are not resolved with precise timing as the next activity in the queue may have started. If you need
 * the precise state of the machine after the activity completes, you should split up activities and await completion of each one.
 *
 * Example:
 * ```
 * const { execute } = useStream(0)
 * await execute(api => [
 *    api.moveLine(10,0,0), // direct return of builder
 *    api.moveLine(10,10,0).promise().then(() => console.log("starting arc")), // return of promise
 *    api.moveArc(0,0,0).centre(10,0,0).direction(ARCDIRECTION.CCW)
 * ])
 *
 * ```
 *
 * @param streamIndex The index of the stream to use. This corresponds to the index of the kinematics configuration that will be used.
 * @param defaultMoveParams Default move parameters to use for all activities in the stream
 */
export const useStream = (
    streamIndex: number,
    defaultMoveParams: MoveParametersConfig = {}
): {
    /** The current state of the stream execution */
    state: STREAMSTATE
    /** The time the stream has been active */
    time: number
    /** The tag of the currently executing stream item */
    tag: number
    /** The number of items that can be sent to the stream. You can stream more than this number but activities will be buffered client side until capacity becomes available. */
    capacity: number
    /** The number of items that are currently buffered in GBC waiting to be executed */
    queued: number
    /** The number of items that are currently buffered on the client waiting to be sent */
    pending: number
    /** @deprecated. Use `execute` method instead */
    send(fn: (api: ActivityApi) => Promise<any>[]): Promise<(ActivityPromiseResult | void)[]>
    /**
     * Execute one or more activities on the machine. The function you provide receives an API you can use to create activities
     * using a fluent builder pattern. You can return a single activity or an array of activities to execute in sequence.
     * For each activity you can return the builder directly or the promise returned by the builder's `promise` method.
     *
     * @returns A promise that resolves when all the activities have completed.
     */
    execute(
        fn: (api: ActivityApi) => ActivityGeneratorReturnType[] | ActivityGeneratorReturnType
    ): Promise<ActivityPromiseResult[] | ActivityPromiseResult>
    // api: StreamingActivityApi
    /** Send a stream command, for example pause, resume and cancel */
    sendCommand(state: STREAMCOMMAND): void
    /** Reset the local stream queue */
    reset(): void
} => {
    const { state, tag, time, capacity, queued, pending, readCount } = useSelector<
        RootState,
        StreamSliceType
    >(
        (state: RootState) =>
            state.stream[streamIndex] ||
            ({
                state: STREAMSTATE.STREAMSTATE_IDLE,
                tag: 0,
                time: 0,
                capacity: 0,
                pending: 0
            } as StreamSliceType),
        shallowEqual
    )
    const connection = useConnection()
    const default_move_params_from_config = useDefaultMoveParameters()
    const stable_default_move_params_param = useShallowStableValue(defaultMoveParams)

    const dispatch = useDispatch()

    const api = useMemo(() => {
        const params = {
            ...default_move_params_from_config,
            ...stable_default_move_params_param // overrides config if given
        }
        return new StreamingActivityApi(streamIndex, params, activity => {
            dispatch(streamSlice.actions.append({ streamIndex, buffer: [activity] }))
        })
    }, [streamIndex, stable_default_move_params_param, default_move_params_from_config, dispatch])

    useEffect(() => {
        api.updateStream(tag, state)
    }, [
        api,
        tag,
        state,
        /* include readCount to catch cases where single move completes in a single cycle */
        readCount
    ])

    return useMemo(
        () => ({
            state,
            time,
            tag,
            capacity,
            queued,
            pending,
            send(factory: (api: ActivityApi) => Promise<any>[]) {
                // deprecated in favour of `execute`
                return Promise.all(factory(api))
            },
            execute(
                factory: (
                    api: ActivityApi
                ) => ActivityGeneratorReturnType | ActivityGeneratorReturnType[]
            ) {
                const activities = factory(api)
                if (!Array.isArray(activities)) {
                    return promisify(activities) // single activity
                }

                // multiple activities, so promisify each one and return promise for all
                return Promise.all(activities.map(promisify))
            },
            sendCommand(streamCommand: STREAMCOMMAND) {
                connection.send(updateStreamCommandMsg(streamIndex, streamCommand))
            },
            reset() {
                api.reset()
                dispatch(streamSlice.actions.reset(streamIndex))
            }
        }),
        [state, time, tag, capacity, queued, pending, api, streamIndex, connection]
    )
}

export * from "./api"
