/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {
    GlowbuzzerConfig,
    JOINT_FINITECONTINUOUS,
    JOINT_TYPE,
    KC_KINEMATICSCONFIGURATIONTYPE
} from "@glowbuzzer/store"

export const config: GlowbuzzerConfig = {
    machine: [
        {
            name: "CARTESIAN ROUTER",
            busCycleTime: 4
        }
    ],
    stream: [
        {
            name: "default"
        }
    ],
    soloActivity: [
        {
            name: "default"
        }
    ],
    frames: [{}],
    joint: [
        {
            name: "0",
            jointType: JOINT_TYPE.JOINT_REVOLUTE,
            finiteContinuous: JOINT_FINITECONTINUOUS.JOINT_CONTINUOUS,
            limits: [
                {
                    vmax: 200,
                    amax: 4000,
                    jmax: 80000
                }
            ],
            scale: 10000
        },
        {
            name: "1",
            jointType: JOINT_TYPE.JOINT_REVOLUTE,
            finiteContinuous: JOINT_FINITECONTINUOUS.JOINT_CONTINUOUS,
            limits: [
                {
                    vmax: 200,
                    amax: 4000,
                    jmax: 80000
                }
            ],
            scale: 10000
        },
        {
            name: "2",
            jointType: JOINT_TYPE.JOINT_REVOLUTE,
            finiteContinuous: JOINT_FINITECONTINUOUS.JOINT_CONTINUOUS,
            limits: [
                {
                    vmax: 200,
                    amax: 4000,
                    jmax: 80000
                }
            ],
            scale: 10000
        }
    ],
    kinematicsConfiguration: [
        {
            name: "default",
            frameIndex: 0,
            participatingJoints: [0, 1, 2],
            participatingJointsCount: 3,
            kinematicsConfigurationType: KC_KINEMATICSCONFIGURATIONTYPE.KC_CARTESIAN,
            linearLimits: [
                {
                    vmax: 200,
                    amax: 4000,
                    jmax: 80000
                }
            ],
            angularLimits: [
                {
                    vmax: 100,
                    amax: 1000,
                    jmax: 10000
                }
            ]
            // kinChainParams: {
            //     numRows: 6,
            //     numCols: 5,
            //     data: [
            //         -90, 0, 0, 0, 0, 0, 0, -90, 225, 0, 90, 0, 90, 0, 35, -90, 0, 0, 0, 225, 90, 0,
            //         0, 0, 0, 0, 0, 0, 0, 65
            //     ]
            // }
        }
    ],
    fieldbus: [
        {
            name: "0",
            jointCount: 10,
            RxPdo: {
                machineStatusWordOffset: 0,
                activeFaultOffset: 4,
                faultHistoryOffset: 8,
                heartbeatOffset: 12,
                jointStatuswordOffset: 16,
                jointActualPositionOffset: 36,
                jointActualVelocityOffset: 76,
                jointActualTorqueOffset: 116,
                digitalOffset: 156,
                digitalCount: 8,
                analogOffset: 164,
                analogCount: 6,
                integerOffset: 188,
                integerCount: 2
            },
            TxPdo: {
                machineControlWordOffset: 0,
                gbcControlWordOffset: 4,
                hlcControlWordOffset: 8,
                heartbeatOffset: 12,
                jointControlwordOffset: 16,
                jointSetPositionOffset: 36,
                jointSetVelocityOffset: 76,
                jointSetTorqueOffset: 116,
                digitalOffset: 156,
                digitalCount: 10,
                analogOffset: 164,
                analogCount: 6,
                integerOffset: 188,
                integerCount: 2
            }
        }
    ]
}
