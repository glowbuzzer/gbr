/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerConfig, KC_KINEMATICSCONFIGURATIONTYPE } from "@glowbuzzer/store"

export const sortingAppConfig: GlowbuzzerConfig = {
    machine: [
        {
            name: "default",
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
            name: "0"
        },
        {
            name: "1"
        }
    ],
    frames: [
        {
            name: "0"
        }
    ],
    joint: [
        {
            name: "0",
            limits: [
                {
                    vmax: 250,
                    amax: 5000,
                    jmax: 20000
                }
            ],
            scale: 1000
        },
        {
            name: "1",
            limits: [
                {
                    vmax: 250,
                    amax: 5000,
                    jmax: 20000
                }
            ],
            scale: 1000
        }
    ],
    kinematicsConfiguration: [
        {
            name: "conv1",
            frameIndex: 0,
            participatingJoints: [0],
            participatingJointsCount: 1,
            kinematicsConfigurationType: KC_KINEMATICSCONFIGURATIONTYPE.KC_CARTESIAN,
            linearLimits: [
                {
                    vmax: 2000,
                    amax: 40000,
                    jmax: 800000
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
        },
        {
            name: "conv2",
            frameIndex: 0,
            participatingJoints: [1],
            participatingJointsCount: 1,
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
    din: [
        {
            name: "0"
        },
        {
            name: "MAGIC EYE"
        },
        {
            name: "CYLINDER RETRACTED"
        },
        {
            name: "CYLINDER EXTENDED"
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
        }
    ],
    dout: [
        {
            name: "CYLINDER"
        },
        {
            name: "CAMERA TRIGGER"
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
            name: "MAGIC EYE (LOOPBACK)",
            loopback: 1
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
