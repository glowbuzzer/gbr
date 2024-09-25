/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerConfig } from "@glowbuzzer/store"
import { staubli_tx40_kin_chain_params } from "../../../util/kinematics/KinChainParams"

export const config: GlowbuzzerConfig = {
    machine: [
        {
            name: "STAUBLI DANCE",
            busCycleTime: 4,
            statusFrequency: 50
        }
    ],
    stream: [
        {
            name: "Thomas"
        },
        {
            name: "Lucy"
        }
    ],
    soloActivity: [
        {
            name: "Thomas"
        },
        {
            name: "Lucy"
        }
    ],
    points: [
        {
            name: "Point1",
            translation: {
                x: 300,
                y: 100,
                z: 250
            },
            rotation: {
                x: 0.6547971573,
                y: 0.266909503,
                z: 0.2669095029999014,
                w: 0.6547971573002419
            }
        },
        {
            name: "Point2",
            translation: {
                x: 300,
                y: -100,
                z: 250
            },
            rotation: {
                x: -0.7071530001974361,
                y: -0.0000019988290900649497,
                z: 0.0000019990904168421206,
                w: 0.7070605591487714
            },
            configuration: 0
        },
        {
            name: "Point3",
            translation: {
                x: 200,
                y: 0,
                z: 300
            },
            rotation: {
                x: 0.7088173033,
                y: -0.0018869218,
                z: 0.7053870881,
                w: -0.0018777903
            },
            configuration: 0
        }
    ],
    frames: [
        {
            name: "default"
        },
        {
            name: "Thomas",
            translation: {
                x: -300,
                y: 0,
                z: 325
            }
        },
        {
            name: "Lucy",
            translation: {
                x: 300,
                y: 0,
                z: 325
            },
            rotation: {
                x: 0,
                y: 0,
                z: 1,
                w: 0
            }
        }
    ],
    joint: [
        {
            name: "T0",
            limits: [
                {
                    vmax: 1,
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
            name: "T1",
            limits: [
                {
                    vmax: 1,
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
            name: "T2",
            limits: [
                {
                    vmax: 1,
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
            name: "T3",
            limits: [
                {
                    vmax: 1,
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
            name: "T4",
            limits: [
                {
                    vmax: 1,
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
            name: "T5",
            limits: [
                {
                    vmax: 1,
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
            name: "L0",
            limits: [
                {
                    vmax: 1,
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
            name: "L1",
            limits: [
                {
                    vmax: 1,
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
            name: "L2",
            limits: [
                {
                    vmax: 1,
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
            name: "L3",
            limits: [
                {
                    vmax: 1,
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
            name: "L4",
            limits: [
                {
                    vmax: 1,
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
            name: "L5",
            limits: [
                {
                    vmax: 1,
                    amax: 8,
                    jmax: 160
                }
            ],
            scale: 100000,
            jointType: 1,
            negLimit: -270,
            posLimit: 270
        }
    ],
    kinematicsConfiguration: [
        {
            name: "Thomas",
            frameIndex: 1,
            participatingJoints: [0, 1, 2, 3, 4, 5],
            participatingJointsCount: 6,
            kinematicsConfigurationType: 1,
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
            kinChainParams: staubli_tx40_kin_chain_params
        },

        {
            name: "Lucy",
            frameIndex: 2,
            participatingJoints: [6, 7, 8, 9, 10, 11],
            participatingJointsCount: 6,
            kinematicsConfigurationType: 1,
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
            kinChainParams: staubli_tx40_kin_chain_params
        }
    ],
    tool: [
        {
            name: "default",
            diameter: 10,
            translation: {
                z: 40
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
    din: [],
    dout: [],
    ain: [],
    aout: [],
    iin: [],
    iout: []
}
