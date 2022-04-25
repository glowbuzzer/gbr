import { createSlice, Slice } from "@reduxjs/toolkit"
import { Quaternion, Vector3 } from "three"
import { settings } from "../util/settings"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { useConnection } from "../connect"
import { useConfig } from "../config"
import { RootState } from "../root"
import { build_list, build_tree, change_reference_frame } from "../util/frame_utils"

const { load, save } = settings("frames")

export const framesSlice: Slice<{ activeFrame: number; overrides: number[][] }> = createSlice({
    name: "frames",
    initialState: {
        overrides: [] as number[][],
        activeFrame: 0,
        ...load()
    },
    reducers: {
        setOverrides(state, action) {
            return save({ ...state, overrides: action.payload })
        },
        setActiveFrame(state, action) {
            return save({ ...state, activeFrame: action.payload })
        }
    }
})

export function updateFrameOverridesMsg(overrides: number[][]) {
    const frames = {}
    for (const [index, value] of overrides.entries()) {
        if (value) {
            const [x, y, z] = value
            frames[index] = {
                command: {
                    override: true,
                    translation: {
                        x,
                        y,
                        z
                    },
                    rotation: {
                        x: 0,
                        y: 0,
                        z: 0,
                        w: 1
                    }
                }
            }
        } else {
            frames[index] = {
                command: {
                    override: false
                }
            }
        }
    }
    return JSON.stringify({
        command: {
            frames
        }
    })
}

/** @ignore - currently part of the internal API */
export const useFrames = () => {
    const dispatch = useDispatch()
    const connection = useConnection()
    const config = useConfig()
    const overrides = useSelector((state: RootState) => state.frames.overrides, shallowEqual)
    const activeFrame = useSelector((state: RootState) => state.frames.activeFrame, shallowEqual)

    const asTree = build_tree(config.frames, overrides)
    const asList = build_list(asTree)

    // console.log("FRAME", asList[0].absolute.translation)

    function update(index, value) {
        const length =
            value === undefined ? overrides.length : Math.max(index + 1, overrides.length)
        return Array.from({ length }).map((_, i) => (i === index ? value : overrides[i]))
    }

    return {
        raw: config.frames,
        asTree,
        asList,
        overrides,
        active: activeFrame,
        convertToFrame(
            translation: Vector3,
            rotation: Quaternion,
            fromIndex: number | "world",
            toIndex: number | "world"
        ) {
            // console.log("FROM", fromIndex, "TO", toIndex)
            return change_reference_frame(asList, translation, rotation, fromIndex, toIndex)
        },
        setOverride(index: number, value: number[] | undefined) {
            const new_list = update(index, value)
            dispatch(framesSlice.actions.setOverrides(new_list))
            connection.send(updateFrameOverridesMsg(new_list))
        },
        setActiveFrame(index: number) {
            dispatch(framesSlice.actions.setActiveFrame(index))
        }
    }
}
