/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createSlice, Slice } from "@reduxjs/toolkit"
import { settings } from "../util/settings"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { useConfig } from "../config"
import { RootState } from "../root"
import { build_list, build_tree2, change_reference_frame } from "../util/frame_utils"
import { FramesConfig, GlowbuzzerConfig, POSITIONREFERENCE, Quat, Vector3 } from "../gbc"
import { useMemo } from "react"

const { load, save } = settings<FramesSliceType>("frames")

type FramesSliceType = {
    activeFrame: number
    selectedFrame: number
    overrides: number[][]
}

export const framesSlice: Slice<FramesSliceType> = createSlice({
    name: "frames",
    initialState: {
        overrides: [] as number[][],
        activeFrame: 0,
        selectedFrame: null
    },
    reducers: {
        loadSettings(state) {
            return { ...state, ...load() }
        },
        setActiveFrame(state, action) {
            return save({ ...state, activeFrame: action.payload })
        },
        setSelectedFrame(state, action) {
            return save({ ...state, selectedFrame: action.payload })
        }
    }
})

/** @ignore - currently part of the internal API */
export const useFrames = (overrides?: FramesConfig[]) => {
    const dispatch = useDispatch()
    const config = useConfig()
    const activeFrame = useSelector((state: RootState) => state.frames.activeFrame, shallowEqual)

    return useMemo(() => {
        const asTree = build_tree2(overrides || config.frames || [])
        const asList = build_list(asTree)

        return {
            raw: config.frames,
            asTree,
            asList,
            overrides,
            active: activeFrame,
            convertToFrame(
                translation: Vector3,
                rotation: Quat,
                fromIndex: number | "world",
                toIndex: number | "world"
            ) {
                return change_reference_frame(asList, translation, rotation, fromIndex, toIndex)
            },
            setActiveFrame(index: number) {
                dispatch(framesSlice.actions.setActiveFrame(index))
            }
        }
    }, [config.frames, activeFrame, overrides])
}

/**
 * Provides a list of the currently configured frames.
 */
export function useFramesList(overrides?: GlowbuzzerConfig["frames"]): GlowbuzzerConfig["frames"] {
    const config = useConfig()

    // make sure the frames have sensible defaults for missing properties
    return (overrides || config.frames || []).map(f => ({
        ...f,
        translation: { x: 0, y: 0, z: 0, ...f.translation },
        rotation: { x: 0, y: 0, z: 0, w: 1, ...f.rotation }
    }))
}

/**
 * Provides a frame from the configuration by index.
 * @param index
 * @param useDefaults If true, will return a default frame at the origin with no rotation if the given index is out of bounds, otherwise will return undefined.
 */
export function useFrame(index: number, useDefaults = true): FramesConfig {
    const frames = useFramesList()

    return (
        frames[index] ||
        (useDefaults
            ? {
                  translation: { x: 0, y: 0, z: 0 },
                  rotation: { x: 0, y: 0, z: 0, w: 1 },
                  positionReference: POSITIONREFERENCE.ABSOLUTE
              }
            : {})
    )
}

/** @ignore used internally by the frames tile */
export function useSelectedFrame(): [number, (index: number) => void] {
    const dispatch = useDispatch()
    const selectedFrame = useSelector(
        (state: RootState) => state.frames.selectedFrame,
        shallowEqual
    )

    return [selectedFrame, (index: number) => dispatch(framesSlice.actions.setSelectedFrame(index))]
}

/** @ignore used internally by the gcode tile */
export function useActiveFrame(): [number, (index: number) => void] {
    const dispatch = useDispatch()
    const activeFrame = useSelector((state: RootState) => state.frames.activeFrame, shallowEqual)

    return [activeFrame, (index: number) => dispatch(framesSlice.actions.setActiveFrame(index))]
}

/**
 * @ignore used internally by the gcode interpreter
 */
export function useWorkspaceFrames(): Record<number, number> {
    const frames = useFramesList()

    // we want to retain the index of each frame in the array during the filter
    const entries = Array.from(frames.entries())
        // filter out frames that don't have a workspace offset
        .filter(([, f]) => f.workspaceOffset)
        // remove duplicates, we only want to keep the first instance of each workspace offset
        .filter(
            ([, f], i, a) => a.findIndex(([, f2]) => f2.workspaceOffset === f.workspaceOffset) === i
        )
        // convert to a map of workspace offset to frame index
        .map(([i, f]) => [f.workspaceOffset, i])

    return Object.fromEntries(entries)
}
