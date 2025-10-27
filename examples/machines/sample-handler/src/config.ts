/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerConfig, JOINT_TYPE, KC_KINEMATICSCONFIGURATIONTYPE } from "@glowbuzzer/store"

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
        }
    ],
    frames: [
        {
            name: "default"
        },
        {
            name: "machine",
            translation: {
                x: 0.3,
                y: 0.335,
                z: -0.205
            }
            // rotation: {
            //     x: -0.70710678,
            //     y: 0,
            //     z: 0,
            //     w: 0.70710678
            // }
        }
    ],
    joint: [
        {
            name: "X",
            limits: [
                {
                    vmax: 0.2,
                    amax: 2,
                    jmax: 20
                }
            ],
            scale: 10000,
            jointType: JOINT_TYPE.JOINT_PRISMATIC
        },
        {
            name: "Y",
            limits: [
                {
                    vmax: 0.2,
                    amax: 2,
                    jmax: 20
                }
            ],
            scale: 10000,
            jointType: JOINT_TYPE.JOINT_PRISMATIC
        },
        {
            name: "Z",
            limits: [
                {
                    vmax: 0.2,
                    amax: 2,
                    jmax: 20
                }
            ],
            scale: 10000,
            jointType: JOINT_TYPE.JOINT_PRISMATIC
        },
        {
            name: "ROT",
            limits: [
                {
                    vmax: 5,
                    amax: 50,
                    jmax: 500
                }
            ],
            scale: 10000,
            jointType: JOINT_TYPE.JOINT_REVOLUTE
        }
    ],
    kinematicsConfiguration: [
        {
            name: "default",
            frameIndex: 1,
            participatingJoints: [0, 1, 2],
            participatingJointsCount: 3,
            kinematicsConfigurationType: KC_KINEMATICSCONFIGURATIONTYPE.KC_CARTESIAN,
            linearLimits: [
                {
                    vmax: 0.2,
                    amax: 2,
                    jmax: 20
                }
            ]
        }
    ]
}
