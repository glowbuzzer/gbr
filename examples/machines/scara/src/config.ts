/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerConfig } from "@glowbuzzer/store"

export const config: GlowbuzzerConfig = {
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
            jointType: 1,
            limits: [
                {
                    vmax: 2,
                    amax: 4,
                    jmax: 8
                }
            ],
            scale: 10000000,
            negLimit: -180,
            posLimit: 180
        },
        {
            name: "1",
            finiteContinuous: 1,
            jointType: 1,
            limits: [
                {
                    vmax: 2,
                    amax: 4,
                    jmax: 8
                }
            ],
            scale: 10000000,
            negLimit: -143,
            posLimit: 141
        },
        {
            name: "2",
            finiteContinuous: 1,
            jointType: 0,
            limits: [
                {
                    vmax: 2,
                    amax: 4,
                    jmax: 8
                }
            ],
            scale: 10000000,
            negLimit: -0.1,
            posLimit: 210.1
        },
        {
            name: "3",
            finiteContinuous: 1,
            jointType: 1,
            limits: [
                {
                    vmax: 2,
                    amax: 4,
                    jmax: 8
                }
            ],
            scale: 10000000,
            negLimit: -360,
            posLimit: 360
        }
    ],

    kinematicsConfiguration: [
        {
            name: "Default",
            frameIndex: 1,
            participatingJoints: [0, 1, 2, 3],
            participatingJointsCount: 4,
            kinematicsConfigurationType: 10,
            supportedConfigurationBits: 1,
            linearLimits: [
                {
                    vmax: 40,
                    amax: 80,
                    jmax: 160
                },
                {
                    vmax: 40,
                    amax: 80,
                    jmax: 160
                },
                {
                    vmax: 40,
                    amax: 80,
                    jmax: 160
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
                numRows: 4,
                numCols: 5,
                data: [0, 0, 0, 220, 0, 0, 0, 0, 240, 0, 180, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
        }
    ],
    frames: [
        {
            name: "Default",
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
            name: "Machine",
            positionReference: 1,
            parentFrameIndex: 0,
            rotation: {
                x: 0,
                y: 0,
                z: 1,
                w: 0
            },
            translation: {
                x: 0,
                z: 100
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
    ]
}
