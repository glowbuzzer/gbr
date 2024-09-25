/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerConfig } from "@glowbuzzer/store"

export const config: GlowbuzzerConfig = {
    machine: [
        {
            name: "PUMA 560",
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
            translation: {
                x: 210,
                y: 210,
                z: 40
            },
            frameIndex: 0,
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
            name: "default"
        },
        {
            name: "robot",
            translation: {
                x: 0,
                y: 0,
                z: 0
            },
            rotation: {
                x: 1,
                y: 0,
                z: 0,
                w: 0
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
    joint: [
        {
            name: "0",
            limits: [
                {
                    vmax: 1,
                    amax: 8,
                    jmax: 160
                }
            ],
            scale: 10000,
            jointType: 1,
            negLimit: -180,
            posLimit: 180
        },
        {
            name: "1",
            limits: [
                {
                    vmax: 1,
                    amax: 8,
                    jmax: 160
                }
            ],
            scale: 10000,
            jointType: 1,
            negLimit: -125,
            posLimit: 125
        },
        {
            name: "2",
            limits: [
                {
                    vmax: 1,
                    amax: 8,
                    jmax: 160
                }
            ],
            scale: 10000,
            jointType: 1,
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
        },
        {
            name: "5",
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
        }
    ],
    kinematicsConfiguration: [
        {
            name: "default",
            frameIndex: 1,
            participatingJoints: [0, 1, 2, 3, 4, 5],
            participatingJointsCount: 6,
            kinematicsConfigurationType: 12,
            supportedConfigurationBits: 7,
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
                numRows: 5,
                numCols: 1,
                data: [431.8, 20.3, 150.05, 431.8, 63.5]
            }
        }
    ],
    tool: [
        {
            name: "default",
            diameter: 10,
            translation: {
                z: 0
            }
        },
        {
            name: "tool1",
            diameter: 20,
            translation: {
                z: 10
            }
        },
        {
            name: "tool2",
            diameter: 30,
            translation: {
                z: 20
            }
        },
        {
            name: "tool3",
            diameter: 10,
            translation: {
                z: 30
            }
        },
        {
            name: "tool4",
            diameter: 50,
            translation: {
                z: 40
            }
        },
        {
            name: "offset_tool",
            diameter: 15,
            translation: {
                y: 35,
                z: 30
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
