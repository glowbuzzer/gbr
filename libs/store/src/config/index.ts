import { createSlice } from "@reduxjs/toolkit"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { KC_KINEMATICSCONFIGURATIONTYPE } from "../gbc"
import { RootState } from "../root"

const DEFAULT_JOINT_CONFIG = { pmin: -100, pmax: 100, vmax: 2000, amax: 40000, jmax: 800000, scale: 1000.0 }

export const DEFAULT_CONFIG = {
    machine: {
        default: {
            enabled: 1,
            busCycleTime: 1
        }
    },
    kinematicsConfiguration: {
        default: {
            frameIndex: 0,
            participatingJoints: [0, 1, 2],
            participatingJointsCount: 3,
            kinematicsParameters: {
                kinematicsConfigurationType: KC_KINEMATICSCONFIGURATIONTYPE.KC_CARTESIAN,
                xExtents: [-10, 10],
                yExtents: [-10, 10],
                zExtents: [-10, 10],
                cartesianParameters: {
                    linearVmax: 10000,
                    linearAmax: 100000,
                    linearJmax: 1000000,
                    tcpRotationalVmax: 100,
                    tcpRotationalAmax: 1000,
                    tcpRotationalJmax: 10000
                }
            }
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
    jog: {
        0: {
            kinematicsConfigurationIndex: 0
        }
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
            "activity 0": {
                activityType: 4
            }
        }
    },
    dout: {
        0: {},
        1: {}
    },
    din: {
        0: {},
        1: {}
    }
}

export enum ConfigState {
    AWAITING_CONFIG = "AWAITING CONFIG",
    AWAITING_HLC_INIT = "AWAITING INIT",
    READY = "READY"
}

export const configSlice = createSlice({
    name: "config",
    initialState: {
        state: ConfigState.AWAITING_CONFIG,
        version: 1,
        // basic default value to avoid errors from components on startup
        value: DEFAULT_CONFIG
    },
    reducers: {
        setConfig(state, action) {
            state.version++
            state.state = ConfigState.AWAITING_HLC_INIT // GlowbuzzerApp will handle this state
            state.value = action.payload
        },
        setConfigState(state, action) {
            state.state = action.payload
        }
    }
})

export function useConfigState() {
    const dispatch = useDispatch()
    // return value and setter
    return [useSelector((state: RootState) => state.config.state, shallowEqual), state => dispatch(configSlice.actions.setConfigState(state))] as [
        ConfigState,
        (state: ConfigState) => void
    ]
}

export function useConfig() {
    return useSelector(
        (state: RootState) => state.config,
        (a, b) => a.version === b.version // only update on version change
    ).value
}
