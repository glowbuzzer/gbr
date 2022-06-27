/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Dispatch } from "redux"
import { gcodeSlice } from "./index"
import { MachineState } from "../machine"

export const GCodeStreamer = {
    update(dispatch: Dispatch, state, machineState: MachineState, send) {
        if (machineState === MachineState.OPERATION_ENABLED) {
            const { paused, buffer, capacity } = state
            if (!paused && capacity > 0 && buffer.length) {
                const items = buffer.slice(0, capacity)
                send(items)
                dispatch(gcodeSlice.actions.consume(items.length))
            }
        } else {
            // not enabled, so clear down buffer
            dispatch(gcodeSlice.actions.reset(null))
        }
    }
}
