import { createSlice } from "@reduxjs/toolkit"
import { GCodeSenderAdapter } from "./GCodeSenderAdapter"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { KinematicsConfigurationMcStatus } from "../types"
import { RootState } from "../root"
import { settings } from "../util/settings"
import { useConnect } from "../connect"

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
        ready: false,
        current_positions: [],
        paused: false,
        capacity: 0,
        buffer: [],
        state: StreamState.IDLE,
        readCount: -1,
        writeCount: -1,
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
            const { capacity, tag, state: stream_state, readCount, writeCount } = action.payload

            // tag is UDF for current item, active is whether any item is currently executing
            state.tag = tag
            state.state = stream_state

            if (state.readCount !== readCount && state.writeCount !== writeCount) {
                // safe to record new capacity
                state.capacity = capacity
                state.readCount = readCount
                state.writeCount = writeCount
            }
        },
        pause: state => {
            state.paused = true
        },
        resume: state => {
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
    const { state, tag } = useSelector(({ gcode: { state, tag } }: RootState) => ({ state, tag }), shallowEqual)
    const dispatch = useDispatch()
    const connection = useConnect()

    return {
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
