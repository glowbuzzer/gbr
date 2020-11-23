import { Dispatch } from "redux"
import { gcodeSlice } from "./index"

export const GCodeStreamer = {
    update(dispatch: Dispatch, state, send) {
        const { paused, buffer, capacity } = state
        if (!paused && capacity > 0 && buffer.length) {
            const items = buffer.slice(0, capacity)
            console.log("Sending", items.length, "items from the buffer, capacity was", capacity, "remaining=", buffer.length)
            send(items)
            dispatch(gcodeSlice.actions.consume(items.length))
        }
    }
}
