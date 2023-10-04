/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerConfig } from "@glowbuzzer/store"

/**
 * This is the configuration for the AWTUBE L machine that can be pushed to the control if needed
 * (for example on first start)
 */
export const config: GlowbuzzerConfig = {
    machine: [
        {
            name: "AWTUBE 14-40LP-40HP-32-25-125-20",
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
                w: 0
            },
            configuration: 0
        }
    ],
    frames: [
        {
            name: "World",
            translation: {
                x: 0,
                y: 0,
                z: 0
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0,
                w: 1
            }
        },
        {
            name: "Robot",
            translation: {
                x: 0,
                y: 0,
                z: 117
            }
        }
    ],
    joint: [
        {
            name: "0",
            limits: [
                {
                    vmax: 0.05,
                    amax: 0.5,
                    jmax: 5
                }
            ],
            scale: 166886,
            jointType: 1,
            negLimit: -80,
            posLimit: 80
        },
        {
            name: "1",
            limits: [
                {
                    vmax: 0.05,
                    amax: 0.5,
                    jmax: 5
                }
            ],
            scale: 166886,
            jointType: 1,
            negLimit: -40,
            posLimit: 40
        },
        {
            name: "2",
            limits: [
                {
                    vmax: 0.05,
                    amax: 0.5,
                    jmax: 5
                }
            ],
            scale: 166886,
            jointType: 1,
            negLimit: -40,
            posLimit: 40
        },
        {
            name: "3",
            limits: [
                {
                    vmax: 0.05,
                    amax: 0.5,
                    jmax: 5
                }
            ],
            scale: 166886,
            jointType: 1,
            negLimit: -170,
            posLimit: 170
        },
        {
            name: "4",
            limits: [
                {
                    vmax: 0.05,
                    amax: 0.5,
                    jmax: 5
                }
            ],
            scale: 166886,
            jointType: 1,
            negLimit: -80,
            posLimit: 80
        },
        {
            name: "5",
            limits: [
                {
                    vmax: 0.05,
                    amax: 0.5,
                    jmax: 5
                }
            ],
            scale: 166886,
            jointType: 1,
            negLimit: -270,
            posLimit: 270
        }
    ],
    kinematicsConfiguration: [
        {
            name: "default",
            frameIndex: 1,
            participatingJoints: [0, 1, 2, 3, 4, 5],
            participatingJointsCount: 6,
            kinematicsConfigurationType: 1,
            supportedConfigurationBits: 7,
            extentsX: [-1000, 1000],
            extentsY: [-1000, 1000],
            extentsZ: [500, 1400],
            sphericalEnvelope: {
                center: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                radius: [0, 500]
            },
            linearLimits: [
                {
                    vmax: 10,
                    amax: 200,
                    jmax: 4000
                }
            ],
            angularLimits: [
                {
                    vmax: 0.05,
                    amax: 0.5,
                    jmax: 5
                }
            ],
            kinChainParams: {
                numRows: 6,
                numCols: 5,
                data: [
                    -90, 0, 0, 0, 0,

                    0, 0, -90, 525, 0,

                    90, 0, 90, 0, 0,

                    -90, 0, 0, 0, 475,

                    90, 0, 0, 0, 0,

                    0, 0, 0, 0, 328
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
