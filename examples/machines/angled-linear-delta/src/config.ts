/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerConfig, POSITIONREFERENCE } from "@glowbuzzer/store"

export const config: GlowbuzzerConfig = {
    machine: [
        {
            name: "IGUS DELTA - DLE_DR_0001",
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
        },
        {
            name: "aux"
        }
    ],
    joint: [
        {
            name: "0",
            finiteContinuous: 1,
            jointType: 0,
            limits: [
                {
                    vmax: 20,
                    amax: 40,
                    jmax: 80
                }
            ],
            scale: 100000,
            negLimit: -0.1,
            posLimit: 146.8
        },
        {
            name: "1",
            finiteContinuous: 1,
            jointType: 0,
            limits: [
                {
                    vmax: 20,
                    amax: 40,
                    jmax: 80
                }
            ],
            scale: 100000,
            negLimit: -0.1,
            posLimit: 146.8
        },
        {
            name: "2",
            finiteContinuous: 1,
            jointType: 0,
            limits: [
                {
                    vmax: 20,
                    amax: 40,
                    jmax: 80
                }
            ],
            scale: 100000,
            negLimit: -0.1,
            posLimit: 146.8
        }
    ],
    points: [
        {
            name: "point1",
            frameIndex: 0,
            translation: {
                x: 70,
                y: 0,
                z: 180
            },
            rotation: {
                x: 1,
                y: 0,
                z: 0,
                w: 0
            },
            configuration: 0
        },
        {
            name: "point2",
            frameIndex: 0,
            translation: {
                x: 130,
                y: 0,
                z: 190
            },
            rotation: {
                x: 1,
                y: 0,
                z: 0,
                w: 0
            },
            configuration: 0
        }
    ],
    frames: [
        {
            name: "World"
        },
        {
            name: "Delta",
            parentFrameIndex: 0,
            positionReference: POSITIONREFERENCE.RELATIVE,
            translation: {
                x: 100,
                z: 745
            }
        }
    ],
    kinematicsConfiguration: [
        {
            name: "Default",
            frameIndex: 1,
            participatingJoints: [0, 1, 2],
            participatingJointsCount: 3,
            kinematicsConfigurationType: 9,
            extentsX: [-1000, 1000],
            extentsY: [-1000, 100],
            extentsZ: [-1000, 1000],
            linearLimits: [
                {
                    vmax: 200,
                    amax: 400,
                    jmax: 800
                },
                {
                    vmax: 200,
                    amax: 400,
                    jmax: 800
                },
                {
                    vmax: 200,
                    amax: 400,
                    jmax: 800
                }
            ],
            angularLimits: [
                {
                    vmax: 1,
                    amax: 10,
                    jmax: 100
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
