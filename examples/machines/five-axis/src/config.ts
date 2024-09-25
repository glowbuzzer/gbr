/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerConfig } from "@glowbuzzer/store"

export const config: GlowbuzzerConfig = {
    machine: [
        {
            name: "POCKET NC",
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
    frames: [
        {
            name: "default"
        }
    ],
    joint: [
        {
            name: "0",
            limits: [
                {
                    vmax: 10,
                    amax: 80,
                    jmax: 1600
                }
            ],
            scale: 10000,
            jointType: 0,
            negLimit: -180,
            posLimit: 180
        },
        {
            name: "1",
            limits: [
                {
                    vmax: 10,
                    amax: 80,
                    jmax: 1600
                }
            ],
            scale: 10000,
            jointType: 0,
            negLimit: -125,
            posLimit: 125
        },
        {
            name: "2",
            limits: [
                {
                    vmax: 10,
                    amax: 80,
                    jmax: 1600
                }
            ],
            scale: 10000,
            jointType: 0,
            negLimit: -138,
            posLimit: 138
        },
        {
            name: "3",
            limits: [
                {
                    vmax: 1,
                    amax: 8,
                    jmax: 160
                }
            ],
            scale: 10000,
            jointType: 1,
            negLimit: -270,
            posLimit: 270
        },
        {
            name: "4",
            limits: [
                {
                    vmax: 1,
                    amax: 8,
                    jmax: 160
                }
            ],
            scale: 10000,
            jointType: 1,
            negLimit: -120,
            posLimit: 133.5
        }
    ],
    kinematicsConfiguration: [
        {
            name: "default",
            frameIndex: 1,
            participatingJoints: [0, 1, 2, 3, 4],
            participatingJointsCount: 5,
            kinematicsConfigurationType: 13,
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
            ],
            kinChainParams: {
                numRows: 6,
                numCols: 5,
                data: [
                    -90, 0, 0, 0, 0, 0, 0, -90, 225, 0, 90, 0, 90, 0, 35, -90, 0, 0, 0, 225, 90, 0,
                    0, 0, 0, 0, 0, 0, 0, 65
                ]
            }
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
