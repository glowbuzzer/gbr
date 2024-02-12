/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerConfig, JOINT_MODEOFOPERATION, JOINT_TORQUE_MODE } from "@glowbuzzer/store"

export const config: GlowbuzzerConfig = {
    machine: [
        {
            name: "DRIVES CONFIG",
            busCycleTime: 4
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
            jointType: 1,
            scalePos: 166886,
            scaleVel: 9549,
            scaleTorque: 32.68,
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
            scale: 100000
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
            ]
        }
    ],
    serial: [
        {
            name: "default"
        }
    ]
}
