import { createSlice } from "@reduxjs/toolkit"
import { GCodeSenderAdapter } from "./GCodeSenderAdapter"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { KinematicsConfigurationMcStatus } from "../types"
import { RootState } from "../root"
import { settings } from "../util/settings"
import { useConnect } from "../connect"
import * as stream from "stream"

const { load, save } = settings("gcode")

export type GCodeSettingsType = {
    sendEndProgram: boolean
}

export enum StreamState {
    IDLE,
    ACTIVE,
    PAUSED,
    STOPPING,
    STOPPED
}

export enum StreamCommand {
    RUN,
    PAUSE,
    STOP
}

export const gcodeSlice = createSlice({
    name: "gcode",
    initialState: {
        updateId: -1, // update id of empty buffer in m4 will be zero (read_head << 16 + write_head)
        ready: false,
        current_positions: [],
        paused: false,
        capacity: 0,
        buffer: [],
        active: false,
        state: StreamState.IDLE,
        tag: 0,
        settings: {
            sendEndProgram: true,
            ...load()
        }
    },
    reducers: {
        settings(state, action) {
            state.settings = {
                ...state.settings,
                ...action.payload
            }
            save(state.settings)
        },
        init(state, action) {
            // called when connection established and we get the first status update with act pos
            // TODO: for now we only deal with kc 0
            const status = action.payload[0] as KinematicsConfigurationMcStatus
            const { x, y, z } = status.cartesianActPos
            state.current_positions = [x, y, z]
            state.ready = true
        },
        append(state, action) {
            console.log("Starting interpreter")
            const interpreter = new GCodeSenderAdapter(state.buffer, state.current_positions)
            interpreter.execute(action.payload)
            console.log("Interpreter done")
        },
        consume(state, action) {
            // remove requested count from the front of the queue
            const count = action.payload
            // remove sent items from buffer queue
            state.buffer.splice(0, count)
            // reduce capacity of control (until new capacity status update)
            state.capacity -= count
        },
        status: (state, action) => {
            const { capacity, id, tag, active, state: stream_state } = action.payload

            // tag is udf for current item, active is whether any item is currently executing
            state.tag = tag
            state.active = active
            state.state = stream_state

            if (state.updateId !== id) {
                // new capacity status update
                state.capacity = capacity
                state.updateId = id
            }
        },
        pause: (state, action) => {
            state.paused = true
        },
        resume: (state, action) => {
            state.paused = false
        }
    }
})

function updateStreamStateMsg(streamCommand: StreamCommand) {
    return JSON.stringify({
        command: {
            stream: {
                0: {
                    command: {
                        streamCommand
                    }
                }
            }
        }
    })
}

export function useGCode() {
    const { state, active, tag } = useSelector(({ gcode: { state, active, tag } }: RootState) => ({ state, active, tag }), shallowEqual)
    const dispatch = useDispatch()
    const connection = useConnect()

    return {
        active,
        state,
        lineNum: tag,
        send(gcodeString) {
            dispatch(gcodeSlice.actions.append(gcodeString))
        },
        setState(streamCommand: StreamCommand) {
            dispatch(() => connection.send(updateStreamStateMsg(streamCommand)))
        }
    }
}

export function useGCodeSettings() {
    return useSelector(({ gcode: { settings } }: RootState) => ({ settings }), shallowEqual).settings
}
