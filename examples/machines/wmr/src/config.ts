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
        }
    ],
    joint: [
        {
            name: "0",
            limits: [
                {
                    vmax: 2,
                    amax: 20,
                    jmax: 200
                }
            ],
            scale: 100000,
            jointType: 1
        },
        {
            name: "1",
            limits: [
                {
                    vmax: 2,
                    amax: 20,
                    jmax: 200
                }
            ],
            scale: 100000,
            jointType: 1
        }
    ],
    frames: [
        {
            name: "default"
        }
    ],
    kinematicsConfiguration: [
        {
            name: "default",
            frameIndex: 0,
            participatingJoints: [0, 1],
            participatingJointsCount: 2,
            kinematicsConfigurationType: 14,
            linearLimits: [
                {
                    vmax: 200,
                    amax: 4000,
                    jmax: 80000
                }
            ],
            angularLimits: [
                {
                    vmax: 2,
                    amax: 10,
                    jmax: 100
                }
            ]
        }
    ]
}
