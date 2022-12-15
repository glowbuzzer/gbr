/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createContext, useContext } from "react"
import { createSlice, Slice } from "@reduxjs/toolkit"
import { GCodeSenderAdapter } from "./GCodeSenderAdapter"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { KinematicsConfigurationMcStatus } from "../types"
import { RootState } from "../root"
import { settings } from "../util/settings"
import { useConnection } from "../connect"
import { ActivityStreamItem, STREAMCOMMAND, STREAMSTATE } from "../gbc"
import { SoloActivityApi } from "../activity/activity_api"
import { ActivityBuilder } from "../activity"
import { useWorkspaceFrames } from "../frames"

// test

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
            const { x, y, z } = status.position.translation
            state.current_positions = [x, y, z]
            state.ready = true
        },
        append(state, action) {
            // convert the given gcode text into activities and add to buffer
            const { gcode, vmax, workspaceFrames, context } = action.payload
            const interpreter = new GCodeSenderAdapter(state.buffer, vmax, workspaceFrames, context)
            interpreter.execute(gcode)
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
            state.readCount = -1
            state.writeCount = -1
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

            // tag is UDF for current item
            state.tag = tag
            state.state = stream_state
            state.time = time

            // have both read and write counts changed, which indicates movement on the queue
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

export function updateStreamStateMsg(streamCommand: STREAMCOMMAND) {
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
    /** The current state of the gcode execution from gbc */
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
    /** Reset the stream queue */
    reset()
} {
    const { state, tag, time } = useSelector(
        ({ gcode: { state, tag, time } }: RootState) => ({ state, tag, time }),
        shallowEqual
    )
    const context = useContext(gcodeContext)
    const dispatch = useDispatch()
    const connection = useConnection()
    const workspaceFrames = useWorkspaceFrames()

    return {
        state,
        time,
        lineNum: tag,
        send(gcode, vmax: number) {
            dispatch(gcodeSlice.actions.append({ gcode, vmax, workspaceFrames, context }))
        },
        setState(streamCommand: STREAMCOMMAND) {
            connection.send(updateStreamStateMsg(streamCommand))
            // dispatch<any>(() => )
        },
        reset() {
            dispatch(gcodeSlice.actions.reset({}))
        }
    }
}

/** @ignore */
export function useGCodeSettings() {
    return useSelector(({ gcode: { settings } }: RootState) => ({ settings }), shallowEqual)
        .settings
}

/**
 * Provides additional context to gcode interpreter. For now, this context provides a mechanism to handle tool change
 * M06 gcode.
 */
export type GCodeContextType = {
    /**
     * Provide an implementation of this function to handle automated tool changes. Typically this function is supplied to
     * {@link GCodeContextProvider}. The function you supply should return an array of activities which achieve the tool change.
     * These activities will be inserted in place of the the M06 code and queued for processing. For example:
     * ```
     *    function handleToolChange(
     *         kinematicsConfigurationIndex: number,
     *         current: number,
     *         next: number,
     *         api: SoloActivityApi
     *     ) {
     *         return [
     *              api.moveToPosition(null, null, 50),
     *              api.setToolOffset(next),
     *              api.dwell(500)
     *         ]
     *     }
     *
     *     return (
     *         <GCodeContextProvider value={{ handleToolChange }}>
     *             ... app ...
     *         </GCodeContextProvider>
     *     )
     * ```
     * @param kinematicsConfigurationIndex The kinematics configuration
     * @param currentToolIndex The current tool index
     * @param newToolIndex The new tool index (set by Tn code)
     * @param api The activity API you can use to create activities to execute
     */
    handleToolChange(
        kinematicsConfigurationIndex: number,
        currentToolIndex: number,
        newToolIndex: number,
        api: SoloActivityApi
    ): ActivityBuilder[]
}

export const gcodeContext = createContext<GCodeContextType>(null)

export const GCodeContextProvider = gcodeContext.Provider
