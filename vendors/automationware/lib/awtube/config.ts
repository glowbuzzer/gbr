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
        { name: "SPARE 1" }
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
    ],
    fieldbus: [
        {
            name: "0",
            jointCount: 10,
            RxPdo: {
                machineStatusWordOffset: 0,
                activeFaultOffset: 4,
                faultHistoryOffset: 8,
                heartbeatOffset: 12,
                jointStatuswordOffset: 16,
                jointActualPositionOffset: 36,
                jointActualVelocityOffset: 76,
                jointActualTorqueOffset: 116,
                digitalOffset: 156,
                digitalCount: 8,
                analogOffset: 164,
                analogCount: 6,
                integerOffset: 188,
                integerCount: 2
            },
            TxPdo: {
                machineControlWordOffset: 0,
                gbcControlWordOffset: 4,
                hlcControlWordOffset: 8,
                heartbeatOffset: 12,
                jointControlwordOffset: 16,
                jointSetPositionOffset: 36,
                jointSetVelocityOffset: 76,
                jointSetTorqueOffset: 116,
                digitalOffset: 156,
                digitalCount: 10,
                analogOffset: 164,
                analogCount: 6,
                integerOffset: 188,
                integerCount: 2
            }
        }
    ]
}

export const AwTubeL20KinChainParams = {
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
