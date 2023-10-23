/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerConfig } from "@glowbuzzer/store"
import { AwTubeL20KinChainParams, StandardAwTubeConfiguration } from "../../../lib/awtube/config"

/**
 * This is the configuration for the AWTUBE L machine that can be pushed to the control if needed
 * (for example on first start)
 */
export const config: GlowbuzzerConfig = {
    ...StandardAwTubeConfiguration,
    machine: [
        {
            name: "AWTUBE 14-40LP-40HP-32-25-125-20",
            busCycleTime: 4
        }
    ],
    points: [
        {
            name: "point1",
            frameIndex: 0,
            translation: {
                x: 210,
                y: 210,
                z: 400
            },
            rotation: {
                x: 1,
                y: 0,
                z: 0,
                w: 0
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
            name: "Robot",
            translation: {
                x: 0,
                y: 0,
                z: 117
            }
        }
    ],
    joint: [
        {
            name: "0",
            limits: [
                {
                    vmax: 0.05,
                    amax: 0.5,
                    jmax: 5
                }
            ],
            scale: 166886,
            jointType: 1,
            negLimit: -80,
            posLimit: 80
        },
        {
            name: "1",
            limits: [
                {
                    vmax: 0.05,
                    amax: 0.5,
                    jmax: 5
                }
            ],
            scale: 166886,
            jointType: 1,
            negLimit: -40,
            posLimit: 40
        },
        {
            name: "2",
            limits: [
                {
                    vmax: 0.05,
                    amax: 0.5,
                    jmax: 5
                }
            ],
            scale: 166886,
            jointType: 1,
            negLimit: 50,
            posLimit: 130
        },
        {
            name: "3",
            limits: [
                {
                    vmax: 0.05,
                    amax: 0.5,
                    jmax: 5
                }
            ],
            scale: 166886,
            jointType: 1,
            negLimit: -170,
            posLimit: 170
        },
        {
            name: "4",
            limits: [
                {
                    vmax: 0.05,
                    amax: 0.5,
                    jmax: 5
                }
            ],
            scale: 166886,
            jointType: 1,
            negLimit: 10,
            posLimit: 170
        },
        {
            name: "5",
            limits: [
                {
                    vmax: 0.05,
                    amax: 0.5,
                    jmax: 5
                }
            ],
            scale: 166886,
            jointType: 1,
            negLimit: -270,
            posLimit: 270
        }
    ],
    kinematicsConfiguration: [
        {
            name: "default",
            frameIndex: 1,
            participatingJoints: [0, 1, 2, 3, 4, 5],
            participatingJointsCount: 6,
            kinematicsConfigurationType: 1,
            supportedConfigurationBits: 7,
            extentsX: [-1000, 1000],
            extentsY: [-1000, 1000],
            extentsZ: [500, 1400],
            sphericalEnvelope: {
                center: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                radius: [500, 1400]
            },
            linearLimits: [
                {
                    vmax: 10,
                    amax: 200,
                    jmax: 4000
                }
            ],
            angularLimits: [
                {
                    vmax: 0.05,
                    amax: 0.5,
                    jmax: 5
                }
            ],
            ...AwTubeL20KinChainParams
        }
    ]
}
