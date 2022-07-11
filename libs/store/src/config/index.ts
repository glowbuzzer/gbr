/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createSlice, Slice } from "@reduxjs/toolkit"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import {
    ActivityConfig,
    ACTIVITYTYPE,
    AinConfig,
    AoutConfig,
    ArcsConfig,
    CartesianPositionsConfig,
    DinConfig,
    DoutConfig,
    FieldbusConfig,
    FramesConfig,
    IinConfig,
    IoutConfig,
    JOINT_TYPE,
    JointConfig,
    KC_KINEMATICSCONFIGURATIONTYPE,
    KinematicsConfigurationConfig,
    LinesConfig,
    MachineConfig,
    MoveParametersConfig,
    SpindleConfig,
    TaskConfig,
    ToolConfig,
    TriggerOnConfig
} from "../gbc"
import { RootState } from "../root"
import deepEqual from "fast-deep-equal"
// import { settings } from "../util/settings"

// const { load, save } = settings("store.config") // we will load/save config as it comes from gbc

const DEFAULT_JOINT_CONFIG = {
    jointType: JOINT_TYPE.JOINT_PRISMATIC,
    pmin: -100,
    pmax: 100,
    vmax: 2000,
    amax: 40000,
    jmax: 800000,
    scale: 1000.0
}

/**
 * The configuration uploaded to GBC and which is retrieved by GBR on connection. Each key has a list of configuration objects for that part of the configuration.
 *
 * Each configuration object in the list can have an optional `name` property which will be displayed in the UI.
 *
 * ```js
 * const config:ConfigType={
 *     joint: [
 *         {name: "my joint", ...},
 *         {...},
 *         {...}
 *     ],
 *     frames: [
 *         {...}
 *         {...}
 *     ]
 * }
 *
 * See the individual types for each configuration item for further details.
 * ```
 */
export type ConfigType = {
    machine?: MachineConfig[]
    kinematicsConfiguration?: KinematicsConfigurationConfig[]
    moveParameters?: MoveParametersConfig[]
    joint?: JointConfig[]
    frames?: FramesConfig[]
    task?: TaskConfig[]
    activity?: ActivityConfig[] // TODO: ??
    dout?: DoutConfig[]
    aout?: AoutConfig[]
    iout?: IoutConfig[]
    din?: DinConfig[]
    ain?: AinConfig[]
    iin?: IinConfig[]
    fieldbus?: FieldbusConfig[]
    spindle?: SpindleConfig[]
    tool?: ToolConfig[]
    triggerOn?: TriggerOnConfig[]
}

// TODO: figure out what to do when there is no config yet (before connect)
export const DEFAULT_CONFIG: ConfigType = {
    frames: [{}],
    kinematicsConfiguration: [
        {
            participatingJoints: [0]
        }
    ],
    joint: [{}]
}

export enum ConfigState {
    AWAITING_CONFIG = "AWAITING CONFIG",
    AWAITING_HLC_INIT = "AWAITING INIT",
    READY = "READY"
}

export const configSlice: Slice<{
    state: ConfigState
    version: number
    value: ConfigType
}> = createSlice({
    name: "config",
    initialState: {
        state: ConfigState.AWAITING_CONFIG as ConfigState,
        version: 1,
        // basic default value to avoid errors from components on startup
        value: DEFAULT_CONFIG
    },
    reducers: {
        setConfig(state, action) {
            state.version++
            state.state = ConfigState.AWAITING_HLC_INIT // GlowbuzzerApp will handle this state
            state.value = action.payload
            // save(action.payload)
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
 * Returns the current configuration as provided by GBC.
 */
export function useConfig() {
    return useSelector(
        (state: RootState) => state.config,
        (a, b) => a.version === b.version // only update on version change
    ).value
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
    return useSelector((state: RootState) =>
        state.config.value.tool ? Object.values(state?.config?.value?.tool)[toolIndex] : EMPTY_TOOL
    )
}

/**
 * Returns the configuration for all tools.
 */
export function useToolList(): ToolConfig[] {
    return useSelector((state: RootState) => state.config.value.tool, deepEqual)
}
