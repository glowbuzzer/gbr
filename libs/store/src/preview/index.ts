/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import {createSlice, Slice} from "@reduxjs/toolkit"
import {GCodePreviewAdapter} from "./GCodePreviewAdapter"
import {shallowEqual, useDispatch, useSelector} from "react-redux"
import {RootState} from "../root"
import {useFrames, useWorkspaceFrames} from "../frames"
import {useKinematics} from "../kinematics"
import {CartesianPosition, POSITIONREFERENCE} from "../gbc"
import {Quaternion, Vector3} from "three"
import {apply_offset} from "../util/frame_utils"

export type GCodeSegment = {
    from: { x: number; y: number; z: number }
    to: { x: number; y: number; z: number }
    color: number[]
    lineNum?: number
}

type PreviewSliceState = {
    highlightLine?: number
    segments: GCodeSegment[]
    disabled?: boolean
}

export const previewSlice: Slice<PreviewSliceState> = createSlice({
    name: "preview",
    initialState: {
        highlightLine: undefined as number | undefined,
        segments: [] as GCodeSegment[],
        disabled: false as boolean
    },
    reducers: {
        set(store, action) {
            store.segments = action.payload
        },
        setHighlightLine(store, action) {
            store.highlightLine = action.payload
        },
        setDisabled(store, action) {
            store.disabled = action.payload
        }
    }
})

/**
 * @ignore - Used internally by the toolpath display
 */
export function usePreview() {
    const segments = useSelector(({preview: {segments}}: RootState) => segments, shallowEqual)
    const highlightLine = useSelector(
        ({preview: {highlightLine}}: RootState) => highlightLine,
        shallowEqual
    )
    const disabled = useSelector(({preview: {disabled}}: RootState) => disabled, shallowEqual)

    const frames = useFrames()
    const workspaceFrames = useWorkspaceFrames()

    const kc = useKinematics(0)
    const {translation, rotation} = frames.convertToFrame(
        kc.translation,
        kc.rotation,
        kc.frameIndex,
        frames.active
    )
    const currentPosition: CartesianPosition = {
        positionReference: POSITIONREFERENCE.ABSOLUTE,
        // we need to undo the effect of kc offset because gcode adapter will apply it to all positions
        translation: apply_offset({translation, rotation}, kc.offset, true).translation,
        frameIndex: frames.active
    }

    const dispatch = useDispatch()

    return {
        setGCode(gcode: string) {
            const convertToFrame = (
                translation: Vector3,
                rotation: Quaternion,
                fromIndex: number | "world",
                toIndex: number | "world",
                applyOffset = true
            ) => {
                // apply any kc offset to the calculated positions
                const p = frames.convertToFrame(translation, rotation, fromIndex, toIndex)
                return applyOffset ? apply_offset(p, kc.offset, false) : p
            }

            const interpreter = new GCodePreviewAdapter(
                currentPosition,
                workspaceFrames,
                kc.frameIndex,
                convertToFrame
            )
            interpreter.execute(gcode)
            dispatch(previewSlice.actions.set(interpreter.segments))
        },
        setHighlightLine(lineNum: number) {
            dispatch(previewSlice.actions.setHighlightLine(lineNum))
        },
        disable() {
            dispatch(previewSlice.actions.setDisabled(true))
        },
        enable() {
            dispatch(previewSlice.actions.setDisabled(false))
        },
        segments,
        disabled,
        highlightLine
    }
}
