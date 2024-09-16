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
    joint: [],
    din: [],
    dout: [],
    ain: [],
    aout: [],
    uiin: [],
    uiout: [],
    iin: [],
    iout: [],
    externalDin: [],
    externalDout: [],
    externalUiin: [],
    externalUiout: [],
    externalIin: [],
    externalIout: [],
    safetyDin: [],
    safetyDout: [],
    modbusDin: [],
    modbusDout: [],
    modbusUiin: [],
    modbusUiout: [],
    tool: [],
    points: [],
    activity: [],
    serial: [],
    soloActivity: [],
    spindle: [],
    stream: [],
    task: [],
    moveParameters: []
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
    clearConfig: (state: ConfigSliceState) => void
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
                // const existing = acc[key]
                const overlay = config[key] || []
                // We can't do a deeper merge because of issue where app config
                // omits some default values and assumes they are going to be set to default
                // zero value. For example, kinematicsConfiguration.kinematicsType might not set
                // (for naked kins)
                if (overlay) {
                    acc[key] = overlay
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
        /** @deprecated We don't really support app config */
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

            const current = merge(GlowbuzzerMinimalConfig, remote, state.appConfig, state.local)
            const requiresUpload = !configEqual(current, merge(GlowbuzzerMinimalConfig, remote))

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
            const requiresUpload = !configEqual(
                current,
                merge(GlowbuzzerMinimalConfig, state.remote)
            )
            return {
                ...state,
                local,
                current,
                requiresUpload
            }
        },

        /** Clear the local config */
        clearConfig(state) {
            return {
                ...state,
                local: {},
                current: merge(GlowbuzzerMinimalConfig, state.remote),
                requiresUpload: false
            }
        },

        /** Set config - overrides and resets any locally modified config */
        setConfig() {
            throw new Error("Reducer setConfig is no longer supported!")
        }
    },
    extraReducers: gbdbExtraReducersFactory<ConfigSliceState>(state => {
        // config has been modified by load of gbdb facet (into 'local' state)
        const current = merge(state.current, state.local)
        const requiresUpload = !configEqual(current, merge(GlowbuzzerMinimalConfig, state.remote))
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

export function useLocalConfig() {
    return useSelector((state: RootState) => state.config.local)
}

export function useStaticAppConfig() {
    return useSelector((state: RootState) => state.config.appConfig)
}

export function configMetadata<T extends { $metadata?: any }>(
    configItem: T,
    allowUndefined = false
): T extends {
    $metadata?: any
}
    ? T["$metadata"]
    : never {
    return (configItem as any).$metadata || (allowUndefined ? undefined : {})
}

/**
 * Returns a function that can be used to apply partial updates to the configuration. Configuration
 * changes will be sent to GBC.
 *
 * @deprecated Use GbDb functionality instead
 */
export function useConfigLoader() {
    throw new Error(
        "Config loader is no longer supported - projects should use GbDb functionality instead"
    )
}

export function useConfigSync(): [boolean, () => Promise<void>] {
    const connection = useConnection()
    const localConfig = useLocalConfig()
    const appConfig = useStaticAppConfig()
    const dispatch = useDispatch()
    const gbcInfo = useGbcConfigInfo()
    const requireSync = useSelector((state: RootState) => state.config.requiresUpload)

    return [
        requireSync,
        async () => {
            if (connection.connected) {
                // if app config is specified this will contain a machine name to check against remote name
                const config = { ...appConfig, ...localConfig }
                const response = await connection.request("load config", {
                    config
                })
                dispatch(configSlice.actions.clearConfig())
                const next = {
                    ...gbcInfo,
                    ...response.config
                }
                dispatch(configSlice.actions.setRemoteConfig(next))
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
