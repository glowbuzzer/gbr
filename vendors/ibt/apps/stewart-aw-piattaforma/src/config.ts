/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerConfig } from "@glowbuzzer/store"
import { Vector3 } from "three"

function make_coords(
    angle: number, // half angle between corresponding connection points
    radius: number, // distance from centre to connection point
    offset: number // offset rotation of the connection points
) {
    const angles = [0, 120, 240].flatMap(a =>
        [-angle, angle].map(b => ((a + b + offset) / 180) * Math.PI)
    )
    return angles.map(a => new Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0))
}

export const joint_offset = 300

export const base_offset_z = 49.1
export const platform_offset_z = 41

export const base_coordinates = make_coords(6, 200, 30)
    // shift coordinates one place to the left so that pairs are offset rather than matched up with the base
    .map((_v, i, arr) => arr[(i + 5) % 6])

export const platform_coordinates = make_coords(15, 72.5, -30)

const initial_position = new Vector3(0, 0, joint_offset)

export const piattaformaDH = [
    ...base_coordinates,
    ...platform_coordinates,
    initial_position,
    new Vector3(joint_offset, base_offset_z, platform_offset_z) // joint offset, base offset, platform offset
].flatMap(v => v.toArray())

export const config: GlowbuzzerConfig = {
    machine: [
        {
            name: "default",
            busCycleTime: 4,
            heartbeatTimeout: 15000
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
            frameIndex: 1,
            participatingJoints: [0, 1, 2, 3, 4, 5],
            participatingJointsCount: 6,
            kinematicsConfigurationType: 11,
            extentsX: [-500, 500],
            extentsY: [-500, 500],
            extentsZ: [300, 500],
            cylindricalEnvelope: [0, 50],
            sphericalEnvelope: {
                center: {
                    z: 300
                },
                radius: [0, 75]
            },
            linearLimits: [
                {
                    vmax: 80,
                    amax: 1600,
                    jmax: 32000
                }
            ],
            angularLimits: [
                {
                    vmax: 1,
                    amax: 100,
                    jmax: 1000
                }
            ],
            kinChainParams: {
                numRows: 14,
                numCols: 3,
                data: piattaformaDH
            }
        }
    ],
    frames: [
        {
            name: "Default"
        },
        {
            name: "Platform",
            translation: {
                // z: 57
            }
        }
    ],
    tool: [
        {
            name: "Default"
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
