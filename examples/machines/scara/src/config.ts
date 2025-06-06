/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerConfig } from "@glowbuzzer/store"

export const config: GlowbuzzerConfig = {
    machine: [
        {
            name: "default",
            busCycleTime: 4,
            heartbeatTimeout: 20000
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
    dout: [
        {
            name: "DOUT 1"
        }
    ],
    iout: [
        {
            name: "IOUT 1"
        }
    ],
    uiout: [
        {
            name: "UIOUT 1"
        }
    ],
    aout: [
        {
            name: "AOUT 1"
        }
    ],
    joint: [
        {
            name: "0",
            finiteContinuous: 1,
            jointType: 1,
            limits: [
                {
                    vmax: 4,
                    amax: 40,
                    jmax: 800
                }
            ],
            scale: 10000000,
            negLimit: -360,
            posLimit: 360
        },
        {
            name: "1",
            finiteContinuous: 1,
            jointType: 1,
            limits: [
                {
                    vmax: 4,
                    amax: 40,
                    jmax: 800
                }
            ],
            scale: 10000000,
            negLimit: -360,
            posLimit: 360
        },
        {
            name: "2",
            finiteContinuous: 1,
            jointType: 0,
            limits: [
                {
                    vmax: 200,
                    amax: 4000,
                    jmax: 80000
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
                    vmax: 20,
                    amax: 400,
                    jmax: 8000
                }
            ],
            scale: 10000000
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
                    vmax: 160,
                    amax: 800,
                    jmax: 8000
                },
                {
                    vmax: 160,
                    amax: 800,
                    jmax: 8000
                },
                {
                    vmax: 160,
                    amax: 800,
                    jmax: 8000
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
            name: "Home",
            translation: {
                x: -350,
                y: 0,
                z: 120
            }
        }
    ],
    tool: [
        {
            name: "Default"
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
    ]
}
