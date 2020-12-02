import { createSlice } from "@reduxjs/toolkit"
import { KINEMATICSCONFIGURATIONTYPE } from "../types"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "@glowbuzzer/store"

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
            participatingJoints: [0, 1, 2],
            participatingJointsCount: 3,
            kinematicsParameters: {
                kinematicsConfigurationType: KINEMATICSCONFIGURATIONTYPE.CARTESIAN,
                cartesianParameters: {
                    linearVmax: 10000,
                    linearAmax: 100000,
                    linearJmax: 1000000,
                    tcpRotationalVmax: 100,
                    tcpRotationalAmax: 1000,
                    tcpRotationalJmax: 10000,
                    xExtents: [-10, 10],
                    yExtents: [-10, 10],
                    zExtents: [-10, 10]
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
    }
}

export const configSlice = createSlice({
    name: "config",
    initialState: {
        configReceived: false,
        version: 1,
        // basic default value to avoid errors from components on startup
        value: DEFAULT_CONFIG
    },
    reducers: {
        set(state, action) {
            state.configReceived = true
            state.version++
            console.log("SETTING CONFIG", action.payload)
            state.value = action.payload
        }
    }
})

export function useConfigReceived() {
    return useSelector((state: RootState) => state.config.configReceived, shallowEqual)
}

export function useConfig() {
    return useSelector(
        (state: RootState) => state.config,
        (a, b) => a.version === b.version // only update on version change
    ).value
}
