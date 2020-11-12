import { createSlice } from "@reduxjs/toolkit"
import { GCodeSenderAdapter } from "./GCodeSenderAdapter"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { KinematicsConfigurationMcStatus } from "../types"
import { RootState } from "../root"

export const gcodeSlice = createSlice({
    name: "gcode",
    initialState: {
        ready: false,
        current_positions: [],
        paused: false,
        capacity: 0,
        buffer: []
    },
    reducers: {
        init(state, action) {
            // called when connection established and we get the first status update with act pos
            // TODO: for now we only deal with kc 0
            const status = action.payload[0] as KinematicsConfigurationMcStatus
            const { x, y, z } = status.cartesianActPos
            state.current_positions = [x, y, z]
            state.ready = true
        },
        append(state, action) {
            const buffer: Record<string, unknown>[] = []
            const interpreter = new GCodeSenderAdapter(buffer, state.current_positions)

            interpreter.execute(action.payload)
            state.buffer.push(...buffer)
        },
        consume(state, action) {
            // remove requested count from the front of the queue
            state.buffer.splice(0, action.payload)
        },
        status: (state, action) => {
            state.capacity = action.payload.capacity
        },
        pause: (state, action) => {
            state.paused = true
        },
        resume: (state, action) => {
            state.paused = false
        }
    }
})

export function useGCode() {
    const dispatch = useDispatch()

    return {
        send(gcodeString) {
            dispatch(gcodeSlice.actions.append(gcodeString))
        }
    }
}
