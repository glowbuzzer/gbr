/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerConfig, JOINT_TYPE, KC_KINEMATICSCONFIGURATIONTYPE } from "@glowbuzzer/store"

export const config: GlowbuzzerConfig = {
    machine: [
        {
            name: "PICK AND PLACE",
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
    points: [],
    frames: [
        {
            name: "world"
        },
        {
            name: "thomas",
            translation: {
                x: 0,
                y: 0,
                z: 325
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
            jointType: JOINT_TYPE.JOINT_REVOLUTE,
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
            jointType: JOINT_TYPE.JOINT_REVOLUTE,
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
            jointType: JOINT_TYPE.JOINT_REVOLUTE,
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
            jointType: JOINT_TYPE.JOINT_REVOLUTE,
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
            jointType: JOINT_TYPE.JOINT_REVOLUTE,
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
            jointType: JOINT_TYPE.JOINT_REVOLUTE,
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
            kinematicsConfigurationType: KC_KINEMATICSCONFIGURATIONTYPE.KC_SIXDOF,
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
                    vmax: 1,
                    amax: 10,
                    jmax: 100
                }
            ],
            kinChainParams: {
                numRows: 6,
                numCols: 5,
                data: [
                    -90, 0, 0, 0, 0,

                    0, 0, -90, 225, 0,

                    90, 0, 90, 0, 35,

                    -90, 0, 0, 0, 225,

                    90, 0, 0, 0, 0,

                    0, 0, 0, 0, 65
                ]
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
        }
    ],
    din: [
        {
            name: "0"
        },
        {
            name: "1"
        },
        {
            name: "2"
        },
        {
            name: "3"
        }
    ],
    dout: [
        {
            name: "0"
        },
        {
            name: "1"
        },
        {
            name: "2"
        },
        {
            name: "3"
        },
        {
            name: "4"
        },
        {
            name: "5"
        },
        {
            name: "6"
        },
        {
            name: "7"
        },
        {
            name: "8"
        },
        {
            name: "9"
        }
    ],
    ain: [
        {
            name: "0"
        }
    ],
    aout: [
        {
            name: "0"
        }
    ],
    iin: [
        {
            name: "0"
        }
    ],
    iout: [
        {
            name: "0"
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
