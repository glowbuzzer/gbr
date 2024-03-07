/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createSlice, Slice } from "@reduxjs/toolkit"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { GlowbuzzerConfig, MoveParametersConfig, ToolConfig } from "../gbc"
import { RootState } from "../root"
import deepEqual from "fast-deep-equal"
import { settings } from "../util/settings"
import { useConnection } from "../connect"

const { load, save } = settings("config")

export const GlowbuzzerMinimalConfig: GlowbuzzerConfig = {
    machine: [{ name: "default" }],
    frames: [{ name: "default" }],
    kinematicsConfiguration: [
        {
            name: "default",
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
    readonly: boolean
    simulationOnly: boolean
    gbcVersion: string
    schemaVersion: string
    version: number
    modified: boolean
    usingLocalConfiguration: boolean
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
        readonly: false as boolean,
        simulationOnly: false as boolean,
        gbcVersion: null,
        schemaVersion: null,
        modified: false as boolean,
        usingLocalConfiguration: false,
        version: 1,
        current: GlowbuzzerMinimalConfig,
        remote: null
    },
    reducers: {
        loadOfflineConfig(state, action) {
            const saved = load()
            const mismatch = action.payload && !deepEqual(saved?.current, action.payload)
            const modified = saved?.modified || mismatch
            const localOverride = action.payload ? { current: action.payload } : {}
            return {
                ...state,
                ...saved,
                ...localOverride,
                usingLocalConfiguration: !!action.payload,
                modified
            }
        },
        /** Set config on connect - will not overwrite a locally modified config */
        setConfigFromRemote(state, action) {
            const { gbcVersion, schemaVersion, readonly, simulationOnly, ...config } =
                action.payload
            state.readonly = readonly
            state.simulationOnly = simulationOnly
            state.gbcVersion = gbcVersion
            state.schemaVersion = schemaVersion
            state.version++
            state.state = ConfigState.READY
            state.modified = state.usingLocalConfiguration && !deepEqual(state.current, config)
            if (state.modified && !readonly) {
                state.remote = config
            } else {
                state.current = config
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
            state.current = state.remote || GlowbuzzerMinimalConfig
            state.remote = null
            state.usingLocalConfiguration = false
            persist(state)
        },
        setConfigState(state, action) {
            state.state = action.payload
        }
    }
})

/** @ignore */
export function useConfigVersion(): number {
    return useSelector((state: RootState) => state.config.version)
}

export function useHeartbeatTimeout(): number {
    return useSelector((state: RootState) => state.config.current.machine?.[0].heartbeatTimeout)
}

export function useBusCycleTime(): number {
    return useSelector((state: RootState) => state.config.current.machine?.[0].busCycleTime)
}

/** @ignore */
export function useConfigState() {
    const dispatch = useDispatch()
    // return value and setter
    return [
        useSelector((state: RootState) => state.config.state, shallowEqual),
        state => dispatch(configSlice.actions.setConfigState(state))
    ] as [ConfigState, (state: ConfigState) => void]
}

/** @ignore */
export function useOfflineConfig() {
    const loader = useConfigLoader()
    const { modified, usingLocalConfiguration, readonly } = useSelector(
        (state: RootState) => ({
            modified: state.config.modified,
            usingLocalConfiguration: state.config.usingLocalConfiguration,
            readonly: state.config.readonly
        }),
        shallowEqual
    )
    const offline_config = useSelector((state: RootState) => state.config.current, deepEqual)
    const dispatch = useDispatch()

    return {
        modified,
        usingLocalConfiguration,
        readonly,
        discard() {
            dispatch(configSlice.actions.discardOfflineConfig(null))
        },
        upload(): Promise<void> {
            return loader(offline_config)
        }
    }
}

/**
 * Returns the version of the connected GBC, if available
 */
export function useGbcVersionInfo() {
    const config = useSelector((state: RootState) => state.config)

    return {
        gbcVersion: config.gbcVersion,
        schemaVersion: config.schemaVersion
    }
}

export function useSimilationOnlyConfiguration() {
    return useSelector((state: RootState) => state.config.simulationOnly)
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

    return async (change: Partial<GlowbuzzerConfig>, overwriteCurrent = false): Promise<void> => {
        const next: GlowbuzzerConfig = {
            ...config,
            ...change
        }
        if (connection.connected) {
            await connection.request("load config", { config: next })
            dispatch(configSlice.actions.setConfig(next))
        } else {
            // just do the dispatch, but config is now cached
            dispatch(configSlice.actions.setOfflineConfig(next))
            if (overwriteCurrent) {
                dispatch(configSlice.actions.setConfig(next))
            }
        }
    }
}

/**
 * Returns the configuration for the given tool index.
 *
 * @param toolIndex The tool index
 */
export function useToolConfig(toolIndex: number): ToolConfig {
    return useSelector((state: RootState) => {
        const toolConfig = state.config.current.tool?.[toolIndex] || {
            name: "unknown",
            diameter: 10,
            translation: {},
            rotation: {}
        }
        // ensure there are some sensible defaults
        return {
            ...toolConfig,
            translation: {
                x: 0,
                y: 0,
                z: 0,
                ...toolConfig.translation
            },
            rotation: toolConfig.rotation || { x: 0, y: 0, z: 0, w: 1 }
        }
    }, deepEqual)
}

/**
 * Returns the configuration for all tools.
 */
export function useToolList(): GlowbuzzerConfig["tool"] {
    return useSelector((state: RootState) => state.config.current.tool, deepEqual)
}

/**
 * Returns the default move parameters. This is the first move parameters entry, if configured
 */
export function useDefaultMoveParameters(): MoveParametersConfig {
    return useSelector((state: RootState) => {
        const v = state.config.current.moveParameters?.[0] || { name: "default" }
        // strip the name from move params as it's not valid in websocket message to gbc
        const { name, ...props } = v
        return props
    }, shallowEqual)
}
