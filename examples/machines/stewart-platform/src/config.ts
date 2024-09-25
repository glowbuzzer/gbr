/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerConfig } from "@glowbuzzer/store"

export const config: GlowbuzzerConfig = {
    machine: [
        {
            name: "STEWART PLATFORM",
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
            negLimit: -50,
            posLimit: 400
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
            negLimit: -50,
            posLimit: 400
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
            negLimit: -50,
            posLimit: 400
        },
        {
            name: "3",
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
            negLimit: -50,
            posLimit: 400
        },
        {
            name: "4",
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
            negLimit: -50,
            posLimit: 400
        },
        {
            name: "5",
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
            negLimit: -50,
            posLimit: 400
        }
    ],

    kinematicsConfiguration: [
        {
            name: "Default",
            frameIndex: 0,
            participatingJoints: [0, 1, 2, 3, 4, 5],
            participatingJointsCount: 6,
            kinematicsConfigurationType: 11,
            linearLimits: [
                {
                    vmax: 20,
                    amax: 40,
                    jmax: 80
                },
                {
                    vmax: 20,
                    amax: 40,
                    jmax: 80
                },
                {
                    vmax: 20,
                    amax: 40,
                    jmax: 80
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
                numRows: 14,
                numCols: 3,
                data: [
                    -22.189, -168.545, 0, 22.189, -168.545, 0, 157.06, 65.0562, 0, 134.87, 103.4894,
                    0, -134.87, 103.4894, 0, -157.059, 65.056, 0, -21.706, -123.1, 0, 21.706,
                    -123.1, 0, 117.4615, 42.7525, 0, 95.7555, 80.34845, 0, -95.7555, 80.34845, 0,
                    -117.4615, 42.7525, 0, 0, 0, 300, 303.422941, 0, 0
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
    ],
    frames: [
        {
            name: "Default"
        },
        {
            name: "Machine",
            positionReference: 0,
            parentFrameIndex: 0,
            rotation: {
                x: 0,
                y: 0,
                z: 0,
                w: 1
            },
            translation: {
                x: 0,
                z: 0
            }
        },
        {
            name: "Rotate 90",
            rotation: {
                x: 0.7071068,
                y: 0,
                z: 0,
                w: 0.7071068
            }
        }
    ],
    points: [
        {
            name: "Origin"
        },
        {
            name: "X10",
            translation: {
                x: 10
            }
        },
        {
            name: "R90",
            rotation: {
                x: 0.7071068,
                y: 0,
                z: 0,
                w: 0.7071068
            }
        }
    ],
    tool: [
        {
            name: "Default"
        },
        {
            name: "Tool 1",
            diameter: 10,
            translation: {
                z: -10
            }
        },
        {
            name: "Tool 2",
            diameter: 10,
            translation: {
                z: -20
            }
        },
        {
            name: "Tool 3",
            diameter: 10,
            translation: {
                z: -30
            }
        },
        {
            name: "Tool 4",
            diameter: 10,
            translation: {
                z: -40
            }
        }
    ],
    spindle: [
        {
            name: "Default",
            enableDigitalOutIndex: 0,
            directionDigitalOutIndex: 1,
            directionInvert: false,
            speedAnalogOutIndex: 0
        }
    ],
    moveParameters: [
        {
            name: "Default",
            amaxPercentage: 50,
            blendTimePercentage: 60,
            blendTolerance: 20,
            blendType: 0,
            jmaxPercentage: 10,
            limitConfigurationIndex: 0,
            toolIndex: 1,
            vmaxPercentage: 25
        }
    ],
    task: [
        {
            name: "MyTask",
            activityCount: 2,
            firstActivityIndex: 0
        }
    ],
    activity: [
        {
            name: "move joints at speed 10",
            activityType: 4,
            moveJointsAtVelocity: {
                jointVelocityArray: [10, 10, 10],
                kinematicsConfigurationIndex: 0,
                moveParamsIndex: 0
            }
        },
        {
            name: "dwell for 20",
            activityType: 13,
            dwell: {
                msToDwell: 20
            }
        }
    ]
}
