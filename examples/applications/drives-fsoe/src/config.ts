/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {
    DIN_SAFETY_TYPE,
    GlowbuzzerConfig,
    JOINT_MODEOFOPERATION,
    JOINT_TORQUE_MODE
} from "@glowbuzzer/store"

export const config: GlowbuzzerConfig = {
    machine: [
        {
            name: "DRIVES FSoE CONFIG",
            busCycleTime: 1
        }
    ],
    joint: [
        {
            name: "J1",
            limits: [
                {
                    vmax: 0.25,
                    amax: 2,
                    jmax: 4
                }
            ],
            scalePos: 166886,
            scaleVel: 9549,
            scaleTorque: 32.68,
            jointType: 1,
            pidConfig: [
                {
                    kp: 0.001,
                    ki: 0.0,
                    kd: 0.0,
                    maxIntegral: 2000,
                    minIntegral: -2000,
                    sampleTime: 20
                }
            ],
            preferredMode: JOINT_MODEOFOPERATION.JOINT_MODEOFOPERATION_CSP,
            supportedModes:
                JOINT_MODEOFOPERATION.JOINT_MODEOFOPERATION_CSP |
                JOINT_MODEOFOPERATION.JOINT_MODEOFOPERATION_CST |
                JOINT_MODEOFOPERATION.JOINT_MODEOFOPERATION_CSV,
            supportedTorqueModes:
                JOINT_TORQUE_MODE.JOINT_TORQUE_MODE_GRAVITY |
                JOINT_TORQUE_MODE.JOINT_TORQUE_MODE_DIRECT
        },
        {
            name: "J2",
            limits: [
                {
                    vmax: 200,
                    amax: 4000,
                    jmax: 80000
                }
            ],
            scalePos: 166886,
            scaleVel: 9549,
            scaleTorque: 32.68
        },
        {
            name: "J3",
            limits: [
                {
                    vmax: 200,
                    amax: 4000,
                    jmax: 80000
                }
            ],
            scale: 100000
        }
    ],
    frames: [
        {
            name: "default"
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
    kinematicsConfiguration: [
        {
            name: "default",
            participatingJointsCount: 3,
            participatingJoints: [0, 1, 2],
            linearLimits: [
                {
                    vmax: 200,
                    amax: 4000,
                    jmax: 80000
                }
            ],
            inverseDynamicParams: [
                { jointInertia: 0.94, damping: 2.67, friction: 2.4 },
                { jointInertia: 1.2, damping: 2.2, friction: 3.2 },
                { jointInertia: 1.3, damping: 2.3, friction: 3.3 }
            ]
        }
    ],
    safetyDin: [
        {
            name: "Overall safety state (1)",
            type: DIN_SAFETY_TYPE.DIN_SAFETY_TYPE_HIDDEN
        },
        {
            name: "Safety error state (2)",
            type: DIN_SAFETY_TYPE.DIN_SAFETY_TYPE_HIDDEN
        },
        {
            name: "Restart acknowledge state (3)",
            type: DIN_SAFETY_TYPE.DIN_SAFETY_TYPE_HIDDEN
        },
        {
            name: "Drive - STO (4)"
        },
        {
            name: "Drive - SOS (5)"
        },
        {
            name: "Drive - SS1 (6)"
        },
        {
            name: "Drive - SS2 (7)"
        },
        {
            name: "Drive - SLS1 (8)"
        },
        {
            name: "Drive - SBC (9)"
        },
        {
            name: "Drive - Over temperature (10)"
        }
    ],
    safetyDout: [
        {
            name: "Restart Acknowledge (cmd) (0)"
        },
        {
            name: "Control alive (cmd) (1)"
        },
        {
            name: "Drive SS1 (cmd) (2)"
        }
    ]
}
