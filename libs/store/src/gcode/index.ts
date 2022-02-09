import { createSlice, Slice } from "@reduxjs/toolkit"
import { GCodeSenderAdapter } from "./GCodeSenderAdapter"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { KinematicsConfigurationMcStatus } from "../types"
import { RootState } from "../root"
import { settings } from "../util/settings"
import { useConnection } from "../connect"
import { ActivityStreamItem, STREAMCOMMAND, STREAMSTATE } from "../gbc"

const { load, save } = settings("store.gcode")

export type GCodeSettingsType = {
    sendEndProgram: boolean
}

type GCodeSliceType = {
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
    settings: GCodeSettingsType
}

export const gcodeSlice: Slice<GCodeSliceType> = createSlice({
    name: "gcode",
    initialState: {
        ready: false as boolean,
        current_positions: [] as number[],
        paused: false as boolean,
        capacity: 0,
        buffer: [] as ActivityStreamItem[],
        state: STREAMSTATE.STREAMSTATE_IDLE,
        time: 0,
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
            console.log("SET CURRENT POS", state.current_positions)
            state.ready = true
        },
        append(state, action) {
            console.log("Starting interpreter")
            const { gcode, vmax } = action.payload
            const interpreter = new GCodeSenderAdapter(state.buffer, vmax)
            interpreter.execute(gcode)
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
        reset(state) {
            state.buffer.length = 0
            state.paused = false
        },
        status: (state, action) => {
            const {
                capacity,
                tag,
                state: stream_state,
                time,
                readCount,
                writeCount
            } = action.payload

            // tag is UDF for current item, active is whether any item is currently executing
            state.tag = tag
            state.state = stream_state
            state.time = time

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

function updateStreamStateMsg(streamCommand: STREAMCOMMAND) {
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

/**
 * Returns an object containing the state of, and methods to interact with, the execution of gcode in GBC.
 *
 * You can issue gcode using the `send` method, and it will be queued over the current connection. If the
 * amount of gcode sent exceeds the buffer capacity of GBC, processing will start as soon as the buffer is
 * full and continue until no more gcode is sent. Otherwise, execution will start when an M2 "end program"
 * is encountered. It is good practice to append M2 to all of your gcode.
 *
 * You can pause, resume and cancel gcode execution using the `setState` method.
 */
export function useGCode(): {
    /** The current state of the gcode execution */
    state: STREAMSTATE
    /** @ignore */
    time: number
    /** The line number of the gcode currently executing */
    lineNum: number
    /** Send gcode to execute
     * @param gcode The gcode to send
     * @param vmax The vmax to use for moves. Typically the linear vmax of the kinematics configuration
     */
    send(gcode: string, vmax: number)
    /** Set the state of gcode execution, for example pause, resume and cancel */
    setState(state: STREAMCOMMAND)
} {
    const { state, tag, time } = useSelector(
        ({ gcode: { state, tag, time } }: RootState) => ({ state, tag, time }),
        shallowEqual
    )
    const dispatch = useDispatch()
    const connection = useConnection()

    return {
        state,
        time,
        lineNum: tag,
        send(gcode, vmax: number) {
            dispatch(gcodeSlice.actions.append({ gcode, vmax }))
        },
        setState(streamCommand: STREAMCOMMAND) {
            dispatch(() => connection.send(updateStreamStateMsg(streamCommand)))
        }
    }
}

/** @ignore */
export function useGCodeSettings() {
    return useSelector(({ gcode: { settings } }: RootState) => ({ settings }), shallowEqual)
        .settings
}
