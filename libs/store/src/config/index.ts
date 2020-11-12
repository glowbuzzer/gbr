import { createSlice } from "@reduxjs/toolkit"
import { ACTIVITYTYPE, KINEMATICSCONFIGURATIONTYPE } from "../types"
import { useSelector } from "react-redux"
import { RootState } from "@glowbuzzer/store"

const DEFAULT_JOINT_CONFIG = { pmin: -100, pmax: 100, vmax: 2000, amax: 40000, jmax: 800000, scale: 1000.0 }

export const configSlice = createSlice({
    name: "config",
    initialState: {
        machine: {
            default: {
                enabled: 1,
                busCycleTime: 40 // set to ~40 if using AK_DEBUG_HACK
            }
        },
        fieldbus: {
            0: {
                jointCount: 10,
                RxPdo: {
                    machineStatuswordOffset: 0,
                    heartbeatOffset: 4,
                    jointStatuswordOffset: 8,
                    jointActualPositionOffset: 28,
                    jointActualVelocityOffset: 68,
                    jointActualTorqueOffset: 108,
                    digitalOffset: 148,
                    digitalCount: 64,
                    analogOffset: 156,
                    analogCount: 6,
                    integerOffset: 180,
                    integerCount: 4
                },
                TxPdo: {
                    machineControlwordOffset: 0,
                    heartbeatOffset: 4,
                    jointControlwordOffset: 8,
                    jointSetPositionOffset: 28,
                    jointSetVelocityOffset: 68,
                    jointSetTorqueOffset: 108,
                    digitalOffset: 148,
                    digitalCount: 64,
                    analogOffset: 156,
                    analogCount: 6,
                    integerOffset: 180,
                    integerCount: 4
                }
            }
        },
        task: {
            "oscillate joint 0": {
                activity1: {
                    activityType: ACTIVITYTYPE.MOVEJOINTS
                },
                activity2: {
                    activityType: ACTIVITYTYPE.MOVEJOINTS
                }
            }
        },
        kinematicsConfiguration: {
            default: {
                participatingJoints: [0, 1, 2],
                participatingJointsCount: 3,
                kinematicsParameters: {
                    kinematicsConfigurationType: KINEMATICSCONFIGURATIONTYPE.CARTESIAN,
                    cartesianParameters: {
                        extents: [
                            [-100, 100],
                            [-100, 100],
                            [-100, 100]
                        ],
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
        }
    },
    reducers: {}
})

export function useConfig() {
    return useSelector(
        ({ config }: RootState) => config,
        () => true /* config never changes */
    )
}
