import { createSlice } from "@reduxjs/toolkit"
import { GCodePreviewAdapter } from "./GCodePreviewAdapter"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { RootState } from "../root"

export type GCodeSegment = {
    from: number[]
    to: number[]
    color: number[]
    lineNum?: number
}

export const previewSlice = createSlice({
    name: "preview",
    initialState: {
        highlightLine: undefined as number | undefined,
        segments: [] as GCodeSegment[]
    },
    reducers: {
        set(store, action) {
            store.segments = action.payload
        },
        setHighlightLine(store, action) {
            store.highlightLine = action.payload
        }
    }
})

export function usePreview() {
    const segments = useSelector(({ preview: { segments } }: RootState) => segments, shallowEqual)
    const highlightLine = useSelector(({ preview: { highlightLine } }: RootState) => highlightLine, shallowEqual)

    const dispatch = useDispatch()

    return {
        setGCode(gcode: string) {
            const interpreter = new GCodePreviewAdapter([0, 0, 0])
            interpreter.execute(gcode)
            dispatch(previewSlice.actions.set(interpreter.segments))
        },
        setHighlightLine(lineNum: number) {
            dispatch(previewSlice.actions.setHighlightLine(lineNum))
        },
        segments,
        highlightLine
    }
}
