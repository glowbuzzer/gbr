/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerConfig } from "@glowbuzzer/store"

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
                    vmax: 200,
                    amax: 4000,
                    jmax: 80000
                }
            ],
            scale: 100000
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
