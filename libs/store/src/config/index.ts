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
 * The configuration uploaded to GBC and which is retrieved by GBR on connection. The keyed properties
 * allow naming of individual config items, or they can be simple numeric keys, for example:
 * ```js
 * const config:ConfigType={
 *     joint: {
 *         0: {...},
 *         1: {...},
 *         2: {...}
 *     },
 *     frames: {
 *         "robot": {...}
 *         "pallet": {...}
 *     }
 * }
 *
 * See the individual types for each configuration item for further details.
 * ```
 */
export type ConfigType = {
    machine: { [index: string]: MachineConfig }
    kinematicsConfiguration: { [index: string]: KinematicsConfigurationConfig }
    moveParameters: { [index: string]: MoveParametersConfig }
    joint: { [index: string]: JointConfig }
    frames: { [index: string]: FramesConfig }
    task?: { [index: string]: TaskConfig }
    activity?: { [index: string]: ActivityConfig }
    dout?: { [index: string]: DoutConfig }
    aout?: { [index: string]: AoutConfig }
    iout?: { [index: string]: IoutConfig }
    din?: { [index: string]: DinConfig }
    ain?: { [index: string]: AinConfig }
    iin?: { [index: string]: IinConfig }
    fieldbus?: { [index: string]: FieldbusConfig }
    lines?: { [index: string]: LinesConfig }
    arcs?: { [index: string]: ArcsConfig }
    cartesianPositions?: { [index: string]: CartesianPositionsConfig }
    tool?: { [index: string]: ToolConfig }
    triggerOn?: { [index: string]: TriggerOnConfig }
}

// TODO: figure out what to do when there is no config yet (before connect)
export const DEFAULT_CONFIG: ConfigType = {
    machine: {
        default: {
            busCycleTime: 1
        }
    },
    kinematicsConfiguration: {
        default: {
            frameIndex: 0,
            participatingJoints: [0, 1, 2],
            participatingJointsCount: 3,
            kinematicsConfigurationType: KC_KINEMATICSCONFIGURATIONTYPE.KC_CARTESIAN,
            extentsX: [-10, 10],
            extentsY: [-10, 10],
            extentsZ: [-10, 10],
            linearLimits: [
                {
                    vmax: 10000,
                    amax: 100000,
                    jmax: 1000000
                }
            ],
            angularLimits: [
                {
                    vmax: 100,
                    amax: 1000,
                    jmax: 10000
                }
            ]
        }
    },
    moveParameters: {
        default: { vmaxPercentage: 100, amaxPercentage: 100, jmaxPercentage: 100 }
    },
    joint: {
        0: DEFAULT_JOINT_CONFIG,
        1: DEFAULT_JOINT_CONFIG,
        2: DEFAULT_JOINT_CONFIG
    },
    frames: {
        0: {
            translation: { x: 0, y: 0, z: 0 }
        }
    },
    task: {
        // only here for a bit of code completion
        // (replaced by actual config from GBC)
        "task 0": {
            firstActivityIndex: 0
        }
    },
    activity: {
        "activity 0": {
            activityType: ACTIVITYTYPE.ACTIVITYTYPE_DWELL,
            dwell: {
                ticksToDwell: 1000
            }
        }
    },
    dout: {
        0: {},
        1: {}
    },
    aout: {
        0: {},
        1: {}
    },
    iout: {
        0: {},
        1: {}
    },
    din: {
        0: {},
        1: {}
    },
    ain: {
        0: {},
        1: {}
    },
    iin: {
        0: {},
        1: {}
    }
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
export function useToolList(): { [index: string]: ToolConfig } {
    return useSelector((state: RootState) => state.config.value.tool || {}, deepEqual)
}
