import { createSlice } from "@reduxjs/toolkit"
import { GCodePreviewAdapter } from "./GCodePreviewAdapter"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { RootState } from "../root"

// TODO: snowpack doesn't recognise types for export??
export type GCodeSegment = {
    from: number[]
    to: number[]
    color: number[]
}

export const previewSlice = createSlice({
    name: "preview",
    initialState: {
        segments: [] as GCodeSegment[]
    },
    reducers: {
        set(store, action) {
            store.segments = action.payload
        }
    }
})

export function usePreview() {
    const segments = useSelector(({ preview: { segments } }: RootState) => segments, shallowEqual)
    const dispatch = useDispatch()

    return {
        setGCode(gcode: string) {
            const interpreter = new GCodePreviewAdapter([0, 0, 0])
            interpreter.execute(gcode)
            dispatch(previewSlice.actions.set(interpreter.segments))
        },
        segments
    }
}
