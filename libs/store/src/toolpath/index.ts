import { createSlice } from "@reduxjs/toolkit"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { RootState } from "@glowbuzzer/store"
import deepEqual from "fast-deep-equal"

export type ToolPathSettingsType = {
    overrideWorkspace: boolean
}

type ToolPathElement = {
    x: number
    y: number
    z: number
    a?: number
    b?: number
    c?: number
}

type ToolPathForKinematicsConfiguration = {
    path: ToolPathElement[]
    last: any // record last status
}

function load_settings(): ToolPathSettingsType {
    const DEFAULT_SETTINGS = {
        overrideWorkspace: false
    }
    try {
        return JSON.parse(localStorage.getItem("toolpath.settings")) || DEFAULT_SETTINGS
    } catch {
        console.log("Failed to load toolpath settings, returning defaults")
    }
    return DEFAULT_SETTINGS
}

function save_settings(value) {
    localStorage.setItem("toolpath.settings", JSON.stringify(value))
}

export const toolPathSlice = createSlice({
    name: "toolPath",
    initialState: {
        settings: load_settings() as ToolPathSettingsType,
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
            if (state[kc]) {
                // remove all but the last location
                state[kc].path.splice(0, state[kc].path.length - 1)
            }
        },
        settings(state, action) {
            state.settings = action.payload
            save_settings(action.payload)
        }
    }
})

export const useToolPath = (kc: number) => {
    // select the given kc out of all toolpaths
    const toolPath = useSelector(
        ({ toolPath }: RootState) =>
            toolPath.paths[kc]?.path || [
                {
                    x: 0,
                    y: 0,
                    z: 0
                }
            ],
        shallowEqual
    )
    const dispatch = useDispatch()

    return {
        path: toolPath,
        reset() {
            dispatch(toolPathSlice.actions.reset(kc))
        }
    }
}

export const useToolPathSettings = () => {
    const settings = useSelector((state: RootState) => {
        console.log("TOOLPATH STATE", state.toolPath)
        return state.toolPath.settings
    }, shallowEqual)

    console.log("RETURNING SETTINGS", settings)
    return {
        settings,
        setSettings(settings: ToolPathSettingsType) {
            toolPathSlice.actions.settings(settings)
        }
    }
}
