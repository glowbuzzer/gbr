import { createSlice, Slice } from "@reduxjs/toolkit"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import deepEqual from "fast-deep-equal"
import { settings } from "../util/settings"
import { RootState } from "../root"
import { useFrames } from "../frames"
import { Quaternion, Vector3 } from "three"

const { load, save } = settings("toolpath")

export type ToolPathSettingsType = {
    overrideWorkspace: boolean
    extent: number
}

export type ToolPathElement = {
    x: number
    y: number
    z: number
    qx?: number
    qy?: number
    qz?: number
    qw?: number
}

type ToolPathForKinematicsConfiguration = {
    path: ToolPathElement[]
    last: unknown // record last status
}

type ToolPathSliceType = {
    settings: ToolPathSettingsType
    paths: ToolPathForKinematicsConfiguration[]
}
export const toolPathSlice: Slice<ToolPathSliceType> = createSlice({
    name: "toolPath",
    initialState: {
        settings: {
            overrideWorkspace: false,
            extent: 100,
            ...load()
        } as ToolPathSettingsType,
        paths: [] as ToolPathForKinematicsConfiguration[]
    },
    reducers: {
        status(state, action) {
            action.payload.forEach((kc, index) => {
                const current = state.paths[index] || { path: [], last: undefined }
                if (current.last && deepEqual(current.last, kc)) {
                    // nothing's changed, so don't add to toolpath
                    return
                }
                const { x, y, z } = kc.cartesianActPos
                current.path.push({ x, y, z })
                if (current.path.length > 500) {
                    // TODO: make max path length configurable
                    current.path.splice(0, 1)
                }
                current.last = kc
                if (!state.paths[index]) {
                    state.paths[index] = current
                }
            })
        },
        reset(state, action) {
            const kc = action.payload
            const path_info = state.paths[kc]
            if (path_info) {
                // remove all but the last location
                path_info.path.splice(0, path_info.path.length - 1)
            }
        },
        settings(state, action) {
            console.log("TOOLPATH SETTINGS CHANGED", action.payload)
            state.settings = action.payload
            save(action.payload)
        }
    }
})

/**
 * @ignore - Internal to the ToolPathTile
 */
export const useToolPath = (kc: number) => {
    const frames = useFrames()
    // select the given kc out of all toolpaths
    const toolPath = useSelector(({ toolPath }: RootState) => {
        // TODO: this is very inefficient
        return (
            toolPath.paths[kc]?.path.map(({ x, y, z, qx, qy, qz, qw }) => {
                const p = new Vector3(x, y, z)
                const q = new Quaternion(qx, qy, qz, qw)
                const { position } = frames.convertToFrame(p, q, kc, "world")
                return {
                    x: position.x,
                    y: position.y,
                    z: position.z
                }
            }) || [
                {
                    x: 0,
                    y: 0,
                    z: 0
                }
            ]
        )
    }, shallowEqual)
    const dispatch = useDispatch()

    return {
        path: toolPath,
        reset() {
            dispatch(toolPathSlice.actions.reset(kc))
        }
    }
}

/**
 * @ignore - Internal to the ToolPathTile
 */
export const useToolPathSettings = () => {
    const settings = useSelector((state: RootState) => state.toolPath.settings, shallowEqual)
    const dispatch = useDispatch()

    return {
        settings,
        setSettings(settings: ToolPathSettingsType) {
            dispatch(toolPathSlice.actions.settings(settings))
        }
    }
}
