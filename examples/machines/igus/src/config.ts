/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerConfig } from "@glowbuzzer/store"

export const config: GlowbuzzerConfig = {
    machine: [
        {
            name: "IGUS",
            busCycleTime: 4,
            statusFrequency: 40
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
    joint: [
        {
            name: "0",
            limits: [
                {
                    vmax: 0.2,
                    amax: 2,
                    jmax: 20
                }
            ],
            scale: 79577.47155,
            jointType: 1,
            negLimit: -10,
            posLimit: 145
        },
        {
            name: "1",
            limits: [
                {
                    vmax: 0.2,
                    amax: 2,
                    jmax: 20
                }
            ],
            scale: 76394.37268,
            jointType: 1,
            negLimit: -70,
            posLimit: 110
        },
        {
            name: "2",
            limits: [
                {
                    vmax: 0.2,
                    amax: 2,
                    jmax: 20
                }
            ],
            scale: 76394.37268,
            jointType: 1,
            negLimit: -180,
            posLimit: 180
        },
        {
            name: "3",
            limits: [
                {
                    vmax: 0.2,
                    amax: 2,
                    jmax: 20
                }
            ],
            scale: 44563.38407,
            jointType: 1,
            negLimit: -270,
            posLimit: 270
        },
        {
            name: "4",
            limits: [
                {
                    vmax: 0.2,
                    amax: 2,
                    jmax: 20
                }
            ],
            scale: 60478.87837,
            negLimit: -145,
            posLimit: 145
        }
    ],
    kinematicsConfiguration: [
        {
            name: "default",
            frameIndex: 0,
            participatingJoints: [2, 1, 0, 4, 3],
            participatingJointsCount: 5,
            kinematicsConfigurationType: 2,
            supportedConfigurationBits: 7,
            extentsX: [-1000, 1000],
            extentsY: [-1000, 1000],
            extentsZ: [-1000, 1000],
            linearLimits: [
                {
                    vmax: 200,
                    amax: 4000,
                    jmax: 80000
                }
            ],
            angularLimits: [
                {
                    vmax: 2,
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
    points: [
        {
            name: "point1",
            frameIndex: 0,
            translation: {
                x: 210,
                y: 210,
                z: 400
            },
            rotation: {
                x: 1,
                y: 0,
                z: 0,
                w: 6.123233995736766e-17
            },
            configuration: 0
        },
        {
            name: "point2",
            translation: {
                x: 210,
                y: 390,
                z: 40
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0,
                w: 1
            },
            configuration: 0
        },
        {
            name: "point3",
            translation: {
                x: 290,
                y: 210,
                z: 40
            },
            configuration: 0
        },
        {
            name: "point4",
            translation: {
                x: 290,
                y: 390,
                z: 40
            },
            configuration: 0
        }
    ],
    frames: [
        {
            name: "default",
            translation: {
                z: 275
            }
        },
        {
            name: "robot",
            translation: {
                x: 0,
                y: 0,
                z: 225
            }
        },
        {
            name: "pallet",
            translation: {
                x: 100,
                y: 100,
                z: 0
            }
        },
        {
            name: "part",
            positionReference: 1,
            parentFrameIndex: 2,
            translation: {
                x: 10,
                y: 0,
                z: 0
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
