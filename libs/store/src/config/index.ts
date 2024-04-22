/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { GlowbuzzerConfig, MoveParametersConfig, ToolConfig } from "../gbc"
import { RootState } from "../root"
import deepEqual from "fast-deep-equal"
import { useConnection } from "../connect"
import { gbdbExtraReducersFactory } from "../gbdb"

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

type GbcConfigResponse = GlowbuzzerConfig & {
    gbcVersion: string
    schemaVersion: string
    readonly: boolean
    simulationOnly: boolean
}

export type ConfigSliceState = {
    state: ConfigState
    readonly: boolean
    simulationOnly: boolean
    gbcVersion: string
    schemaVersion: string
    version: number
    requiresUpload: boolean
    current: GlowbuzzerConfig
    remote?: GlowbuzzerConfig
    local?: GlowbuzzerConfig
    appConfig?: GlowbuzzerConfig
    // overlay?: Pick<
    //     GlowbuzzerConfig,
    //     "tool" | "frames" | "kinematicsConfiguration" | "joint" | "points"
    // >
}

type ConfigSliceReducers = {
    setRemoteConfig: (state: ConfigSliceState, action: PayloadAction<GbcConfigResponse>) => void
    setAppConfig: (state: ConfigSliceState, action: PayloadAction<GlowbuzzerConfig>) => void
    addConfig: (state: ConfigSliceState, action: PayloadAction<GlowbuzzerConfig>) => void
    setConfig: (state: ConfigSliceState, action: PayloadAction<GlowbuzzerConfig>) => void
}

function merge(...configs: GlowbuzzerConfig[]): GlowbuzzerConfig {
    return configs.reduce((acc, config) => {
        if (!config) {
            return acc
        }
        // patch the current config with the new config
        for (const key in config) {
            if (acc[key] === undefined) {
                acc[key] = config[key]
            } else {
                const existing = acc[key]
                const overlay = config[key]
                // all the values in config are arrays or undefined
                if (!existing || existing.length !== overlay.length) {
                    // if the lengths to merge are different, we assume the overlay should overwrite all
                    acc[key] = overlay
                } else {
                    // we're only interested in merging the top-level properties of objects in array
                    // TODO: M: We might need to do a more selective merge here.
                    //          For example kinematicsConfiguration.frameIndex might be overridden
                    acc[key] = overlay.map((v: object, i: number) => ({ ...existing[i], ...v }))
                }
            }
        }
        return acc
    }, {})
}

function configEqual(a: GlowbuzzerConfig, b: GlowbuzzerConfig) {
    // we don't really care about points being different because they are not used by GBC
    // and we don't want to force an upload just because of a point change
    if (!a || !b) {
        // if either is undefined, we can't compare so just return if both are undefined
        return a === b
    }
    const { points: a_points, ...a_config } = a
    const { points: b_points, ...b_config } = b
    return deepEqual(a_config, b_config)
}

export const configSlice: Slice<ConfigSliceState, ConfigSliceReducers> = createSlice({
    name: "config",
    initialState: {
        state: ConfigState.AWAITING_CONFIG,
        readonly: false,
        simulationOnly: false,
        gbcVersion: null,
        schemaVersion: null,
        requiresUpload: false,
        usingLocalConfiguration: false,
        version: 1,
        current: GlowbuzzerMinimalConfig,
        remote: null
    } as ConfigSliceState,
    reducers: {
        /** Set the app config - will overlay onto the current config (which may be loaded from local storage or empty) */
        setAppConfig(state, action) {
            // we will attempt to load the last config from local storage and overlay the app config
            const appConfig = action.payload
            // this happens early in the lifecycle, so we don't need to worry about locally loaded config
            const current = appConfig

            return {
                ...state,
                appConfig,
                current
            }
        },

        /** Set config from GBC after connect */
        setRemoteConfig(state, action) {
            const { gbcVersion, schemaVersion, readonly, simulationOnly, ...remote } =
                action.payload

            const current = merge(remote, state.appConfig, state.local)
            const requiresUpload = !configEqual(current, remote)

            return {
                ...state,
                state: ConfigState.READY,
                version: state.version + 1, // TODO: remove?
                gbcVersion,
                schemaVersion,
                readonly,
                simulationOnly,
                current,
                remote,
                requiresUpload
            }
        },

        /** Set the overlay config - merged with app config and remote config */
        addConfig(state, action) {
            const local = merge(state.local, action.payload)
            const current = merge(state.current, state.appConfig, local)
            const requiresUpload = !configEqual(current, state.remote)
            console.log(
                "add config called, resulting config: ",
                current,
                "from",
                "payload",
                action.payload,
                "local state",
                state.local,
                "local merged",
                local
            )
            return {
                ...state,
                local,
                current,
                requiresUpload
            }
        },

        /** Set config - overrides and resets any locally modified config */
        setConfig(state, action) {
            throw new Error("Reducer setConfig is no longer supported!")
            // state.version++
            // state.modified = false
            // state.remote = null
            // state.current = action.payload
            // persist(state)
        }
    },
    extraReducers: gbdbExtraReducersFactory<ConfigSliceState>((state, action) => {
        // config has been modified by load of gbdb facet (into 'local' state)
        const current = merge(state.current, state.local)
        // console.log("local", JSON.parse(JSON.stringify(state.local, null, 2)))
        // console.log("extra reducer called", JSON.parse(JSON.stringify(current, null, 2)))
        const requiresUpload = !configEqual(current, state.remote)
        return {
            ...state,
            current,
            requiresUpload
        }
    })
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
    return useSelector((state: RootState) => state.config.state)
}

/**
 * Returns the version of the connected GBC, if available
 */
export function useGbcConfigInfo() {
    const config = useSelector((state: RootState) => state.config)

    const { gbcVersion, schemaVersion, readonly, simulationOnly } = config
    return {
        gbcVersion,
        schemaVersion,
        readonly,
        simulationOnly
    }
}

export function useSimilationOnlyConfiguration() {
    return useSelector((state: RootState) => state.config.simulationOnly)
}

/**
 * Returns the current configuration as provided by GBC.
 */
export function useConfig() {
    return useSelector((state: RootState) => state.config.current)
}

/**
 * Returns a function that can be used to apply partial updates to the configuration. Configuration
 * changes will be sent to GBC.
 */
export function useConfigLoader() {
    // const connection = useConnection()
    // const config = useConfig()
    // const dispatch = useDispatch()

    console.error(
        "Config loader is no longer supported - projects should use GbDb functionality instead"
    )

    return async (change: Partial<GlowbuzzerConfig>, overwriteCurrent = false): Promise<void> => {
        // const next: GlowbuzzerConfig = {
        //     ...config,
        //     ...change
        // }
        // if (connection.connected) {
        //     await connection.request("load config", { config: next })
        //     dispatch(configSlice.actions.setConfig(next))
        // } else {
        //     // just do the dispatch, but config is now cached
        //     dispatch(configSlice.actions.setOfflineConfig(next))
        //     if (overwriteCurrent) {
        //         dispatch(configSlice.actions.setConfig(next))
        //     }
        // }
    }
}

export function useConfigSync(): [boolean, () => Promise<void>] {
    const connection = useConnection()
    const config = useConfig()
    const dispatch = useDispatch()
    const gbcInfo = useGbcConfigInfo()
    const requireSync = useSelector((state: RootState) => state.config.requiresUpload)

    return [
        requireSync,
        async () => {
            if (connection.connected) {
                await connection.request("load config", { config })
                dispatch(configSlice.actions.setRemoteConfig({ ...gbcInfo, ...config }))
            }
        }
    ]
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
