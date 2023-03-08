/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createSlice, Slice } from "@reduxjs/toolkit"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { GlowbuzzerConfig, MoveParametersConfig, ToolConfig } from "../gbc"
import { RootState } from "../root"
import deepEqual from "fast-deep-equal"
import { useConnection } from "../connect"
import { settings } from "../util/settings"

const { load, save } = settings("config")

export const DEFAULT_CONFIG: GlowbuzzerConfig = {
    frames: [{}],
    kinematicsConfiguration: [
        {
            linearLimits: [{}],
            participatingJoints: [],
            extentsX: [-100, 100],
            extentsY: [-100, 100],
            extentsZ: [-100, 100]
        }
    ],
    joint: []
}

export enum ConfigState {
    AWAITING_CONFIG = "AWAITING CONFIG",
    READY = "READY"
}

type ConfigSliceType = {
    state: ConfigState
    version: number
    modified: boolean
    current: GlowbuzzerConfig
    remote: GlowbuzzerConfig | null
}

function persist({ current, modified, remote }) {
    save({
        current,
        remote,
        modified
    })
}

export const configSlice: Slice<ConfigSliceType> = createSlice({
    name: "config",
    initialState: {
        state: ConfigState.AWAITING_CONFIG as ConfigState,
        modified: false as boolean,
        version: 1,
        current: DEFAULT_CONFIG,
        remote: null
    },
    reducers: {
        loadOfflineConfig(state) {
            return { ...state, ...load() }
        },
        /** Set config on connect - will not overwrite a locally modified config */
        setConfigFromRemote(state, action) {
            state.version++
            state.state = ConfigState.READY
            if (state.modified) {
                state.remote = action.payload
            } else {
                state.current = action.payload
                state.remote = null
            }
            persist(state)
        },
        /** Set config - overrides and resets any locally modified config */
        setConfig(state, action) {
            state.version++
            state.modified = false
            state.remote = null
            state.current = action.payload
            persist(state)
        },
        /** Set offline config - marks config as modified and cache the last known remote config */
        setOfflineConfig(state, action) {
            state.version++
            if (!state.modified) {
                state.remote = state.current
            }
            state.modified = true
            state.current = action.payload
            persist(state)
        },
        /** Discard any locally modified config and replace with last known remote config */
        discardOfflineConfig(state) {
            if (!state.modified) {
                return
            }
            state.version++
            state.modified = false
            state.current = state.remote || DEFAULT_CONFIG
            state.remote = null
            persist(state)
        },
        setConfigState(state, action) {
            state.state = action.payload
        }
    }
})

/**
 * @ignore
 */
export function useConfigState() {
    const dispatch = useDispatch()
    // return value and setter
    return [
        useSelector((state: RootState) => state.config.state, shallowEqual),
        state => dispatch(configSlice.actions.setConfigState(state))
    ] as [ConfigState, (state: ConfigState) => void]
}

/**
 * @ignore
 */
export function useOfflineConfig(): [boolean, () => void, () => void] {
    const loader = useConfigLoader()
    const modified = useSelector((state: RootState) => state.config.modified, shallowEqual)
    const offline_config = useSelector((state: RootState) => state.config.current, deepEqual)
    const dispatch = useDispatch()

    return [
        modified,
        () => dispatch(configSlice.actions.discardOfflineConfig(null)),
        () => loader(offline_config)
    ]
}

/**
 * Returns the current configuration as provided by GBC.
 */
export function useConfig() {
    return useSelector(
        (state: RootState) => state.config,
        (a, b) => a.version === b.version // only update on version change
    ).current
}

/**
 * Returns a function that can be used to apply partial updates to the configuration. Configuration
 * changes will be sent to GBC.
 */
export function useConfigLoader() {
    const connection = useConnection()
    const config = useConfig()
    const dispatch = useDispatch()

    return (change: Partial<GlowbuzzerConfig>) => {
        const next: GlowbuzzerConfig = {
            ...config,
            ...change
        }
        if (connection.connected) {
            return connection.request("load config", { config: next }).then(() => {
                dispatch(configSlice.actions.setConfig(next))
            })
        }
        // just do the dispatch, but config is now cached
        return Promise.resolve(dispatch(configSlice.actions.setOfflineConfig(next)))
    }
}

const EMPTY_TOOL: ToolConfig = {
    translation: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0, w: 1 }
}

/**
 * Returns the configuration for the given tool index.
 *
 * @param toolIndex The tool index
 */
export function useToolConfig(toolIndex: number): ToolConfig {
    return useSelector((state: RootState) => {
        return state.config.current.tool?.[toolIndex] ?? EMPTY_TOOL
    }, deepEqual)
}

/**
 * Returns the configuration for all tools.
 */
export function useToolList(): ToolConfig[] {
    return useSelector((state: RootState) => state.config.current.tool, deepEqual)
}

/**
 * Returns the default move parameters. This is the first move parameters entry, if configured
 */
export function useDefaultMoveParameters(): MoveParametersConfig {
    return useSelector((state: RootState) => {
        const v = state.config.current.moveParameters?.[0] || {}
        // strip the name from move params as it's not valid in websocket message to gbc
        const { name, ...props } = v
        return props
    }, shallowEqual)
}
