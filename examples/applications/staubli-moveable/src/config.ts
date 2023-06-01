/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerConfig } from "@glowbuzzer/store"

const JOINT_SCALE = 1000000

export const config: GlowbuzzerConfig = {
    machine: [
        {
            name: "MOVEABLE STAUBLI TX40",
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
            frameIndex: 2,
            translation: {
                x: -1296.072088,
                y: 420.201074,
                z: -150
            },
            rotation: {
                x: -0.5294895069388674,
                y: 0.4367770731254619,
                z: 0.06052237274791161,
                w: 0.724709385085189
            },
            configuration: 0
        },
        {
            name: "point2",
            frameIndex: 2,
            translation: {
                x: -498.843729,
                y: 383.71176,
                z: -150
            },
            rotation: {
                x: -0.7071099974887766,
                y: 0.00006199991607229216,
                z: -0.00006200048057078487,
                w: 0.7071035594333924
            },
            configuration: 0
        },
        {
            name: "point3",
            frameIndex: 2,
            translation: {
                x: 500.043961,
                y: 383.719657,
                z: -150
            },
            rotation: {
                x: -0.6743752406488375,
                y: -0.21258285998556473,
                z: 0.2125690752674474,
                w: 0.6744189726572962
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
            name: "Platform",
            positionReference: 1,
            parentFrameIndex: 0,
            translation: {
                x: 0,
                y: 0,
                z: 300
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
            positionReference: 1,
            parentFrameIndex: 1,
            translation: {
                x: 0,
                y: 0,
                z: 325
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0,
                w: 1
            }
        }
    ],
    joint: [
        {
            name: "Wa",
            limits: [
                {
                    vmax: 1,
                    amax: 8,
                    jmax: 160
                }
            ],
            scale: JOINT_SCALE,
            jointType: 1,
            negLimit: -180,
            posLimit: 180
        },
        {
            name: "Sh",
            limits: [
                {
                    vmax: 1,
                    amax: 8,
                    jmax: 160
                }
            ],
            scale: JOINT_SCALE,
            jointType: 1,
            negLimit: -125,
            posLimit: 125
        },
        {
            name: "El",
            limits: [
                {
                    vmax: 1,
                    amax: 8,
                    jmax: 160
                }
            ],
            scale: JOINT_SCALE,
            jointType: 1,
            negLimit: -138,
            posLimit: 138
        },
        {
            name: "Wr",
            limits: [
                {
                    vmax: 1,
                    amax: 8,
                    jmax: 160
                }
            ],
            scale: JOINT_SCALE,
            jointType: 1,
            negLimit: -270,
            posLimit: 270
        },
        {
            name: "Ha",
            limits: [
                {
                    vmax: 1,
                    amax: 8,
                    jmax: 160
                }
            ],
            scale: JOINT_SCALE,
            jointType: 1,
            negLimit: -120,
            posLimit: 133.5
        },
        {
            name: "To",
            limits: [
                {
                    vmax: 1,
                    amax: 8,
                    jmax: 160
                }
            ],
            scale: JOINT_SCALE,
            jointType: 1,
            negLimit: -270,
            posLimit: 270
        },
        {
            name: "TR",
            limits: [
                {
                    vmax: 1200,
                    amax: 12000,
                    jmax: 120000
                }
            ],
            scale: JOINT_SCALE,
            jointType: 0,
            negLimit: -2000,
            posLimit: 2000
        }
    ],
    kinematicsConfiguration: [
        {
            name: "default",
            frameIndex: 2,
            participatingJoints: [0, 1, 2, 3, 4, 5, 6],
            participatingJointsCount: 7,
            kinematicsConfigurationType: 15,
            extentsX: [-2000, 2000],
            extentsY: [-2000, 2000],
            extentsZ: [-200, 840],
            linearLimits: [
                {
                    vmax: 1200,
                    amax: 12000,
                    jmax: 120000
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
