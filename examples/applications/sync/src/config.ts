/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerConfig } from "@glowbuzzer/store"

export const config: GlowbuzzerConfig = {
    machine: [
        {
            name: "TSYNC STAUBLI TX40",
            busCycleTime: 4,
            statusFrequency: 50
        }
    ],
    stream: [
        {
            name: "default"
        },
        {
            name: "aux"
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
            limits: [
                {
                    vmax: 1.5,
                    amax: 8,
                    jmax: 160
                }
            ],
            scale: 100000,
            jointType: 1,
            negLimit: -180,
            posLimit: 180
        },
        {
            name: "1",
            limits: [
                {
                    vmax: 1.5,
                    amax: 8,
                    jmax: 160
                }
            ],
            scale: 100000,
            jointType: 1,
            negLimit: -125,
            posLimit: 125
        },
        {
            name: "2",
            limits: [
                {
                    vmax: 1.5,
                    amax: 8,
                    jmax: 160
                }
            ],
            scale: 100000,
            jointType: 1,
            negLimit: -138,
            posLimit: 138
        },
        {
            name: "3",
            limits: [
                {
                    vmax: 1.5,
                    amax: 8,
                    jmax: 160
                }
            ],
            scale: 100000,
            jointType: 1,
            negLimit: -270,
            posLimit: 270
        },
        {
            name: "4",
            limits: [
                {
                    vmax: 1.5,
                    amax: 8,
                    jmax: 160
                }
            ],
            scale: 100000,
            jointType: 1,
            negLimit: -120,
            posLimit: 133.5
        },
        {
            name: "5",
            limits: [
                {
                    vmax: 3,
                    amax: 20,
                    jmax: 200
                }
            ],
            scale: 100000,
            jointType: 1,
            negLimit: -270,
            posLimit: 270
        },
        {
            name: "M1J0",
            finiteContinuous: 0,
            negLimit: -350,
            posLimit: 350,
            jointType: 0,
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
            name: "M1J1",
            finiteContinuous: 0,
            negLimit: -350,
            posLimit: 350,
            jointType: 0,
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
            name: "Robot",
            frameIndex: 1,
            participatingJoints: [0, 1, 2, 3, 4, 5],
            participatingJointsCount: 6,
            kinematicsConfigurationType: 1,
            supportedConfigurationBits: 7,
            linearLimits: [
                {
                    vmax: 500,
                    amax: 4000,
                    jmax: 80000
                }
            ],
            angularLimits: [
                {
                    vmax: 1.5,
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
        },
        {
            name: "Puck",
            frameIndex: 0,
            participatingJoints: [6, 7],
            participatingJointsCount: 2,
            kinematicsConfigurationType: 4,
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
    ],
    frames: [
        {
            name: "Default"
        },
        {
            name: "robot",
            translation: {
                x: 0,
                y: 0,
                z: 325
            }
        }
    ],
    points: [
        {
            name: "Home",
            translation: {
                x: 400,
                y: 35,
                z: 100
            },
            rotation: {
                x: 0,
                y: 1,
                z: 0,
                w: 0
            }
        }
    ],
    tool: [
        {
            name: "Default"
        }
    ]
}
