/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerConfig } from "@glowbuzzer/store"

export const StandardAwTubeConfiguration: GlowbuzzerConfig = {
    din: [
        { name: "Safe Stop" },
        { name: "Software Stop" },
        { name: "Arm 48V Supply" },
        { name: "RC Light Signal" },
        { name: "Braking Chopper Error" },
        { name: "Tool 1" },
        { name: "Tool 2" },
        { name: "UNUSED 7" }
    ],
    dout: [
        { name: "SW HEARTBIT 1" },
        { name: "SW HEARTBIT 2" },
        { name: "Safe Stop Feedback" },
        { name: "Software Stop Feedback" },
        { name: "SPARE 1" },
        { name: "Tool 1" },
        { name: "Tool 2" },
        { name: "SPARE 2" }
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
    ]
}

export const AwTubeL2KinChainParams = {
    kinChainParams: {
        numRows: 6,
        numCols: 5,
        // prettier-ignore
        data: [
            -90, 0, 0, 0, 0,
            0, 0, -90, 525, 0, // 0
            90, 0, 180, 0, 0, // 90
            -90, 0, 0, 0, 475,
            90, 0, 90, 0, 0, // 90
            0, 0, -180, 0, 328
        ],
        // all joints are inverted from a kinematics perspective
        invJointAngles: [-1, -1, -1, -1, -1, -1]
    }
}

export const AwTubeLKinChainParams = {
    kinChainParams: {
        numRows: 6,
        numCols: 5,
        // prettier-ignore
        data: [
            -90, 0, 0, 0, 0,
            0, 0, -90, 725, 0, // 0
            90, 0, 180, 0, 0, // 90
            -90, 0, 0, 0, 675.1,
            90, 0, 90, 0, 0, // 90
            0, 0, -180, 0, 358
        ],
        // all joints are inverted from a kinematics perspective
        invJointAngles: [-1, -1, -1, -1, -1, -1]
    }
}

export const AwTubeL2InverseDynamicParams = [
    {
        urdfFrame: {
            translation: {
                x: 0,
                y: 0,
                z: 0.025
            },
            rpy: {
                r: 0,
                p: 0,
                y: 0
            }
        },
        rigidBodyInertia: {
            m: 17.11,
            h: {
                x: 0.00002,
                y: 0.00337,
                z: 0.0783
            },
            Ixx: 0.10033,
            Iyy: 0.098412,
            Izz: 0.072655,
            Ixy: 0.00004912,
            Ixz: 0.00009505,
            Iyz: 0.00059172
        },
        jointAxis: {
            x: 0,
            y: 0,
            z: -1
        },
        damping: 1,
        friction: 0.1
    },
    {
        urdfFrame: {
            translation: {
                x: 0,
                y: 0.1045,
                z: 0.092
            },
            rpy: {
                r: 1.5708,
                p: 0,
                y: 3.1416
            }
        },
        rigidBodyInertia: {
            m: 37.96,
            h: {
                x: 0,
                y: 0.2217,
                z: 0.1278
            },
            Ixx: 2.44,
            Iyy: 0.224399,
            Izz: 2.365,
            Ixy: 0.00012778,
            Ixz: -4.0029e-17,
            Iyz: 0.117904
        },
        jointAxis: {
            x: 0,
            y: 0,
            z: -1
        },
        damping: 1,
        friction: 0.1
    },
    {
        urdfFrame: {
            translation: {
                x: 0,
                y: 0.525,
                z: 0.0505
            },
            rpy: {
                r: -3.1416,
                p: 0,
                y: -3.1416
            }
        },
        rigidBodyInertia: {
            m: 11.26,
            h: {
                x: -0.00146,
                y: -0.00016,
                z: 0.11997
            },
            Ixx: 0.058338,
            Iyy: 0.075667,
            Izz: 0.048275,
            Ixy: 0.00011853,
            Ixz: 0.00059057,
            Iyz: -0.00003323
        },
        jointAxis: {
            x: 0,
            y: 0,
            z: 1
        },
        damping: 1,
        friction: 0.1
    },
    {
        urdfFrame: {
            translation: {
                x: 0.0874000000000046,
                y: 0,
                z: 0.155
            },
            rpy: {
                r: -1.5707963267949,
                p: 0,
                y: -1.57079632679489
            }
        },
        rigidBodyInertia: {
            m: 9.75,
            h: {
                x: 0.00019,
                y: -0.00169,
                z: 0.35365
            },
            Ixx: 0.108309,
            Iyy: 0.090958,
            Izz: 0.03995142,
            Ixy: -0.00010593,
            Ixz: 0.00003162,
            Iyz: -0.00057054
        },
        jointAxis: {
            x: 0,
            y: 0,
            z: -1
        },
        damping: 1,
        friction: 0.1
    },
    {
        urdfFrame: {
            translation: {
                x: 0,
                y: 0.0874,
                z: 0.3876
            },
            rpy: {
                r: 1.5708,
                p: -1.5708,
                y: 0
            }
        },
        rigidBodyInertia: {
            m: 5.22,
            h: {
                x: 0.00002,
                y: -0.19464,
                z: 0.06264
            },
            Ixx: 0.041937,
            Iyy: 0.02041881,
            Izz: 0.03423788,
            Ixy: -0.00000348,
            Ixz: 0.00001969,
            Iyz: -0.01118275
        },
        jointAxis: {
            x: 0,
            y: 0,
            z: 1
        },
        damping: 1,
        friction: 0.1
    },
    {
        urdfFrame: {
            translation: {
                x: 0,
                y: -0.328,
                z: 0.0911
            },
            rpy: {
                r: 1.5708,
                p: 0,
                y: 0
            }
        },
        rigidBodyInertia: {
            m: 0.41,
            h: {
                x: -0.00011,
                y: -0.00001,
                z: -0.0257
            },
            Ixx: 0.00033004,
            Iyy: 0.00032822,
            Izz: 0.00054011,
            Ixy: -1.28e-7,
            Ixz: -9.4e-7,
            Iyz: -6e-8
        },
        jointAxis: {
            x: 0,
            y: 0,
            z: -1
        },
        damping: 1,
        friction: 0.1
    }
]
