import { Dispatch } from "redux"
import { gcodeSlice } from "./index"

export const GCodeStreamer = {
    update(dispatch: Dispatch, state, send) {
        const { paused, buffer, capacity } = state
        if (!paused && capacity > 0 && buffer.length) {
            // we only push one item per status message, otherwise on the next status message we'll push
            // more items since the m4 won't yet have received all the ones we're sending on this push and will
            // still indicate it has capacity when it doesn't (or won't very shortly)
            const items = buffer.slice(0, 1)
            console.log("Sending", items.length, "items from the buffer, capacity was", capacity, "remaining=", buffer.length)
            for (const item of items) {
                send(item)
            }
            dispatch(gcodeSlice.actions.consume(1))
        }
    }
}
