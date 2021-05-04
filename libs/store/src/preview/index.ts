import { createSlice } from "@reduxjs/toolkit"
import { GCodePreviewAdapter } from "./GCodePreviewAdapter"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { RootState } from "../root"
import { useFrames } from "../frames"
import { useKinematics } from "../kinematics"
import * as React from "react"
import { useMemo } from "react"
import { gcodeSlice } from "../gcode"

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
        setSimple(store, action) {
            const path = action.payload
            store.segments = path.slice(1).map((p, index) => ({
                from: path[index],
                to: p,
                color: [0.5, 0.5, 0.5] // neutral grey
            }))
        },
        setHighlightLine(store, action) {
            store.highlightLine = action.payload
        }
    }
})

export function usePreview() {
    const segments = useSelector(({ preview: { segments } }: RootState) => segments, shallowEqual)
    const highlightLine = useSelector(({ preview: { highlightLine } }: RootState) => highlightLine, shallowEqual)
    const frames = useFrames()
    const kc = useKinematics(0, frames.active)

    const dispatch = useDispatch()

    return {
        setGCode(gcode: string) {
            const { x, y, z } = kc.pose.position
            const interpreter = new GCodePreviewAdapter([x, y, z], frames.convertToFrame)
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
